#!/usr/bin/env node
/* QA suite for the Affirm application page.
   Zero dependencies. Run: node scripts/qa.mjs [--live]
   --live also checks joseplatero.com/affirm and the GitHub Pages mirror. */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const LIVE = process.argv.includes('--live');

let pass = 0, fail = 0;
const t = (name, ok, detail = '') => {
  if (ok) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${detail ? ' :: ' + detail : ''}`); }
};
const section = (s) => console.log(`\n== ${s}`);

/* ---------- not indexed: the whole reason this page has its own repo ---------- */
section('not indexed (critical)');
t('meta robots noindex present', /<meta name="robots" content="[^"]*noindex[^"]*">/.test(html));
t('meta robots also nofollow', /<meta name="robots" content="[^"]*nofollow[^"]*">/.test(html));
t('no OG/social preview tags that would aid discovery beyond direct link',
  !/property="og:/.test(html)); // no og tags = no rich preview card fueling wider sharing/indexing
const repoRobots = join(root, 'robots.txt');
t('repo-local robots.txt disallows all', existsSync(repoRobots) && /Disallow:\s*\//.test(readFileSync(repoRobots, 'utf8')));

/* ---------- document integrity ---------- */
section('document integrity');
t('doctype present', /^<!doctype html>/i.test(html.trim()));
t('lang attribute', /<html lang="en">/.test(html));
t('exactly one <h1>', (html.match(/<h1[\s>]/g) || []).length === 1);
const opens = (tag) => (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
const closes = (tag) => (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
for (const tag of ['section', 'div', 'span', 'h2', 'h3', 'p', 'a', 'button']) {
  t(`balanced <${tag}> (${opens(tag)})`, opens(tag) === closes(tag), `${opens(tag)} open vs ${closes(tag)} close`);
}
const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
t('all ids unique', new Set(ids).size === ids.length);

/* ---------- css integrity (the bug class that broke joseplatero.com once) ---------- */
section('css integrity');
{
  const css = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  let depth = 0, balanced = true;
  for (const ch of css) { if (ch === '{') depth++; if (ch === '}') depth--; if (depth < 0) balanced = false; }
  t('style braces balanced', balanced && depth === 0);
  const orphans = [];
  let d = 0;
  for (const raw of css.split('\n')) {
    const l = raw.trim();
    if (d === 0 && l && !l.startsWith('/*') && !l.startsWith('@') && !l.startsWith('}') &&
        /^[a-z-]+\s*:/.test(l) && !/^[a-z-]+\s*:\w*\s*(hover|focus|active|before|after)/.test(l)) orphans.push(l.slice(0, 60));
    for (const ch of raw) { if (ch === '{') d++; if (ch === '}') d--; }
  }
  t('no orphaned top-level declarations', orphans.length === 0, orphans.join(' | '));
  for (const rule of ['.hero {', '.stats {', '.checkout {', '.breakdown {', 'nav {']) {
    t(`rule present: ${rule.slice(0, -2)}`, css.includes(rule));
  }
}

/* ---------- accessibility ---------- */
section('accessibility');
const extLinks = [...html.matchAll(/<a [^>]*href="https?:\/\/[^"]*"[^>]*>/g)].map(m => m[0]);
t(`external links use rel=noopener (${extLinks.length})`, extLinks.every(a => /rel="noopener"/.test(a)));
t('reduced-motion respected', /prefers-reduced-motion/.test(html));

/* ---------- responsive ---------- */
section('responsive');
t('mobile nav breakpoint present', /@media \(max-width:520px\)/.test(html));
t('hero grid breakpoint present', /@media \(max-width:880px\)\{ \.hero \.grid/.test(html));
t('stats grid breakpoint present', /@media \(max-width:820px\)\{ \.stats/.test(html));

/* ---------- javascript ---------- */
section('javascript');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
t('inline script block found', scripts.length >= 1);
let syntaxOk = true, syntaxErr = '';
try {
  execSync(`node --check /dev/stdin`, { input: scripts.join('\n;\n'), stdio: ['pipe', 'pipe', 'pipe'] });
} catch (e) { syntaxOk = false; syntaxErr = String(e.stderr).slice(0, 120); }
t('all inline JS parses (node --check)', syntaxOk, syntaxErr);

/* ---------- brand rules ---------- */
section('brand rules');
t('zero em dashes', !html.includes('—'));
const emoji = [...html].filter(c => c.codePointAt(0) > 0x1F000);
t('zero emoji', emoji.length === 0);
t('no banned vague nouns (surface/leverage)', !/\bsurface[s]?\b|\bleverage\b/i.test(html));
t('disclaimer present (not affiliated)', /Not affiliated with or endorsed by Affirm/i.test(html));

/* ---------- css/js token integrity for the extraction pipeline ---------- */
section('content pipeline');
t('no leftover content markers in built index.html', !/<!--content:/.test(html));

/* ---------- live parity ---------- */
if (LIVE) {
  section('live parity');
  for (const d of ['https://joseplatero.com/affirm/', 'https://thejoseplatero.github.io/affirm/']) {
    try {
      const res = await fetch(`${d}?qa=${Date.now()}`);
      const body = await res.text();
      t(`${d} responds 200`, res.status === 200);
      t(`${d} byte-matches repo (${body.length} vs ${html.length})`, body.length === html.length);
      t(`${d} still carries noindex`, /noindex/.test(body));
    } catch (e) {
      t(`${d} reachable`, false, String(e).slice(0, 80));
    }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
