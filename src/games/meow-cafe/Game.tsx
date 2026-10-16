"use client";
import {useState} from 'react';
import GameShell from '@/components/GameShell';
import {gameBySlug} from '@/data/games';
import {useLocale} from '@/i18n/LocaleContext';
export default function Game(){
 const zh=useLocale()==='zh-CN';
 const [started,setStarted]=useState(false),[run,setRun]=useState(0);
 return <GameShell game={gameBySlug('meow-cafe')!} restart={()=>{setStarted(false);setRun(n=>n+1)}}>
  <section style={{width:'100%',padding:20,borderRadius:16,background:'#f8f3e9',color:'#504637',textAlign:'center'}}>
   <p style={{letterSpacing:3}}>MEOW CAFÉ · GAMEVADO</p>
   <h2>{zh?'咖啡香，猫咪和你的慢时光':'Coffee, cats and a little time for yourself'}</h2>
   <p>{zh?'电脑点击、手机竖屏都能玩。制作饮品，陪伴猫咪，布置小店。':'Brew drinks, befriend cats and decorate your café. Play with a mouse or portrait touch controls.'}</p>
   <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',margin:'20px 0'}}>
    <a className="btn" href="/play/meow-cafe/index.html">{zh?'打开完整游戏 · 电脑 / 手机':'Open full game · Desktop / mobile'}</a>
    <button className="btn secondary" onClick={()=>setStarted(s=>!s)}>{started?(zh?'关闭试玩':'Close preview'):(zh?'在本页开始游戏':'Play here')}</button>
   </div>
   {started?<iframe key={run} src="/play/meow-cafe/index.html" title={zh?'喵呜咖啡馆':'Meow Café'} allow="autoplay; fullscreen" allowFullScreen style={{width:'100%',maxWidth:480,height:820,maxHeight:'85vh',border:0,borderRadius:18}}/>:<p style={{fontSize:64,margin:24}} aria-hidden="true">🐈 ☕ 🪴</p>}
   <p style={{fontSize:14}}>{zh?'自动保存至当前浏览器；原站存档不会自动迁移。':'Progress saves in this browser. Saves from another website do not transfer automatically.'}</p>
  </section>
 </GameShell>
}
