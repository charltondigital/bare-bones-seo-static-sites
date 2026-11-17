import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const markdowns=readdirSync(root).filter(p=>p.endsWith('.md'));
test('Markdown links to repository files resolve',()=>{
  for(const doc of markdowns) {
    const full=join(root,doc), content=readFileSync(full,'utf8');
    for(const m of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const url=m[1].split('#')[0];
      if(!url || /^(?:https?:|mailto:|#)/i.test(url))continue;
      const target=resolve(dirname(full),decodeURIComponent(url));
      assert.ok(existsSync(target),doc+' references missing local file '+url);
    }
  }
});
test('JSON examples in standards are valid',()=>{
  for(const doc of markdowns) {
    const content=readFileSync(join(root,doc),'utf8');
    for(const m of content.matchAll(/```json\s*\n([\s\S]*?)\n```/g)) {
      assert.doesNotThrow(()=>JSON.parse(m[1]),'Invalid JSON code block in '+doc);
    }
  }
});
