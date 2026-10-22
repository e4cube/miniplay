import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile(new URL('../docs/hexgl/upstream-manifest.json', import.meta.url), 'utf8'));
const allowedPatches = new Set(['index.html']);
const changed = [], missing = [];
let unchanged = 0;
for (const [path, expected] of Object.entries(manifest.files)) {
  let bytes;
  try { bytes = await readFile(new URL(`../public/play/hexgl/${path}`, import.meta.url)); }
  catch { missing.push(path); continue; }
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash === expected.sha256) unchanged++;
  else changed.push(path);
}
console.log(JSON.stringify({ upstream: manifest.commit, files: Object.keys(manifest.files).length, unchanged, changed, missing }, null, 2));
if (missing.length || changed.some(path => !allowedPatches.has(path))) process.exitCode = 1;
