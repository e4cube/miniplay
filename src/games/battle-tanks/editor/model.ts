import type {BattleMap,TileType} from '../maps/schema';
export const cloneMap=(map:BattleMap):BattleMap=>JSON.parse(JSON.stringify(map));
export function paintMap(map:BattleMap,x:number,y:number,tile:TileType):BattleMap {
 const next=cloneMap(map),same=(p:{x:number;y:number})=>Math.floor(p.x)===x&&Math.floor(p.y)===y;
 next.playerSpawns=next.playerSpawns.filter(p=>!same(p));next.enemySpawns=next.enemySpawns.filter(p=>!same(p));
 if(tile==='BASE'){next.tiles[Math.floor(next.base.y)][Math.floor(next.base.x)]='EMPTY';next.base={x:x+.5,y:y+.5}}
 if(tile==='PLAYER_SPAWN'||tile==='ENEMY_SPAWN'){const field=tile==='PLAYER_SPAWN'?'playerSpawns':'enemySpawns',limit=tile==='PLAYER_SPAWN'?2:8;next[field].push({x:x+.5,y:y+.5});while(next[field].length>limit){const p=next[field].shift()!;next.tiles[Math.floor(p.y)][Math.floor(p.x)]='EMPTY'}}
 next.tiles[y][x]=tile;return next;
}
export function clearMap(map:BattleMap):BattleMap {
 const next=cloneMap(map);next.tiles=Array.from({length:map.height},()=>Array<TileType>(map.width).fill('EMPTY'));
 for(const p of next.playerSpawns)next.tiles[Math.floor(p.y)][Math.floor(p.x)]='PLAYER_SPAWN';
 for(const p of next.enemySpawns)next.tiles[Math.floor(p.y)][Math.floor(p.x)]='ENEMY_SPAWN';
 next.tiles[Math.floor(next.base.y)][Math.floor(next.base.x)]='BASE';return next;
}
