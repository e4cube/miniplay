export const TILE_TYPES = ['EMPTY','BRICK','STEEL','WATER','GRASS','ICE','BASE','PLAYER_SPAWN','ENEMY_SPAWN'] as const;
export type TileType = typeof TILE_TYPES[number];
export type Point = {x:number;y:number};
export const ENEMY_KINDS = ['scout','assault','heavy','elite'] as const;
export type EnemyKind = typeof ENEMY_KINDS[number];
export type EnemyWave = {count:number;types:EnemyKind[];interval:number};
export type BattleMap = {id:string;name:string;width:number;height:number;tiles:TileType[][];playerSpawns:Point[];enemySpawns:Point[];base:Point;enemyWaves:EnemyWave[]};
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function validateMap(value:unknown):{ok:true;map:BattleMap}|{ok:false;errors:string[]} {
 if(!object(value))return {ok:false,errors:['Map must be a JSON object.']};
 const errors:string[]=[],m=value,width=m.width,height=m.height;
 const dimensions=Number.isInteger(width)&&Number.isInteger(height)&&(width as number)>=5&&(height as number)>=5&&(width as number)<=40&&(height as number)<=40;
 if(!dimensions)errors.push('Width and height must be integers between 5 and 40.');
 if(typeof m.id!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(m.id))errors.push('Map id must contain 1–64 letters, digits, underscores or hyphens.');
 if(typeof m.name!=='string'||!m.name.trim()||m.name.length>80)errors.push('Map name must contain 1–80 characters.');
 const tilesValid=dimensions&&Array.isArray(m.tiles)&&m.tiles.length===height&&m.tiles.every(r=>Array.isArray(r)&&r.length===width&&r.every(t=>TILE_TYPES.includes(t)));
 if(!tilesValid)errors.push('Tiles must match the declared dimensions and use known tile names.');
 const inside=(p:unknown):p is Point=>object(p)&&typeof p.x==='number'&&typeof p.y==='number'&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&dimensions&&p.x>=.3&&p.y>=.3&&p.x<=(width as number)-.3&&p.y<=(height as number)-.3;
 const spawnValid=(points:unknown,max:number)=>Array.isArray(points)&&points.length>=1&&points.length<=max&&points.every(inside);
 if(!spawnValid(m.playerSpawns,2))errors.push('Provide one or two valid player spawns inside the map.');
 if(!spawnValid(m.enemySpawns,8))errors.push('Provide one to eight valid enemy spawns inside the map.');
 if(!inside(m.base))errors.push('A valid base position inside the map is required.');
 if(!Array.isArray(m.enemyWaves)||m.enemyWaves.length<1||m.enemyWaves.length>30||!m.enemyWaves.every(w=>object(w)&&Number.isInteger(w.count)&&(w.count as number)>=1&&(w.count as number)<=100&&typeof w.interval==='number'&&Number.isFinite(w.interval)&&w.interval>=.25&&w.interval<=30&&Array.isArray(w.types)&&w.types.length>=1&&w.types.length<=4&&w.types.every(t=>ENEMY_KINDS.includes(t))))errors.push('Waves require a count of 1–100, interval of 0.25–30 seconds and known enemy types.');
 if(tilesValid){const tiles=m.tiles as TileType[][],all=[...(Array.isArray(m.playerSpawns)?m.playerSpawns:[]),...(Array.isArray(m.enemySpawns)?m.enemySpawns:[])];
  for(const p of all)if(inside(p)&&['BRICK','STEEL','WATER','BASE'].includes(tiles[Math.floor(p.y)][Math.floor(p.x)]))errors.push('Spawn positions cannot be inside blocked terrain.');
  const bases=tiles.flat().filter(t=>t==='BASE').length;
  if(bases>1)errors.push('Only one base tile is allowed.');
  if(bases===1&&inside(m.base)&&tiles[Math.floor(m.base.y)][Math.floor(m.base.x)]!=='BASE')errors.push('Base tile must match the base position.');
  if(inside(m.base)&&['BRICK','STEEL','WATER'].includes(tiles[Math.floor(m.base.y)][Math.floor(m.base.x)]))errors.push('Base position cannot be inside a wall or water.');
  const occupied=new Set<string>();for(const p of [...all,m.base])if(inside(p)){const key=`${Math.floor(p.x)},${Math.floor(p.y)}`;if(occupied.has(key))errors.push('Spawns and base must occupy different cells.');occupied.add(key)}
 }
 return errors.length?{ok:false,errors:[...new Set(errors)]}:{ok:true,map:value as unknown as BattleMap};
}
