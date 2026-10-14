import {expect,test} from '@playwright/test';
import {advance,canMove,collectPowerup,createState,fire,moveTank,pathDirection,spawnEnemy,tick,POWERUPS} from '../src/games/battle-tanks/engine/core';
import {validateMap,type BattleMap} from '../src/games/battle-tanks/maps/schema';
import {clearMap,paintMap} from '../src/games/battle-tanks/editor/model';
const map=():BattleMap=>({id:'test-map',name:'Test battlefield',width:9,height:9,tiles:Array.from({length:9},()=>Array(9).fill('EMPTY')),base:{x:4.5,y:8.5},playerSpawns:[{x:2.5,y:8.5},{x:6.5,y:8.5}],enemySpawns:[{x:2.5,y:.5},{x:6.5,y:.5}],enemyWaves:[{count:2,types:['scout','elite'],interval:.25},{count:1,types:['heavy'],interval:.3}]});
test('validation rejects malformed waves, enormous dimensions and blocked spawns without throwing',()=>{
 for(const change of [{enemyWaves:[null]},{enemyWaves:[{count:-1,types:['unknown'],interval:0}]},{width:100000},{playerSpawns:[null]},{base:[]},{id:5}])expect(validateMap({...map(),...change}).ok).toBe(false);
 const blocked=map();blocked.tiles[8][2]='STEEL';expect(validateMap(blocked).ok).toBe(false);
});
test('tank footprint and swept movement cannot clip corners or tunnel through walls',()=>{
 const s=createState(map()),t=s.tanks[0];s.tiles[8][3]='STEEL';expect(canMove(s,t,2.85,8.5)).toBe(false);moveTank(s,t.id,'right',1);expect(t.x).toBeLessThan(3);expect(t.x).toBeGreaterThanOrEqual(2.5);
});
test('shells cross water and allied tanks cannot hurt each other or the shared base',()=>{
 const s=createState(map(),2);s.tanks[0].x=6.5;s.tanks[0].y=7.5;s.tanks[0].direction='down';fire(s,'p1');tick(s,.2);expect(s.tanks.find(t=>t.id==='p2')!.hp).toBe(3);
 s.tanks[0].x=4.5;s.tanks[0].y=7.5;s.tanks[0].cooldown=0;fire(s,'p1');tick(s,.2);expect(s.baseHp).toBe(3);
 s.tanks[0].x=1.5;s.tanks[0].y=5.5;s.tanks[0].direction='up';s.tanks[0].cooldown=0;s.tiles[4][1]='WATER';fire(s,'p1');tick(s,.2);expect(s.bullets.some(b=>b.y<4)).toBe(true);
});
test('enemy shells damage and ultimately destroy the base, repair restores durability',()=>{
 const s=createState(map());spawnEnemy(s,'scout');const e=s.tanks.find(t=>t.enemy)!;e.x=4.5;e.y=7.5;e.direction='down';e.cooldown=0;
 fire(s,e.id);tick(s,.2);expect(s.baseHp).toBe(2);collectPowerup(s,'p1','repair');expect(s.baseHp).toBe(3);
 for(let i=0;i<3;i++){e.cooldown=0;fire(s,e.id);tick(s,.2)}expect(s.baseAlive).toBe(false);expect(s.status).toBe('lost');
});
test('independent lives respawn with shield, independent scores survive player death',()=>{
 const s=createState(map(),2);s.players[0].score=400;spawnEnemy(s,'scout');const e=s.tanks.find(t=>t.enemy)!;
 e.x=2.5;e.y=7.5;e.direction='down';e.cooldown=0;s.tanks[0].hp=1;fire(s,e.id);tick(s,.2);
 expect(s.players[0].lives).toBe(2);expect(s.players[1].lives).toBe(3);expect(s.status).toBe('playing');tick(s,1.6);
 const revived=s.tanks.find(t=>t.id==='p1')!;expect(revived.shield).toBeGreaterThan(0);expect(revived.score).toBe(400);
});
test('six powerups have observable effects and timed bonuses expire',()=>{
 const s=createState(map()),p=s.tanks[0];s.baseHp=1;p.hp=1;
 for(const kind of POWERUPS)expect(collectPowerup(s,p.id,kind)).toBe(true);
 expect(p.hp).toBe(3);expect(s.baseHp).toBe(3);expect(p.shield).toBe(8);expect(p.boost).toBe(12);fire(s,p.id);expect(s.bullets).toHaveLength(2);expect(p.cooldown).toBeLessThan(.42);
 tick(s,13);expect(p.shield+p.rapid+p.double+p.boost).toBe(0);expect(s.players[0].upgrades).toBe(6);
});
test('pickup collision applies upgrade once and removes expired pickups',()=>{
 const s=createState(map()),p=s.tanks[0];s.pickups.push({x:p.x,y:p.y,kind:'armor',ttl:2});tick(s,.02);tick(s,.02);expect(p.hp).toBe(5);expect(s.players[0].upgrades).toBe(1);expect(s.pickups).toHaveLength(0);
});
test('ice retains momentum on release, ordinary terrain stops and pause freezes all effects',()=>{
 const s=createState(map()),p=s.tanks[0];s.tiles[8][2]='ICE';moveTank(s,p.id,'left',.1);const x=p.x;advance(s,[{direction:null,fire:false}],.05);expect(p.x).toBeLessThan(x);
 s.tiles[8][2]='EMPTY';const stopped=p.x;advance(s,[{direction:null,fire:false}],.05);expect(p.x).toBe(stopped);
 collectPowerup(s,p.id,'shield');s.status='paused';advance(s,[{direction:'left',fire:true}],1);expect(p.x).toBe(stopped);expect(p.shield).toBe(8);
});
test('waves use JSON types and intervals; survival replenishes after a cleared wave',()=>{
 const s=createState(map());advance(s,[],.26);expect(s.tanks.filter(t=>t.enemy).map(t=>t.enemy)).toEqual(['scout']);advance(s,[],.26);expect(s.tanks.some(t=>t.enemy==='elite')).toBe(true);
 const survival=createState(map(),1,'survival');survival.remaining=2;survival.waveKilled=2;survival.waveSpawned=2;advance(survival,[],.01);expect(survival.wave).toBe(2);expect(survival.remaining).toBe(1);expect(survival.status).toBe('playing');advance(survival,[],.31);expect(survival.tanks.some(t=>t.enemy==='heavy')).toBe(true);
});
test('last kill wins finite campaign and score increases for only its owner',()=>{
 const s=createState({...map(),enemyWaves:[{count:1,types:['scout'],interval:1}]},2);spawnEnemy(s,'scout');const e=s.tanks.find(t=>t.enemy)!;s.tanks[0].x=e.x;s.tanks[0].y=e.y+1;s.tanks[0].direction='up';fire(s,'p1');tick(s,.12);expect(s.status).toBe('won');expect(s.players[0].score).toBe(100);expect(s.players[1].score).toBe(0);
});
test('pathfinding routes around steel and water toward the shared base',()=>{
 const s=createState(map());spawnEnemy(s,'scout');const e=s.tanks.find(t=>t.enemy)!;e.x=4.5;e.y=1.5;s.tiles[2][4]='STEEL';expect(pathDirection(s,e,s.map.base)).not.toBe('down');expect(pathDirection(s,e,s.map.base)).not.toBeNull();
});
test('editor clearing retains base and spawns, replacing a spawn removes stale markers',()=>{
 let m=clearMap(map());expect(validateMap(m).ok).toBe(true);m=paintMap(m,1,8,'PLAYER_SPAWN');expect(m.playerSpawns).toHaveLength(2);expect(m.tiles[8][2]).toBe('EMPTY');m=paintMap(m,1,8,'EMPTY');expect(m.playerSpawns).toHaveLength(1);expect(validateMap(m).ok).toBe(true);
});

