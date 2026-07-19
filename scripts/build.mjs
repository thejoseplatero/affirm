#!/usr/bin/env node
/* Content build for the Affirm application page.
   Reads template.html (<!--content:TOKEN--> markers) + content/*.md and
   stitches them back into index.html.

   Run after editing any file in content/:
     node scripts/build.mjs
   Then: node scripts/qa.mjs, commit, push. */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const template = readFileSync(join(root, 'template.html'), 'utf8');
const contentDir = join(root, 'content');

const files = readdirSync(contentDir).filter(f => f.endsWith('.md') && f !== 'README.md');
const content = {};
for (const f of files) content[f.slice(0, -3)] = readFileSync(join(contentDir, f), 'utf8');

const used = new Set();
const output = template.replace(/<!--content:([a-z0-9-]+)-->/g, (m, token) => {
  if (!(token in content)) throw new Error(`Missing content/${token}.md`);
  used.add(token);
  return content[token];
});

const unused = Object.keys(content).filter(t => !used.has(t));
if (unused.length) console.warn(`Warning: unused content files: ${unused.join(', ')}`);

writeFileSync(join(root, 'index.html'), output);
console.log(`Built index.html from template.html + ${used.size} content files.`);
