import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const folder=fileURLToPath(new URL('../src/games/battle-tanks/maps/official',import.meta.url));
const files=fs.readdirSync(folder).filter(f=>/^map-[\w-]+\.json$/.test(f)).sort();
if(!files.length)throw new Error('No Battle Tanks maps found');
const source="// Generated from map JSON by scripts/generate-battle-maps.mjs.\nimport { validateMap, type BattleMap } from '../schema';\n"+files.map((f,i)=>`import map${i} from './${f}';`).join('\n')+`\nexport const officialMaps: BattleMap[] = [${files.map((_,i)=>'map'+i).join(',')}].map(value=>{const result=validateMap(value);if(!result.ok)throw new Error(result.errors.join(' '));return result.map});\n`;
const target=path.join(folder,'index.ts');if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==source)fs.writeFileSync(target,source);

