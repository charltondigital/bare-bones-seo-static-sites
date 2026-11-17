#!/usr/bin/env node
// Advisory check of simple, static HTTP 301/302 redirects in a _redirects registry.
// Usage: node scripts/check-redirects.mjs [redirect-file] [build-dir]
// Not a substitute for a live HTTP crawl; does not inspect Cloudflare zone redirects.
import { existsSync, readFileSync, readdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
const file=process.argv[2]||'public/_redirects', build=process.argv[3]||'dist';
const warnings=[], rules=new Map();
const warn=s=>{warnings.push(s);console.log('WARNING: '+s)};
const clean=p=>{if(p==='/'||!p)return '/';return p.replace(/\/+$/,'')+'/'};
const generated = new Set();
function walk(dir,path='') {
  if(!existsSync(dir)) return;
  for(const e of readdirSync(dir,{withFileTypes:true})) {
    const rel=(path+'/'+e.name).replace(/\/+/g,'/');
    if(e.isDirectory())walk(join(dir,e.name),rel);
    else if(e.isFile() && e.name.endsWith('.html')){
      generated.add(clean(rel.replace(/\/index\.html$/,'/').replace(/\.html$/,'')));
    }
  }
}
walk(build);
if(!existsSync(file)) console.log('No _redirects registry found; nothing to validate.');
else {
  for (const [i,line] of readFileSync(file,'utf8').split(/\r?\n/).entries()) {
    const value=line.trim();if(!value||value.startsWith('#'))continue;
    const items=value.split(/\s+/);if(items.length<3) {warn('Unrecognized line '+(i+1));continue;}
    const [src,dest,status]=items; if(!/^30[1278]!?$/.test(status))continue;
    if(src.includes('*')||src.includes(':')||dest.includes(':') && !/^https?:\/\//.test(dest)){
      // Dynamic rules require a different evaluator; do not claim they were checked.
      console.log('Skipped dynamic redirect on line '+(i+1));
      continue;
    }
    const key=clean(src);
    if(rules.has(key))warn('Duplicate source '+src+' (line '+(i+1)+')');
    else rules.set(key,{dest,status,line:i+1});
  }
  for(const [src,rule] of rules) {
    let target;
    try {target=new URL(rule.dest,'https://placeholder.invalid');}catch{warn('Invalid target for '+src);continue;}
    if(target.origin!=='https://placeholder.invalid')continue; // external domains need live validation
    const dest=clean(target.pathname);
    if(dest===src) {warn('Self-redirect: '+src);continue;}
    const seen=new Set([src]); let next=dest;
    while(rules.has(next)){
      if(seen.has(next)) {warn('Redirect loop originating at '+src);break;}
      seen.add(next);
      const nextRule=rules.get(next);
      try{const u=new URL(nextRule.dest,'https://placeholder.invalid');if(u.origin!=='https://placeholder.invalid')break;next=clean(u.pathname);}
      catch{break;}
    }
    if(seen.size>1 && !seen.has(next))warn('Redirect chain from '+src+' through '+[...seen].slice(1).join(' -> '));
    if(generated.size && !rules.has(dest) && !generated.has(dest))warn('Redirect target not in built HTML: '+src+' -> '+dest+' (review: may be valid asset or external system)');
  }
}
const summary=warnings.length?warnings.map(v=>'- ⚠️ '+v).join('\n'):'No issues detected in supported static redirect rules.';
console.log(summary);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## Redirect registry (advisory)\n\n'+summary+'\n');
