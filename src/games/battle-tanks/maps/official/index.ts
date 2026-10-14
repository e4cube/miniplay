// Generated from map JSON by scripts/generate-battle-maps.mjs.
import { validateMap, type BattleMap } from '../schema';
import map0 from './map-001.json';
import map1 from './map-002.json';
import map2 from './map-003.json';
import map3 from './map-004.json';
import map4 from './map-005.json';
import map5 from './map-006.json';
import map6 from './map-007.json';
import map7 from './map-008.json';
import map8 from './map-009.json';
import map9 from './map-010.json';
import map10 from './map-011.json';
import map11 from './map-012.json';
export const officialMaps: BattleMap[] = [map0,map1,map2,map3,map4,map5,map6,map7,map8,map9,map10,map11].map(value=>{const result=validateMap(value);if(!result.ok)throw new Error(result.errors.join(' '));return result.map});
