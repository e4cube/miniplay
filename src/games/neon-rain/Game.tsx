"use client";
import {useState} from 'react';
import GameShell from '@/components/GameShell';
import {gameBySlug} from '@/data/games';
import {useLocale} from '@/i18n/LocaleContext';
export default function Game(){
  const zh=useLocale()==='zh-CN';
  const [started,setStarted]=useState(false),[run,setRun]=useState(0);
  const desktop='/play/neon-rain/desktop/index.html?mode=desktop';
  const mobile='/play/neon-rain/mobile/index.html?mode=mobile';
  return <GameShell game={gameBySlug('neon-rain')!} restart={()=>{setStarted(false);setRun(n=>n+1)}}>
    <section style={{width:'100%',padding:20,background:'#08131d',color:'#e3f4f4',borderRadius:16}}>
      <p style={{color:'#65e6db',letterSpacing:3}}>NEON RAIN · GAMEVADO</p>
      <h2>{zh?'一座城，漫漫长夜':'Three districts. One long night.'}</h2>
      <p>{zh?'选择适合设备的版本，打开完整游戏。手机请横屏游玩。':'Choose your edition to open the complete game. Hold your phone sideways for mobile play.'}</p>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',margin:'20px 0'}}>
        <a className="btn" href={desktop}>{zh?'电脑版 · 键盘与鼠标':'Desktop · Keyboard & mouse'}</a>
        <a className="btn" href={mobile}>{zh?'手机横屏版 · 方向按键':'Mobile · Landscape & touch'}</a>
        <button className="btn secondary" onClick={()=>setStarted(s=>!s)}>{started?(zh?'关闭试玩':'Close preview'):(zh?'在本页试玩电脑版':'Play desktop here')}</button>
      </div>
      {started?<iframe key={run} src={desktop} title={zh?'霓雨街区电脑版':'Neon Rain desktop'} allow="fullscreen; autoplay" allowFullScreen style={{width:'100%',height:'min(80vh,850px)',minHeight:500,border:0,borderRadius:12}}/>:<div role="img" aria-label={zh?'霓虹夜市街景':'Neon night market'} style={{height:'clamp(180px,35vw,400px)',borderRadius:12,background:"url('/play/neon-rain/mobile/assets/market.webp') center 55% / cover"}}/>}
      <p style={{fontSize:14,color:'#a9c3ce'}}>{zh?'游戏内含暂停、保存、声音与操作指南。旧站存档可通过存档码导入。':'In-game pause, saves, sound and help are included. Import a save code to transfer progress from the old site. In-game text is Chinese.'}</p>
    </section>
  </GameShell>
}
