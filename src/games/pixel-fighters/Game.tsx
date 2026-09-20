/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import GameShell from "@/components/GameShell";
import { gameBySlug } from "@/data/games";
import { trackGameEvent } from "@/lib/analytics";
import { getStored, setStored } from "@/lib/storage";
import { useI18n } from "@/i18n/LocaleContext";
import { InputManager, playerKeys } from "../shared/input/InputManager";
import { chargeFighter, resolveFightRound, spawnFighters, strike, timedWinner, updateFighter, type Fighter } from "./engine";
import shared from "../shared/GameUI.module.css";
import art from "./PixelFighters.module.css";

type SoundKind="attack"|"hit"|"super"|"win";
export default function Fighters(){
  const {locale,t}=useI18n(), input=useRef(new InputManager());
  const [fighters,setFighters]=useState<Fighter[]>(spawnFighters), fightersRef=useRef(fighters);
  const [wins,setWins]=useState([0,0]), winsRef=useRef(wins), [timer,setTimer]=useState(60);
  const [paused,setPaused]=useState(false), [winner,setWinner]=useState<number|null>(null), winnerRef=useRef<number|null>(null);
  const [sound,setSound]=useState(()=>getStored("pixel-fighters:sound",true)), soundRef=useRef(sound);
  const roundEnding=useRef(false),started=useRef(false),timeout=useRef<ReturnType<typeof setTimeout>|null>(null),audio=useRef<AudioContext|null>(null);
  const tone=(kind:SoundKind)=>{if(!soundRef.current)return;const Ctx=window.AudioContext;if(!Ctx)return;const ctx=audio.current??new Ctx();audio.current=ctx;void ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime;const freq={attack:170,hit:90,super:420,win:660}[kind],duration={attack:.08,hit:.14,super:.35,win:.5}[kind];o.type=kind==="hit"?"square":"sine";o.frequency.setValueAtTime(freq,now);if(kind==="super")o.frequency.exponentialRampToValueAtTime(90,now+duration);if(kind==="win")o.frequency.exponentialRampToValueAtTime(990,now+duration);g.gain.setValueAtTime(.055,now);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+duration)};
  const resetRound=()=>{fightersRef.current=spawnFighters();setFighters([...fightersRef.current]);setTimer(60);roundEnding.current=false;winnerRef.current=null;setWinner(null)};
  const emit=(name:"multiplayer_match_start"|"multiplayer_round_end"|"multiplayer_match_end",win?:number)=>trackGameEvent(name,{game_name:"Pixel Fighters",game_slug:"pixel-fighters",...(win===undefined?{}:{winner:`player_${win+1}`}),...(locale==="zh-CN"?{locale}:{})});
  const end=(win:0|1)=>{if(roundEnding.current)return;roundEnding.current=true;fightersRef.current[win].pose="win";tone("win");const result=resolveFightRound(winsRef.current,win);winsRef.current=result.wins;setWins(result.wins);emit("multiplayer_round_end",win);if(result.matchWinner!==null){winnerRef.current=win;setWinner(win);emit("multiplayer_match_end",win)}else timeout.current=setTimeout(resetRound,650)};
  const reset=()=>{if(timeout.current)clearTimeout(timeout.current);winsRef.current=[0,0];setWins([0,0]);started.current=false;winnerRef.current=null;resetRound();trackGameEvent("game_restart",{game_name:"Pixel Fighters",game_slug:"pixel-fighters",...(locale==="zh-CN"?{locale}:{})})};
  useEffect(()=>{soundRef.current=sound},[sound]);
  useEffect(()=>{const manager=input.current,off=manager.onPause(setPaused),unmount=manager.mount();let raf=0,last=performance.now(),elapsed=0,renderAt=0;
    const loop=(now:number)=>{const dt=Math.min(.03,(now-last)/1000);last=now;if(!manager.isPaused()&&winnerRef.current===null&&!roundEnding.current){elapsed+=dt;if(elapsed>=1){elapsed=0;setTimer(v=>{if(v<=1){const win=timedWinner(fightersRef.current);end(win??0);return 0}return v-1})}
      const maps=[playerKeys.one,playerKeys.two],chargeKeys=["r","i"],superKeys=["h","o"];
      fightersRef.current.forEach((fighter,i)=>{const map=maps[i],dir=(manager.isDown(map.left)?-1:0)+(manager.isDown(map.right)?1:0),jump=manager.consume(map.up);updateFighter(fighter,dir,jump,dt);if(manager.isDown(chargeKeys[i]))chargeFighter(fighter,dt);const useSuper=manager.consume(superKeys[i]),heavy=manager.consume(map.heavy),light=manager.consume(map.light);if(useSuper||heavy||light){if(!started.current){started.current=true;emit("multiplayer_match_start")}const kind=useSuper?"super":heavy?"heavy":"light";const hit=strike(fighter,fightersRef.current[1-i],kind);if(kind==="super"&&fighter.pose==="super")tone("super");else tone("attack");if(hit)tone("hit");if(fightersRef.current[1-i].hp<=0)end(i as 0|1)}});
      if(now-renderAt>32){renderAt=now;setFighters(fightersRef.current.map(f=>({...f})))}}raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(raf);off();unmount();if(timeout.current)clearTimeout(timeout.current);void audio.current?.close();audio.current=null}},[locale]);
  return <GameShell game={gameBySlug("pixel-fighters")!} restart={reset}><div className={shared.wrap}>
    <div className={art.combatHud}><div className={art.playerHud}><b>P1 · {wins[0]}</b><div className={art.bar}><i className={art.health} style={{width:`${fighters[0].hp}%`}}/></div><div className={`${art.bar} ${art.energyBar}`}><i className={art.energy} style={{width:`${fighters[0].energy}%`}}/></div></div><strong>{timer}s</strong><div className={art.playerHud}><b>P2 · {wins[1]}</b><div className={art.bar}><i className={art.health} style={{width:`${fighters[1].hp}%`}}/></div><div className={`${art.bar} ${art.energyBar}`}><i className={art.energy} style={{width:`${fighters[1].energy}%`}}/></div></div></div>
    <div className={shared.hud}><button className="btn secondary" onClick={()=>input.current.setPaused(!paused)}>{paused?t.game.resume:t.game.pause}</button><button className="btn secondary" onClick={()=>setSound(v=>{setStored("pixel-fighters:sound",!v);return !v})}>{t.game.sound} {sound?t.game.on:t.game.off}</button></div>
    <p className={shared.mobileNote}>{locale==="zh-CN"?"本游戏仅支持同一键盘双人操作，手机可浏览页面但无法完成双人对战。":"This local two player game requires one shared keyboard. Mobile is supported for viewing, not two-player controls."}</p>
    <div className={art.stage} role="application" aria-label="Pixel Fighters arena">{fighters.map((fighter,i)=>{const style={"left":`${fighter.x}%`,"bottom":`${12+fighter.y}%`,"--sprite":`url('/assets/art/fighters/fighter-${i?"pink":"blue"}-spritesheet.png')`,"--face":fighter.face} as CSSProperties;return <div key={i} className={art.sprite} data-pose={fighter.pose} aria-label={`Player ${i+1} fighter`} style={style}/>})}
      {fighters.map((f,i)=>f.stun>0&&<i key={`hit-${i}`} className={`${art.impact} ${fighters[1-i].pose==="super"?art.superImpact:""}`} style={{left:`${f.x}%`,bottom:`${22+f.y}%`}}/>)}
      {paused&&<h2 className={art.message}>Paused</h2>}{winner!==null&&<h2 className={art.message}>{locale==="zh-CN"?`玩家 ${winner+1} 赢得比赛`:`Player ${winner+1} wins the match`}</h2>}
    </div><p>P1: A/D · W · F/G · R Charge · H Super<br/>P2: ←/→ · ↑ · K/L · I Charge · O Super</p>
  </div></GameShell>
}