import {createMod} from '../src/games/battle-tanks/mods';
test('mod overrides alter movement, fire limits and enemy armor without changing the engine',()=>{
 const mod=createMod({id:'qa-mod',tank:{speed:32},weapon:{maxBullets:1},enemies:{heavy:{armor:8}}});const s=createState(map(),1,'campaign',mod),p=s.tanks[0];moveTank(s,p.id,'left',.1);expect(p.x).toBeCloseTo(2.4);fire(s,p.id);p.cooldown=0;expect(fire(s,p.id)).toBe(false);spawnEnemy(s,'heavy');expect(s.tanks.find(t=>t.enemy==='heavy')!.hp).toBe(8);
});

import {officialMaps} from '../src/games/battle-tanks/maps/official';
test('every official map has a demolishable route from players to all enemy spawn lanes',()=>{
 for(const map of officialMaps){const s=createState(map);for(const spawn of map.enemySpawns)expect(pathDirection(s,s.tanks[0],spawn),map.name).not.toBeNull()}
});
test('loss occurs when the final player life is destroyed',()=>{
 const s=createState(map());s.players[0].lives=1;s.tanks[0].hp=1;spawnEnemy(s,'scout');const e=s.tanks.find(t=>t.enemy)!;e.x=2.5;e.y=7.5;e.direction='down';e.cooldown=0;fire(s,e.id);tick(s,.2);expect(s.players[0].lives).toBe(0);expect(s.status).toBe('lost');expect(s.events.filter(e=>e.type==='player_death')).toHaveLength(1);
});
