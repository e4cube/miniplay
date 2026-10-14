"use client";
import Link from 'next/link';
import { useCallback,useEffect,useRef,useState } from 'react';
import GameShell from '@/components/GameShell';
import { gameBySlug } from '@/data/games';
import { trackGameEvent } from '@/lib/analytics';
import { createState,advance,type GameState } from './engine/core';
import { officialMaps } from './maps/official';
import { validateMap,type BattleMap } from './maps/schema';
import { preloadBattleAssets } from './assets/PreloadManager';
import { drawBattle,drawMap } from './assets/render';
import { SoundBank } from './assets/SoundBank';
import styles from './BattleTanks.module.css';
type Screen='menu'|'levels'|'battle'|'pause'|'settings'|'custom'|'won'|'lost';
const PROGRESS='battle-tanks-progress';
const eventParams={game_name:'Battle Tanks',game_slug:'battle-tanks'};
const snapshot=(s:GameState)=>({hp:s.tanks.find(t=>t.player===1)?.hp??0,hp2:s.tanks.find(t=>t.player===2)?.hp??0,lives:s.players[0].lives,lives2:s.players[1]?.lives??0,score:s.players.reduce((n,p)=>n+p.score,0),score1:s.players[0].score,score2:s.players[1]?.score??0,enemies:s.remaining,base:s.baseHp,wave:s.wave,buffs:s.tanks.filter(t=>t.player).flatMap(t=>[t.rapid>0?'Rapid Fire':'',t.double>0?'Double Shot':'',t.boost>0?'Speed Boost':'',t.shield>0?'Shield':''].filter(Boolean).map(b=>`P${t.player} ${b}`)).join(' · ')});
function MapPreview({map,art}:{map:BattleMap;art:Map<string,HTMLImageElement>}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const ctx=ref.current?.getContext('2d');if(ctx)drawMap(ctx,map,map.tiles,art,156)},[map,art]);
 return <canvas ref={ref} width={156} height={156} aria-label={`${map.name} map preview`}/>;
}
export default function BattleTanks(){
 const canvas=useRef<HTMLCanvasElement>(null),state=useRef<GameState|null>(null),keys=useRef(new Set<string>()),last=useRef(0),audio=useRef<SoundBank|null>(null),testMap=useRef<BattleMap|null>(null),art=useRef(new Map<string,HTMLImageElement>()),screenRef=useRef<Screen>('menu');
 const [screen,setScreen]=useState<Screen>('menu'),[loading,setLoading]=useState(0),[ready,setReady]=useState(false),[failed,setFailed]=useState<string[]>([]),[allowDegraded,setAllowDegraded]=useState(false),[mode,setMode]=useState<'campaign'|'coop'|'survival'>('campaign'),[level,setLevel]=useState(0),[completed,setCompleted]=useState<number[]>([]),[hud,setHud]=useState({hp:3,hp2:3,lives:3,lives2:3,score:0,score1:0,score2:0,enemies:0,base:3,wave:1,buffs:''}),[returnScreen,setReturnScreen]=useState<Screen>('menu'),[contrast,setContrast]=useState(false),[sound,setSound]=useState(true),[customMaps,setCustomMaps]=useState<BattleMap[]>([]),[best,setBest]=useState(0);
 const navigate=useCallback((next:Screen)=>{screenRef.current=next;setScreen(next)},[]);
 const load=useCallback(async()=>{setReady(false);audio.current??=new SoundBank();setFailed([]);setAllowDegraded(false);const result=await preloadBattleAssets((loaded,total)=>setLoading(Math.round(loaded/total*100)));art.current=result.images;setFailed(result.failed);setReady(true)},[]);
 useEffect(()=>{queueMicrotask(()=>{void load();try{const raw=JSON.parse(localStorage.getItem(PROGRESS)||'[]');if(Array.isArray(raw))setCompleted(raw.filter(n=>Number.isInteger(n)&&n>=0&&n<officialMaps.length));const enabled=localStorage.getItem('battle-tanks-sound')!=='off';setSound(enabled);if(audio.current)audio.current.enabled=enabled;setBest(Number(localStorage.getItem('battle-tanks-survival-best'))||0);const saved=JSON.parse(localStorage.getItem('battle-tanks-custom-maps')||'[]');if(Array.isArray(saved))setCustomMaps(saved.filter(m=>validateMap(m).ok))}catch{}try{if(new URLSearchParams(location.search).has('testMap')){const result=validateMap(JSON.parse(sessionStorage.getItem('battle-tanks-test-map')||'null'));if(result.ok)testMap.current=result.map}}catch{}})},[load]);
 useEffect(()=>()=>{audio.current?.close()},[]);
 const start=useCallback((chosen=level,chosenMode=mode)=>{
  if(!ready||(failed.length&&!allowDegraded))return;
  const map=testMap.current??officialMaps[chosen],s=createState(map,chosenMode==='coop'?2:1,chosenMode);if(chosenMode==='survival')s.remaining=map.enemyWaves[0].count;
  state.current=s;setMode(chosenMode);setLevel(chosen);last.current=0;keys.current.clear();setHud(snapshot(s));navigate('battle');void audio.current?.unlock();trackGameEvent('game_start',eventParams);if(chosenMode==='coop')trackGameEvent('coop_start',eventParams);if(chosenMode==='survival')trackGameEvent('survival_start',eventParams);
  trackGameEvent('level_start',{game_name:'Battle Tanks',game_slug:'battle-tanks',level:chosen+1});
 },[level,mode,ready,failed,allowDegraded,navigate]);
 const exit=()=>{keys.current.clear();if(state.current)state.current.status='paused';navigate('menu')};
 const pause=()=>{if(state.current)state.current.status='paused';keys.current.clear();navigate('pause')};
 const resume=()=>{if(state.current)state.current.status='playing';last.current=0;navigate('battle')};
 const settings=(back:Screen)=>{setReturnScreen(back);navigate('settings')};
 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{if(screenRef.current!=='battle')return;if((e.target as HTMLElement)?.closest('input,select,textarea,[contenteditable=true]'))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter','/'].includes(e.key))e.preventDefault();if(e.key==='Escape'||e.key.toLowerCase()==='p'){keys.current.clear();if(state.current)state.current.status='paused';navigate('pause');return}keys.current.add(e.key.toLowerCase())};
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase()),blur=()=>{keys.current.clear();if(screenRef.current==='battle'){if(state.current)state.current.status='paused';navigate('pause')}},visibility=()=>{if(document.hidden)blur()};
  addEventListener('keydown',down,{passive:false});addEventListener('keyup',up);addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);return()=>{removeEventListener('keydown',down);removeEventListener('keyup',up);removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility)};
 },[navigate]);
 useEffect(()=>{
  let raf=0,hudClock=0;
  const loop=(now:number)=>{
   const s=state.current,dt=Math.min(.032,(now-(last.current||now))/1000);last.current=now;
   if(s&&screenRef.current==='battle'&&s.status==='playing'){
    const k=keys.current,dir1=k.has('w')?'up':k.has('s')?'down':k.has('a')?'left':k.has('d')?'right':null,dir2=k.has('arrowup')?'up':k.has('arrowdown')?'down':k.has('arrowleft')?'left':k.has('arrowright')?'right':null;
    advance(s,[{direction:dir1,fire:k.has('fire')||k.has(' ')},{direction:dir2,fire:k.has('enter')||k.has('/')}],dt);
    for(const event of s.events){audio.current?.play(event.type);if(event.type==='tank_destroyed'||event.type==='player_death'||event.type==='powerup_collect')trackGameEvent(event.type,{...eventParams,level:level+1,score:event.score,player:event.player,powerup:event.powerup})}s.events.length=0;
    hudClock+=dt;if(hudClock>.1||s.status!=='playing'){hudClock=0;setHud(snapshot(s))}
    const status=s.status as GameState['status'];
    if(status==='won'||status==='lost'){navigate(status);audio.current?.play(status);const score=s.players.reduce((n,p)=>n+p.score,0);trackGameEvent(status==='won'?'level_complete':'game_over',{...eventParams,level:level+1,score,result:status==='won'?'win':'loss'});trackGameEvent('game_complete',{...eventParams,score,result:status==='won'?'win':'loss'});if(mode==='survival'){setBest(old=>{const next=Math.max(old,score);try{localStorage.setItem('battle-tanks-survival-best',String(next))}catch{}return next})}if(status==='won'&&!testMap.current&&mode!=='survival')setCompleted(old=>{const next=[...new Set([...old,level])];try{localStorage.setItem(PROGRESS,JSON.stringify(next))}catch{}return next})}
   }
   const c=canvas.current,ctx=c?.getContext('2d');if(s&&c&&ctx)drawBattle(ctx,s,art.current,c.width);
   raf=requestAnimationFrame(loop);
  };raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf);
 },[level,mode,navigate]);
 const touch=(key:string,pressed:boolean)=>{if(screenRef.current!=='battle')return;if(pressed)keys.current.add(key);else keys.current.delete(key)};
 const combat=['battle','pause'].includes(screen);
 const button=(label:string,action:()=>void,primary=false)=><button className={primary?styles.primary:styles.action} onClick={action}>{label}</button>;
 const restart=()=>{trackGameEvent('game_restart',eventParams);start()};
 return <GameShell game={gameBySlug('battle-tanks')!} restart={restart}><section className={`${styles.wrap} ${contrast?styles.contrast:''}`} data-testid="battle-tanks-game">
 {!ready?<div className={styles.loading}><p className={styles.eyebrow}>PREPARING OPERATION</p><h2>Loading Battle...</h2><div className={styles.bar}><i style={{width:`${loading}%`}}/></div><b>{loading}%</b></div>:failed.length&&!allowDegraded?<div className={styles.panel} role="alert"><h2>Art assets unavailable</h2><p>{failed.length} required image(s) failed to load. Retry or explicitly continue with reduced visuals.</p>{button('Retry',()=>{void load()},true)}{button('Continue in degraded mode',()=>setAllowDegraded(true))}</div>:<>
 {failed.length>0&&<p role="status" className={styles.notice}>Reduced visuals: {failed.length} images unavailable.</p>}
 {screen==='menu'&&<div className={styles.hero}><div><p className={styles.eyebrow}>GAMEVADO · ARMORED OPERATIONS</p><h2 className={styles.logo}>BATTLE<br/><span>TANKS</span></h2><p className={styles.tagline}>Hold the line. Defend your base.</p><div className={styles.menu}>{button('CAMPAIGN',()=>{testMap.current=null;setMode('campaign');navigate('levels')},true)}{button('SURVIVAL',()=>{testMap.current=null;setMode('survival');start(0,'survival')})}{button('LOCAL CO-OP',()=>{testMap.current=null;setMode('coop');navigate('levels')})}<Link className={styles.action} href="/games/battle-tanks/editor">MAP EDITOR</Link>{button('CUSTOM MAPS',()=>navigate('custom'))}{button('SETTINGS',()=>settings('menu'))}{testMap.current&&button('PLAY TEST MAP',()=>start(),true)}</div></div><p className={styles.heroFoot}>{officialMaps.length} ORIGINAL BATTLEFIELDS · LOCAL TWO-PLAYER COMBAT · SURVIVAL BEST {best}</p></div>}
 {screen==='custom'&&<div className={styles.panel}><h2>Your maps</h2><div className={styles.menu}>{customMaps.map(map=><button className={styles.action} key={map.id} onClick={()=>{testMap.current=map;start(0,'campaign')}}>{map.name}</button>)}{customMaps.length===0&&<p>No saved maps yet. Create one in the editor.</p>}<Link className={styles.action} href='/games/battle-tanks/editor'>OPEN EDITOR</Link>{button('BACK',()=>navigate('menu'))}</div></div>}
 {screen==='levels'&&<div className={styles.panel}><header className={styles.heading}><div><p className={styles.eyebrow}>SELECT OPERATION</p><h2>{mode==='coop'?'Co-op battlefields':'Campaign battlefields'}</h2></div>{button('Back',()=>navigate('menu'))}</header><div className={styles.levelGrid}>{officialMaps.map((map,i)=>{const unlocked=i===0||completed.includes(i-1)||completed.includes(i);return <button key={map.id} className={styles.levelCard} disabled={!unlocked} onClick={()=>start(i)} aria-label={`Level ${i+1}: ${map.name}${unlocked?'':' locked'}`}><MapPreview map={map} art={art.current}/><span className={styles.levelNumber}>{String(i+1).padStart(2,'0')}</span><strong>{map.name}</strong><small>{i<4?'RECRUIT':i<8?'VETERAN':'ELITE'} · {completed.includes(i)?'COMPLETED':unlocked?'UNLOCKED':'LOCKED'}</small></button>})}</div></div>}
 {combat&&<><div className={styles.hud}><div><small>PLAYER 1 HP</small><strong>{hud.hp} HP · {hud.lives} lives</strong></div>{mode==='coop'&&<div><small>PLAYER 2 HP</small><strong>{hud.hp2} HP · {hud.lives2} lives</strong></div>}<div><small>BASE</small><strong>{hud.base} / 3</strong></div><div><small>{mode==='coop'?'P1 / P2 SCORE':'SCORE'}</small><strong>{mode==='coop'?`${hud.score1} / ${hud.score2}`:String(hud.score).padStart(5,'0')}</strong></div><div><small>ENEMY REMAINING</small><strong>{hud.enemies}</strong></div><div><small>{mode==='survival'?'WAVE':'LEVEL'}</small><strong>{mode==='survival'?hud.wave:level+1}</strong></div>{screen==='battle'&&button('Pause',pause)}</div><p className={styles.battleLabel}>{state.current?.map.name} · Enemies {hud.enemies}</p>{hud.buffs&&<p role="status" className={styles.battleLabel}>{hud.buffs}</p>}<div className={styles.battleLayout}><canvas ref={canvas} width={832} height={Math.round(832*(state.current?.map.height??13)/(state.current?.map.width??13))} style={{aspectRatio:`${state.current?.map.width??13}/${state.current?.map.height??13}`}} className={styles.stage} aria-label="Battle Tanks battlefield"/><div className={styles.mobile}><div className={styles.pad}>{(['w','a','d','s'] as const).map((key,i)=><button key={key} aria-label={['Move up','Move left','Move right','Move down'][i]} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);touch(key,true)}} onPointerUp={()=>touch(key,false)} onPointerCancel={()=>touch(key,false)} onLostPointerCapture={()=>touch(key,false)}>{['▲','◀','▶','▼'][i]}</button>)}</div><button className={styles.fire} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);touch('fire',true)}} onPointerUp={()=>touch('fire',false)} onPointerCancel={()=>touch('fire',false)} onLostPointerCapture={()=>touch('fire',false)}>FIRE</button></div></div><p className={styles.controls}>P1: WASD + Space · P2: Arrows + Enter / Slash · <Link href="/games/battle-tanks/editor">{testMap.current?'Return to editor':'Open Map Editor'}</Link></p></>}
 {screen==='pause'&&<div className={styles.panel} role="dialog" aria-label="Pause menu"><p className={styles.eyebrow}>OPERATION ON HOLD</p><h2>Paused</h2><div className={styles.menu}>{button('RESUME',resume,true)}{button('RESTART',restart)}{button('SETTINGS',()=>settings('pause'))}{button('EXIT',exit)}</div></div>}
 {screen==='settings'&&<div className={styles.panel}><p className={styles.eyebrow}>TACTICAL PREFERENCES</p><h2>Settings</h2><label className={styles.setting}><input type="checkbox" checked={sound} onChange={e=>{setSound(e.target.checked);if(audio.current)audio.current.enabled=e.target.checked;try{localStorage.setItem('battle-tanks-sound',e.target.checked?'on':'off')}catch{}}}/> Sound effects</label><label className={styles.setting}><input type="checkbox" checked={contrast} onChange={e=>setContrast(e.target.checked)}/> High contrast text</label><p>P1: WASD + Space. P2: Arrow keys + Enter. Touch: hold directional controls and Fire.</p>{button('BACK',()=>navigate(returnScreen),true)}</div>}
 {(screen==='won'||screen==='lost')&&<div className={`${styles.result} ${screen==='won'?styles.victory:styles.defeat}`} role="dialog" aria-label={screen==='won'?'Victory':'Game Over'}><p className={styles.eyebrow}>OPERATION {screen==='won'?'COMPLETE':'FAILED'}</p><h2>{screen==='won'?'VICTORY':'GAME OVER'}</h2><p>{state.current?.map.name}</p><dl><div><dt>SCORE</dt><dd>{hud.score}</dd></div><div><dt>ENEMIES REMAINING</dt><dd>{hud.enemies}</dd></div></dl><div className={styles.menu}>{button('RESTART',restart)}{screen==='won'&&level<officialMaps.length-1&&!testMap.current&&mode!=='survival'&&button('NEXT LEVEL',()=>start(level+1),true)}{button('EXIT',exit)}{testMap.current&&<Link className={styles.action} href="/games/battle-tanks/editor">RETURN TO EDITOR</Link>}</div></div>}
 </>}
 </section></GameShell>;
}
