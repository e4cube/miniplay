import { Vector } from '../vendor/cattle-bity/Vector';
import { classicMod, type BattleMod } from '../config/classic';
import type { BattleMap, EnemyKind, Point, TileType } from '../maps/schema';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Mode = 'campaign' | 'coop' | 'survival';
export const POWERUPS = ['rapid', 'double', 'armor', 'speed', 'shield', 'repair'] as const;
export type PowerupKind = typeof POWERUPS[number];
export const powerupLabels: Record<PowerupKind, string> = {rapid:'Rapid Fire',double:'Double Shot',armor:'Armor',speed:'Speed Boost',shield:'Shield',repair:'Repair Base'};
export type Tank = Point & {id:string; direction:Direction; hp:number; speed:number; player?:1|2; enemy?:EnemyKind; cooldown:number; score:number; vx:number; vy:number; shield:number; rapid:number; double:number; boost:number; aiClock:number};
export type Bullet = Point & {id:number; direction:Direction; owner:string; damage:number; enemy:boolean; speed:number};
export type PlayerRecord = {lives:number; score:number; respawn:number; upgrades:number};
export type EngineEvent = {type:'shot'|'explosion'|'tank_destroyed'|'player_death'|'powerup_collect'|'base_hit'|'wave'; player?:number; score?:number; powerup?:PowerupKind};
export type GameState = {
 map:BattleMap; tiles:TileType[][]; tanks:Tank[]; bullets:Bullet[]; baseAlive:boolean; baseHp:number; wave:number; remaining:number;
 status:'playing'|'won'|'lost'|'paused'; nextId:number; mode:Mode; config:BattleMod; players:PlayerRecord[];
 pickups:(Point & {kind:PowerupKind; ttl:number})[]; effects:(Point & {age:number})[]; events:EngineEvent[];
 spawnTimer:number; waveIndex:number; waveSpawned:number; waveKilled:number; destroyed:number; elapsed:number; seed:number;
};
const vectors: Record<Direction,Vector> = {up:new Vector(0,-1),down:new Vector(0,1),left:new Vector(-1,0),right:new Vector(1,0)};
const movement=new Vector();
const directions = Object.keys(vectors) as Direction[];
export const tileAt = (s:GameState,x:number,y:number):TileType => s.tiles[Math.floor(y)]?.[Math.floor(x)] ?? 'STEEL';
export const blocksTank = (tile:TileType) => classicMod.tiles[tile].solid;
const isSolid = (s:GameState,tile:TileType) => s.config.tiles[tile].solid;
export function canMove(s:GameState,t:Tank,x:number,y:number) {
 const r=.28;
 return [tileAt(s,x-r,y-r),tileAt(s,x+r,y-r),tileAt(s,x-r,y+r),tileAt(s,x+r,y+r)].every(tile=>!isSolid(s,tile))
  && !s.tanks.some(other=>other.id!==t.id && Math.hypot(other.x-x,other.y-y)<.62);
}
function translate(s:GameState,t:Tank,dx:number,dy:number) {
 const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/.1));
 for(let i=0;i<steps;i++) {if(!canMove(s,t,t.x+dx/steps,t.y+dy/steps)){t.vx=0;t.vy=0;return false}t.x+=dx/steps;t.y+=dy/steps}return true;
}
export function moveTank(s:GameState,id:string,direction:Direction,dt:number) {
 const t=s.tanks.find(t=>t.id===id);if(!t||s.status!=='playing')return false;
 t.direction=direction;const speed=t.speed/32*(t.boost>0?1.45:1),v=movement.copyFrom(vectors[direction]).multScalar(speed);
 if(tileAt(s,t.x,t.y)==='ICE'){const blend=Math.min(1,dt*5);t.vx+=(v.x-t.vx)*blend;t.vy+=(v.y-t.vy)*blend}
 else {t.vx=v.x;t.vy=v.y}
 return translate(s,t,t.vx*dt,t.vy*dt);
}
function glide(s:GameState,t:Tank,dt:number) {
 if(tileAt(s,t.x,t.y)!=='ICE'){t.vx=0;t.vy=0;return}
 const friction=Math.exp(-dt*1.6);t.vx*=friction;t.vy*=friction;translate(s,t,t.vx*dt,t.vy*dt);
}
export function fire(s:GameState,id:string) {
 const t=s.tanks.find(t=>t.id===id);if(!t||t.cooldown>0||s.status!=='playing')return false;
 const active=s.bullets.filter(b=>b.owner===id).length,max=t.double>0?4:s.config.weapon.maxBullets;
 if(active>=max)return false;
 const v=vectors[t.direction],offsets=t.double>0?[-.12,.12]:[0];
 for(const offset of offsets){if(s.bullets.filter(b=>b.owner===id).length>=max)break;s.bullets.push({id:s.nextId++,x:t.x+v.x*.48-v.y*offset,y:t.y+v.y*.48+v.x*offset,direction:t.direction,owner:id,damage:s.config.tank.bulletDamage,enemy:!!t.enemy,speed:s.config.tank.bulletSpeed/32})}
 t.cooldown=(t.enemy?s.config.enemies[t.enemy].fireRate:t.rapid>0?s.config.tank.fireRate*.42:s.config.tank.fireRate)/1000;
 s.events.push({type:'shot',player:t.player});return true;
}
function tank(s:GameState,p:Point,id:string,player?:1|2,enemy?:EnemyKind):Tank {
 const cfg=enemy?s.config.enemies[enemy]:s.config.tank;
 return {...p,id,player,enemy,direction:enemy?'down':'up',hp:cfg.armor,speed:cfg.speed,cooldown:enemy?.4:0,score:player?s.players[player-1].score:0,vx:0,vy:0,shield:0,rapid:0,double:0,boost:0,aiClock:0};
}
export function createState(map:BattleMap,players=1,mode:Mode='campaign',config:BattleMod=classicMod):GameState {
 const records=Array.from({length:players},()=>({lives:3,score:0,respawn:0,upgrades:0}));
 const s:GameState={map,tiles:map.tiles.map(r=>[...r]),tanks:[],bullets:[],baseAlive:true,baseHp:3,wave:1,remaining:map.enemyWaves.reduce((n,w)=>n+w.count,0),status:'playing',nextId:1,mode,config,players:records,pickups:[],effects:[],events:[],spawnTimer:0,waveIndex:0,waveSpawned:0,waveKilled:0,destroyed:0,elapsed:0,seed:1234567};
 // The base is authoritative even when a legacy map has no BASE marker.
 s.tiles[Math.floor(map.base.y)][Math.floor(map.base.x)]='BASE';
 s.tanks=records.map((_,i)=>tank(s,map.playerSpawns[i]??map.playerSpawns[0],`p${i+1}`,(i+1) as 1|2));
 return s;
}
export function spawnEnemy(s:GameState,kind:EnemyKind='assault') {
 for(let i=0;i<s.map.enemySpawns.length;i++){const p=s.map.enemySpawns[(s.nextId+i)%s.map.enemySpawns.length],t=tank(s,p,`e${s.nextId}`,undefined,kind);if(canMove(s,t,p.x,p.y)){s.nextId++;s.tanks.push(t);return true}}return false;
}
function random(s:GameState) {s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296}
export function collectPowerup(s:GameState,id:string,kind:PowerupKind) {
 const t=s.tanks.find(t=>t.id===id&&t.player);if(!t?.player)return false;
 if(kind==='rapid')t.rapid=12;if(kind==='double')t.double=12;if(kind==='speed')t.boost=12;if(kind==='shield')t.shield=8;
 if(kind==='armor')t.hp=Math.min(5,t.hp+2);if(kind==='repair')s.baseHp=3;
 s.players[t.player-1].upgrades++;s.events.push({type:'powerup_collect',player:t.player,powerup:kind});return true;
}
function destroy(s:GameState,target:Tank,bullet:Bullet) {
 s.effects.push({x:target.x,y:target.y,age:0});s.events.push({type:'explosion'});
 s.tanks=s.tanks.filter(t=>t!==target);
 if(target.enemy){s.remaining=Math.max(0,s.remaining-1);s.waveKilled++;s.destroyed++;
  const owner=s.tanks.find(t=>t.id===bullet.owner);if(owner?.player){const score=s.config.enemies[target.enemy].armor*100;s.players[owner.player-1].score+=score;owner.score=s.players[owner.player-1].score;s.events.push({type:'tank_destroyed',player:owner.player,score})}
  // Deterministic cycle ensures every one of the six upgrades is available.
  if(s.destroyed%2===0)s.pickups.push({x:target.x,y:target.y,kind:POWERUPS[(s.destroyed/2-1)%POWERUPS.length],ttl:20});
  if(s.remaining===0&&s.mode!=='survival')s.status='won';
 }else if(target.player){const p=s.players[target.player-1];p.lives--;p.respawn=1.5;s.events.push({type:'player_death',player:target.player});if(s.players.every(p=>p.lives<=0))s.status='lost'}
}
export function tick(s:GameState,dt:number) {
 if(s.status!=='playing')return;s.elapsed+=dt;
 for(const t of s.tanks){t.cooldown=Math.max(0,t.cooldown-dt);for(const key of ['shield','rapid','double','boost'] as const)t[key]=Math.max(0,t[key]-dt)}
 const kept:Bullet[]=[];
 for(const b of s.bullets){let hit=false;const v=vectors[b.direction],distance=b.speed*dt,steps=Math.max(1,Math.ceil(distance/.12));
  for(let i=0;i<steps&&!hit;i++){b.x+=v.x*distance/steps;b.y+=v.y*distance/steps;const tile=tileAt(s,b.x,b.y),x=Math.floor(b.x),y=Math.floor(b.y);
   if(tile==='BASE'){hit=true;if(b.enemy){s.baseHp=Math.max(0,s.baseHp-b.damage);s.events.push({type:'base_hit'});if(s.baseHp===0){s.baseAlive=false;s.status='lost';s.effects.push({...s.map.base,age:0})}}}
   else if(tile==='BRICK'||tile==='STEEL'){hit=true;if(tile==='BRICK'){s.tiles[y][x]='EMPTY';s.effects.push({x:x+.5,y:y+.5,age:0})}}
   // Water blocks tanks but shells cross it.
   else {const target=s.tanks.find(t=>t.id!==b.owner&&!!t.enemy!==b.enemy&&Math.hypot(t.x-b.x,t.y-b.y)<.34);if(target){hit=true;if(target.shield<=0){target.hp-=b.damage;if(target.hp<=0)destroy(s,target,b)}}}
  }
  if(!hit)kept.push(b);
 }
 s.bullets=kept;
 for(let i=0;i<s.players.length;i++){const p=s.players[i];if(p.lives>0&&!s.tanks.some(t=>t.player===i+1)){p.respawn-=dt;if(p.respawn<=0){const t=tank(s,s.map.playerSpawns[i]??s.map.playerSpawns[0],`p${i+1}`,(i+1) as 1|2);if(canMove(s,t,t.x,t.y)){t.shield=2;s.tanks.push(t)}}}}
 for(const item of s.pickups){item.ttl-=dt;const t=s.tanks.find(t=>t.player&&Math.hypot(t.x-item.x,t.y-item.y)<.65);if(t&&collectPowerup(s,t.id,item.kind))item.ttl=0}
 s.pickups=s.pickups.filter(p=>p.ttl>0);for(const fx of s.effects)fx.age+=dt;s.effects=s.effects.filter(fx=>fx.age<.5);
}
/** Breadth-first navigation permits brick demolition, but never crosses steel or water. */
export function pathDirection(s:GameState,t:Tank,target:Point):Direction|null {
 const sx=Math.floor(t.x),sy=Math.floor(t.y),gx=Math.floor(target.x),gy=Math.floor(target.y),queue:{x:number;y:number;first:Direction|null}[]=[{x:sx,y:sy,first:null}],seen=new Set([`${sx},${sy}`]);
 for(let q=0;q<queue.length;q++){const node=queue[q];if(node.x===gx&&node.y===gy)return node.first;for(const d of directions){const v=vectors[d],x=node.x+v.x,y=node.y+v.y,key=`${x},${y}`;if(x<0||y<0||x>=s.map.width||y>=s.map.height||seen.has(key))continue;const tile=s.tiles[y][x];if(tile==='STEEL'||tile==='WATER')continue;if(tile==='BASE'&&(x!==gx||y!==gy))continue;seen.add(key);queue.push({x,y,first:node.first??d})}}
 return null;
}
function enemyAI(s:GameState,t:Tank,dt:number) {
 t.aiClock-=dt;
 if(t.aiClock<=0){const players=s.tanks.filter(p=>p.player).sort((a,b)=>Math.hypot(a.x-t.x,a.y-t.y)-Math.hypot(b.x-t.x,b.y-t.y));const p=players[0],target=p&&Math.hypot(p.x-t.x,p.y-t.y)<4.5?p:s.map.base;
  const dx=target.x-t.x,dy=target.y-t.y;let direction=pathDirection(s,t,target);
  if(Math.abs(dx)<.32)direction=dy>0?'down':'up';else if(Math.abs(dy)<.32)direction=dx>0?'right':'left';
  if(!direction)direction=directions[Math.floor(random(s)*4)];
  t.direction=direction;t.aiClock=.25+random(s)*.2;
 }
 // Align to the cell center before following the next grid turn.
 const desired=t.direction,horizontal=t.direction==='left'||t.direction==='right',axis=horizontal?t.y:t.x,center=Math.floor(axis)+.5;
 if(Math.abs(center-axis)>.08)moveTank(s,t.id,horizontal?(center>axis?'down':'up'):(center>axis?'right':'left'),dt);
 else if(!moveTank(s,t.id,t.direction,dt))t.aiClock=0;
 t.direction=desired;
 fire(s,t.id);
}
export type Input = {direction:Direction|null;fire:boolean};
export function advance(s:GameState,input:Input[],dt:number) {
 if(s.status!=='playing')return;
 for(let i=0;i<s.players.length;i++){const t=s.tanks.find(t=>t.player===i+1);if(!t)continue;const control=input[i];if(control?.direction)moveTank(s,t.id,control.direction,dt);else glide(s,t,dt);if(control?.fire)fire(s,t.id)}
 const waves=s.map.enemyWaves,w=waves[s.waveIndex%waves.length];
 if(w){s.spawnTimer+=dt;const count=w.count+(s.mode==='survival'?Math.floor(s.waveIndex/waves.length)*2:0),interval=Math.max(.25,w.interval-(s.mode==='survival'?s.waveIndex*.025:0));
  if(s.waveSpawned<count&&s.spawnTimer>=interval&&s.tanks.filter(t=>t.enemy).length<s.config.rules.maxEnemies){const kind=w.types[s.waveSpawned%w.types.length];if(spawnEnemy(s,kind)){s.waveSpawned++;s.spawnTimer=0}}
  if(s.waveKilled>=count){s.waveIndex++;s.wave=s.waveIndex+1;s.waveSpawned=0;s.waveKilled=0;s.spawnTimer=0;if(s.mode==='survival'){const next=waves[s.waveIndex%waves.length];s.remaining=next.count+Math.floor(s.waveIndex/waves.length)*2;s.events.push({type:'wave'})}}
 }
 for(const t of s.tanks.filter(t=>t.enemy))enemyAI(s,t,dt);
 tick(s,dt);
}
