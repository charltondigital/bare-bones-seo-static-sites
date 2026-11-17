#!/usr/bin/env node
/**
 * Advisory robots.txt audit for search and AI-search crawlers.
 * No dependencies, no site changes, never fails a build.
 * Usage: node scripts/check-robots.mjs [robots-file] [sitemap-file]
 * Copy into a site repository with templates/robots-audit.yml.
 */
import { readFileSync, existsSync } from 'node:fs';
import { appendFileSync } from 'node:fs';
const robotsPath = process.argv[2] || 'public/robots.txt';
const sitemapPath = process.argv[3] || 'dist/sitemap.xml';
const bots = [
  ['Googlebot', 'Search'],
  ['Bingbot', 'Search'],
  ['OAI-SearchBot', 'AI search'],
  ['Claude-SearchBot', 'AI search'],
  ['PerplexityBot', 'AI search']
];
const notes = [];
const report = (s) => { notes.push(s); console.log(s); };

function parseRobots(raw) {
  const groups = [];
  let agents = [], rules = [], seenRule = false;
  const flush = () => {
    if (agents.length) groups.push({ agents: [...agents], rules: [...rules] });
    agents = []; rules = []; seenRule = false;
  };
  for (const line of raw.split(/\r?\n/)) {
    const m = line.replace(/#.*$/, '').match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!m) continue;
    const k = m[1].toLowerCase(), v = m[2].trim();
    if (k === 'user-agent') {
      if (seenRule) flush();
      agents.push(v.toLowerCase());
    } else if ((k === 'allow' || k === 'disallow') && agents.length) {
      seenRule = true;
      if (v) rules.push({ type:k, path:v });
    }
  }
  flush();
  return groups;
}
function matchAgent(agent, token) {
  return token === '*' || agent.toLowerCase().includes(token);
}
function isAllowed(groups, agent, path) {
  const matched = groups.map(g => ({
    ...g, specificity:Math.max(-1,...g.agents.filter(t=>matchAgent(agent,t)).map(t=>t==='*'?0:t.length))
  })).filter(g=>g.specificity>=0);
  const max = Math.max(-1,...matched.map(g=>g.specificity));
  if (max<0) return true;
  const rules=matched.filter(g=>g.specificity===max).flatMap(g=>g.rules);
  const candidates = [];
  for (const r of rules) {
    let p=r.path;
    const anchored=p.endsWith('$'); if(anchored) p=p.slice(0,-1);
    const re=new RegExp('^'+p.split('*').map(s=>s.replace(/[|\\{}()[\]^$+?.]/g,'\\$&')).join('.*')+(anchored?'$':''));
    if(re.test(path)) candidates.push({length:p.replaceAll('*','').length, type:r.type, pattern:r.path});
  }
  candidates.sort((a,b)=>b.length-a.length || (a.type==='allow'?-1:1));
  return candidates.length===0 || candidates[0].type==='allow';
}
function sampleSitemap(file) {
  if (!existsSync(file)) return [];
  const xml=readFileSync(file,'utf8');
  const urls=[...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m=>{
    try{return new URL(m[1].replaceAll('&amp;','&')).pathname;} catch {return null;}
  }).filter(Boolean);
  return [...new Set(urls)].slice(0,30);
}

if (!existsSync(robotsPath)) {
  report(`⚠️ robots.txt not found at ${robotsPath}. Check whether it is generated elsewhere; no claim about live crawler access.`);
} else {
  const groups=parseRobots(readFileSync(robotsPath,'utf8'));
  const paths=[...new Set(['/',...sampleSitemap(sitemapPath)])];
  for (const [bot,category] of bots) {
    const blocked=paths.filter(path=>!isAllowed(groups,bot,path));
    if (blocked.length) report(`⚠️ Review ${category} crawler ${bot}: robots.txt may block ${blocked.length} sampled URL(s): ${blocked.slice(0,5).join(', ')}${blocked.length>5?' …':''}. This may be intentional.`);
  }
  if(notes.length===0) report(`✓ No robots.txt blocks detected for the sampled public paths (${paths.length}) and monitored search crawlers.`);
  report('Note: This is a local advisory heuristic, not a live Google/Bing indexing test. Training crawlers are intentionally not flagged.');
}
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Robots.txt crawler access (advisory)\n\n'+notes.map(s=>'- '+s).join('\n')+'\n');
