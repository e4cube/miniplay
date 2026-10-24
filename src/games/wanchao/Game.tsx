"use client";
import {useState} from 'react';
import GameShell from '@/components/GameShell';
import {gameBySlug} from '@/data/games';
import {useLocale} from '@/i18n/LocaleContext';
export default function Game(){
 const zh=useLocale()==='zh-CN';const[preview,setPreview]=useState(false),[run,setRun]=useState(0);
 const href=`/play/wanchao/index.html?lang=${zh?'zh':'en'}`;
 return <GameShell game={gameBySlug('wanchao')!} restart={()=>{setPreview(false);setRun(n=>n+1)}}>
  <section style={{padding:20,width:'100%',background:'#111d19',color:'#f0e6cc',borderRadius:16}}>
   <h2 style={{color:'#dab97c'}}>{zh?'十一文明，一条共同的归路。':'Eleven civilizations. One shared road home.'}</h2>
   <p>{zh?'原创网页版 · 五种模式 · 六章剧情 · 中英切换':'Original browser edition · Five modes · Six story chapters · English / 中文'}</p>
   <div style={{display:'flex',flexWrap:'wrap',gap:12,margin:'18px 0'}}>
    <a className="btn" href={href}>{zh?'全屏进入 · 万朝':'Open full game · Wanchao'}</a>
    <button className="btn secondary" onClick={()=>setPreview(v=>!v)}>{preview?(zh?'关闭内嵌游戏':'Close embedded game'):(zh?'在本页游玩':'Play on this page')}</button>
   </div>
   {preview?<iframe key={run} src={href} title={zh?'万朝：裂时战线':'Wanchao: Rift Command'} allow="fullscreen; autoplay" allowFullScreen style={{width:'100%',height:'min(85vh,900px)',minHeight:600,border:0}}/>:<div role="img" aria-label={zh?'裂时城池与时空锚点':'A rift city and temporal anchor'} style={{height:'clamp(200px,38vw,480px)',background:"url('/play/wanchao/assets/story/rift-dawn.png') center / cover",borderRadius:10}}/>}
   <p style={{fontSize:13,opacity:.8}}>{zh?'推荐电脑键鼠。语言可在游戏内切换；存档保存在当前浏览器。':'Keyboard and mouse recommended. Switch languages in-game; saves stay in this browser.'}</p>
  </section>
 </GameShell>;
}
