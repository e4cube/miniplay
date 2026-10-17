"use client";
import {useState} from 'react';
import GameShell from '@/components/GameShell';
import {gameBySlug} from '@/data/games';
import {useLocale} from '@/i18n/LocaleContext';
export default function Game(){
 const zh=useLocale()==='zh-CN';
 const [started,setStarted]=useState(false),[run,setRun]=useState(0);
 return <GameShell game={gameBySlug('starlight-keeper')!} restart={()=>{setStarted(false);setRun(n=>n+1)}}>
 <section style={{width:'100%',padding:16,background:'#0b1729',color:'#f2e7d1',borderRadius:16,textAlign:'center'}}>
 <p>✧ STARLIGHT KEEPER</p><h2>{zh?'替星星点灯':'A forgotten song is waiting among the stars'}</h2>
 <p>{zh?'当前阶段试玩 · 三维探索、声音解谜、音乐创作和旅人的小屋':'Playable milestone · 3D exploration, sound puzzles, music creation and a cozy home'}</p>
 <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',margin:'20px 0'}}>
 <a className="btn" href="/play/starlight-keeper/adventure.html">{zh?'打开完整游戏 ↗':'Open full game ↗'}</a>
 <button className="btn secondary" onClick={()=>setStarted(s=>!s)}>{started?(zh?'关闭试玩':'Close preview'):(zh?'在本页开始':'Play here')}</button></div>
 {started&&<iframe key={run} src="/play/starlight-keeper/adventure.html" title={zh?'替星星点灯三维探索':'Starlight Keeper 3D adventure'} allow="autoplay; fullscreen" allowFullScreen style={{display:'block',width:'100%',height:'80vh',minHeight:580,border:0,borderRadius:12}}/>}
 <p style={{fontSize:14}}>{zh?'游戏内文字目前为中文。推荐完整游戏或横屏；进度保存在当前浏览器。':'In-game text is currently Chinese. Full-page or landscape play recommended. Progress saves in this browser.'}</p>
 </section></GameShell>
}
