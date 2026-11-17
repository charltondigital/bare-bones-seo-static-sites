import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const script = n => join(repoRoot, 'examples', 'scripts', n);
function fixture(fn) {
  const dir=mkdtempSync(join(tmpdir(),'bare-bones-test-'));
  try { return fn(dir); } finally { rmSync(dir,{recursive:true,force:true}); }
}
function run(name,args) {
  return execFileSync(process.execPath,[script(name),...args],{encoding:'utf8'});
}
test('external link inventory deduplicates links and records referring pages',()=>{
  fixture(dir=>{
    const build=join(dir,'dist');mkdirSync(join(build,'about'),{recursive:true});
    writeFileSync(join(build,'index.html'),'<a href="https://external.test/a?x=1&amp;y=2">external</a><a href="https://external.test/a?x=1&amp;y=2">duplicate</a><a href="/about/">internal</a><a href="mailto:hello@example.com">mail</a>');
    writeFileSync(join(build,'about','index.html'),'<a href="https://external.test/a?x=1&amp;y=2">external again</a>');
    const output=join(dir,'reports','external.csv');
    const log=run('external-links.mjs',[build,'https://site.test',output]);
    assert.match(log,/Exported 2 external link\/source pairs/);
    const csv=readFileSync(output,'utf8');
    assert.match(csv,/external_url,source_page/);
    assert.match(csv,/"\/about\/"/);
    assert.match(csv,/"\/"/);
    assert.doesNotMatch(csv,/mailto/);
  });
});
test('redirect analyzer reports chain and loop',()=>{
  fixture(dir=>{
    const file=join(dir,'_redirects');writeFileSync(file, '/old/ /middle/ 301\n/middle/ /latest/ 301\n/loop-a/ /loop-b/ 301\n/loop-b/ /loop-a/ 301\n');
    const log=run('check-redirects.mjs',[file,join(dir,'dist')]);
    assert.match(log,/Redirect chain from \/old\//);
    assert.match(log,/Redirect loop originating at \/loop-a\//);
  });
});
test('robots checker warns about blocked search bots but not harmless rules',()=>{
  fixture(dir=>{
    const file=join(dir,'robots.txt');
    writeFileSync(file,'User-agent: *\nDisallow: /\n');
    assert.match(run('check-robots.mjs',[file]),/Review Search crawler Googlebot/);
    writeFileSync(file,'User-agent: *\nAllow: /\n');
    assert.match(run('check-robots.mjs',[file]),/No robots.txt blocks detected/);
  });
});
