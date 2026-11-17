#!/usr/bin/env node
// Inventory outgoing HTTP(S) hyperlinks in generated static HTML.
// Usage: node scripts/external-links.mjs [build-dir] [site-origin] [output-csv]
// Run after the site build. No network requests or external dependencies.
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, relative, dirname, sep } from 'node:path';
const [root='dist', origin='https://example.com', output='seo/reports/external-links.csv'] = process.argv.slice(2);
let site;
try { site = new URL(origin).origin; } catch { console.error('Pass the production site origin as argument 2.'); process.exitCode=1; }
const decode = v => v.replace(/&(?:amp|quot|apos|lt|gt|#(\d+)|#x([\da-f]+));/gi, (all,decimal,hex)=>{
  if(decimal || hex) { const n=parseInt(decimal||hex,hex?16:10); return n>=0 && n<=0x10ffff ? String.fromCodePoint(n) : all; }
  return ({'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>'})[all.toLowerCase()]||all;
});
const csv = v=>'"'+String(v).replaceAll('"','""')+'"';
const outputRows = new Set();
async function walk(dir) {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const p=join(dir,entry.name);
    if(entry.isDirectory()) await walk(p);
    else if(entry.isFile() && entry.name.endsWith('.html')) {
      let pathname='/'+relative(root,p).split(sep).join('/');
      pathname=pathname.replace(/(?:^|\/)index\.html$/,'/').replace(/\/+/g,'/');
      const page=new URL(pathname,site);
      const html=await readFile(p,'utf8');
      // Only hyperlinks (<a href=...>), not image/script/CSS resource URLs.
      const anchors=html.match(/<a\b[^>]*>/gi)||[];
      for(const tag of anchors) {
        const match=tag.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        if(!match) continue;
        const raw=decode(match[1]??match[2]??match[3]);
        try {
          const url=new URL(raw,page);
          if(!['http:','https:'].includes(url.protocol) || url.origin===site) continue;
          url.hash=''; // fragment variants are not separate link-checking destinations
          outputRows.add(csv(url.href)+','+csv(page.pathname));
        } catch { /* Ignore invalid/non-web hrefs; not a link validator. */ }
      }
    }
  }
}
if(site) {
  try {
    await walk(root);
    await mkdir(dirname(output),{recursive:true});
    const lines=['external_url,source_page',...Array.from(outputRows).sort()];
    await writeFile(output,lines.join('\n')+'\n');
    console.log('Exported '+outputRows.size+' external link/source pairs to '+output);
  } catch(e) { console.error('Inventory failed:',e.message); process.exitCode=1; }
}
