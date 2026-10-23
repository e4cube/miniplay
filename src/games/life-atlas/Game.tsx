'use client';
import { useEffect, useRef, useState } from 'react';
import GameShell from '@/components/GameShell';
import { gameBySlug } from '@/data/games';
import { getStored, setStored } from '@/lib/storage';
import { useI18n } from '@/i18n/LocaleContext';
import { useGameAnalytics } from '@/lib/useGameAnalytics';
import { advance, automaticChoice, canChoose, choose, createLife, emptySave, focuses, getEvent, parseSave, regions, updateSave, yearlyBudget, type Choice, type Focus, type Life, type Save, type Stat, type Text } from './engine';
import styles from './game.module.css';

const key = 'life-atlas:v1';
const statNames: Record<Stat, Text> = { health:['Health','健康'],joy:['Joy','快乐'],knowledge:['Knowledge','学识'],bonds:['Bonds','关系'] };
const backgrounds: Text[] = [['A resourceful household','需要精打细算的家庭'],['A steady household','生活稳定的家庭'],['A well-supported household','资源充足的家庭']];
const jobs: Text[] = [['Finding your way','探索方向'],['Local professional','本地职员'],['Skilled specialist','技术骨干'],['Team leader','团队负责人']];
export default function LifeAtlas() {
  const {locale}=useI18n(),lang=locale==='zh-CN'?1:0;
  const text=(en:string,zh:string)=>lang?zh:en;
  const t=(value:Text)=>value[lang];
  const [save,setSave]=useState<Save>(emptySave);
  const [ready,setReady]=useState(false),[setup,setSetup]=useState(false);
  const [running,setRunning]=useState(false),[speed,setSpeed]=useState(1),[autopilot,setAutopilot]=useState(false);
  const [region,setRegion]=useState(-1),[seed,setSeed]=useState(''),[error,setError]=useState('');
  const [storageWarning,setStorageWarning]=useState(false),[showAll,setShowAll]=useState(false),[notice,setNotice]=useState('');
  const life=save.life, event=getEvent(life?.pending??null);
  const lifeId=life?.id??null,lifeEnded=life?.ended??false;
  const {start,restart:trackRestart}=useGameAnalytics('life-atlas',life?.ended?'complete':null);
  const gameRoot=useRef<HTMLDivElement>(null);
  useEffect(()=>{queueMicrotask(()=>{setSave(parseSave(getStored<unknown>(key,null)));setReady(true);});},[]);
  useEffect(()=>{
    if(!ready)return;
    if(!setStored(key,save)&&!storageWarning)queueMicrotask(()=>setStorageWarning(true));
  },[ready,save,storageWarning]);
  useEffect(()=>{
    if(!running||!lifeId||lifeEnded)return;
    const timer=window.setInterval(()=>{
      if(document.hidden)return;
      setSave(previous=>{
        if(!previous.life||previous.life.ended)return previous;
        const next=previous.life.pending?(autopilot?automaticChoice(previous.life):previous.life):advance(previous.life);
        return next===previous.life?previous:updateSave(previous,next);
      });
    },2000/speed);
    return()=>window.clearInterval(timer);
  },[running,speed,autopilot,lifeId,lifeEnded]);
  useEffect(()=>{
    const pauseWhenHidden=()=>{if(document.hidden){setRunning(false);setNotice(lang?'离开标签页时已自动暂停。':'Paused while this tab was in the background.');}};
    document.addEventListener('visibilitychange',pauseWhenHidden);
    return()=>document.removeEventListener('visibilitychange',pauseWhenHidden);
  },[lang]);
  function begin(e:React.FormEvent) {
    e.preventDefault();
    const numeric=seed.trim()===''?crypto.getRandomValues(new Uint32Array(1))[0]:Number(seed);
    if(!Number.isInteger(numeric)||numeric<0||numeric>4294967295){setError(text('Use a seed from 0 to 4294967295.','请输入 0 至 4294967295 之间的整数种子。'));return;}
    if(life)trackRestart();start();
    const next=createLife(numeric,region);next.id=Date.now()+'-'+numeric;
    setSave(previous=>({...previous,life:next}));setSetup(false);setRunning(true);setShowAll(false);setError('');setNotice('');
  }
  function changeLife(update:(life:Life)=>Life) {setSave(previous=>previous.life?updateSave(previous,update(previous.life)):previous);}
  function pick(option:Choice) {changeLife(current=>choose(current,option.id));}
  function newStory() {setRunning(false);setSetup(true);setError('');gameRoot.current?.scrollIntoView({behavior:'instant',block:'start'});}
  function focus(next:Focus) {changeLife(current=>({...current,focus:next}));}
  function consequence(option:Choice) {
    const parts=(Object.keys(statNames) as Stat[]).filter(k=>option.effects[k]).map(k=>t(statNames[k])+' '+((option.effects[k]??0)>0?'+':'')+option.effects[k]);
    if(option.cost)parts.push('−'+option.cost+' '+text('credits','点数'));
    if(option.effects.money)parts.push((option.effects.money>0?'+':'')+option.effects.money+' '+text('credits','点数'));
    return parts.join(' · ');
  }
  if(!ready)return <p>{text('Opening your journal…','正在翻开人生图鉴……')}</p>;
  const budget=life?yearlyBudget(life):{income:0,cost:0};
  const stage=life?(life.age<6?text('Early years','幼年'):life.age<18?text('School years','学生时代'):life.age<65?text('Adult life','成年时光'):text('Later years','晚年')):'';
  return <GameShell game={gameBySlug('life-atlas')!} restart={newStory}>
    <div className={styles.atlas} ref={gameRoot} data-testid="life-atlas">
      <header className={styles.masthead}><span className={styles.wordmark}>LIFE<span>ATLAS</span><i aria-hidden="true">✳</i></span><span>{text('A JOURNAL OF POSSIBILITIES','每一段人生，都有另一种可能')}</span></header>
      {storageWarning&&<p role="status" className={styles.warning}>{text('Browser storage is unavailable. Progress will last only until this page closes.','浏览器存储不可用，关闭页面后将无法保留本次进度。')}</p>}
      {(!life||setup)?<section className={styles.setup} aria-labelledby="life-start-title">
        <div className={styles.intro}>
          <span className={styles.kicker}>{text('ONE BEGINNING. MANY POSSIBILITIES.','一个起点，无数种可能。')}</span>
          <h2 id="life-start-title">{text('Every life begins','每一段人生，')}<br/><em>{text('somewhere.','都从某处开始。')}</em></h2>
          <p>{text('A small town. A busy city. A family you did not choose. Follow one person from their first day to their final chapter.','一座小镇，一座忙碌的城市，一个无法选择的家庭。陪一个人，从第一天，走到故事的最后一章。')}</p>
          <div className={styles.landscape} aria-hidden="true"><div className={styles.sun}/><div className={styles.hill}/><span className={styles.houseOne}/><span className={styles.houseTwo}/><div className={styles.path}/><span className={styles.landscapeCaption}>A NEW CHAPTER AWAITS</span></div>
        </div>
        <form onSubmit={begin} className={styles.startForm}>
          <span className={styles.kicker}>{text('YOUR NEXT CHAPTER','你的下一章')}</span>
          <label htmlFor="life-region">{text('Where the story begins','故事开始的地方')}</label>
          <select id="life-region" value={region} onChange={e=>setRegion(Number(e.target.value))}><option value={-1}>{text('Let chance decide','交给命运随机决定')}</option>{regions.map((r,i)=><option value={i} key={r.name[0]}>{t(r.name)}</option>)}</select>
          <p className={styles.hint}>{text('Six fictional regions. Different starting resources and living costs.','六个虚构地区，各有不同的起始资源与生活开销。')}</p>
          <label htmlFor="life-seed">{text('Story seed','故事种子')} <span>{text('(optional)','（选填）')}</span></label>
          <input id="life-seed" inputMode="numeric" maxLength={10} value={seed} onChange={e=>setSeed(e.target.value)} placeholder={text('Leave blank for a new story','留空，开启未知的故事')}/>
          <p className={styles.hint}>{text('The same seed, region and choices produce the same journey.','相同的种子、地区与选择，会走出相同的旅程。')}</p>
          {life&&!life.ended&&<p className={styles.warning}>{text('Beginning again replaces your current unfinished life. Finished lives stay in your journal.','重新开始将替换当前尚未结束的人生，已完结的人生记录会保留。')}</p>}
          {error&&<p role="alert" className={styles.warning}>{error}</p>}
          <button className={styles.primary} type="submit">{text('Begin a life','开始一段人生')} <span aria-hidden="true">↗</span></button>
          {life&&<button type="button" className={styles.secondary} onClick={()=>setSetup(false)}>{text('Return to current life','返回当前人生')}</button>}
          <p className={styles.disclosure}>{text('An original fictional simulation by GameVado. Places, events, money and probabilities are game rules, not real-world statistics or predictions.','GameVado 原创虚构人生模拟。地区、事件、货币与概率均为游戏设定，不代表真实统计或个人预测。')}</p>
        </form>
      </section>:<div className={styles.play}>
        <section className={styles.identity} aria-label={text('Current life','当前人生')}>
          <div><span className={styles.kicker}>{stage} · {text('SEED','种子')} {life.seed}</span><h2>{t(life.name)}<span className={styles.location}>{t(regions[life.region].name)}</span></h2><p>{t(backgrounds[life.background])} · {life.age<18?text('Growing and learning','成长与学习'):life.age>=65?text('Retired','已退休'):t(jobs[life.job])}</p></div>
          <div className={styles.age}><output data-testid="life-age" aria-label={text('Age','年龄')}>{life.age}</output><span>{text('YEARS','岁')}</span></div>
        </section>
        <div className={styles.toolbar}>
          <button className={styles.primary} disabled={life.ended} onClick={()=>{setRunning(value=>!value);setNotice('');}}>{running&&!life.ended?text('Pause','暂停'):text('Resume','继续')}</button>
          <button className={styles.secondary} disabled={life.ended||!!life.pending} onClick={()=>changeLife(advance)}>{text('Next year','下一年')} →</button>
          <label>{text('Pace','速度')} <select aria-label={text('Simulation speed','模拟速度')} value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={1}>1×</option><option value={3}>3×</option><option value={10}>10×</option></select></label>
          <label className={styles.check}><input type="checkbox" checked={autopilot} onChange={e=>setAutopilot(e.target.checked)}/>{text('Autopilot','自动选择')}</label>
          <span className={styles.runStatus} role="status">{life.ended?text('Life complete','人生已完结'):life.pending&&!autopilot?text('Waiting for your decision','等待你的选择'):running?text('Time is moving','时间正在流动'):text('Time is paused','时间已暂停')}</span>
        </div>
        {notice&&<p className={styles.hint}>{notice}</p>}
        <div className={styles.dashboard}>
          <aside className={styles.sidebar}>
            <section className={styles.panel} aria-label={text('Life status','人生状态')}><span className={styles.kicker}>{text('THE EVERYDAY THINGS','生活中的点滴')}</span>{(Object.keys(statNames) as Stat[]).map(stat=><div className={styles.stat} key={stat}><div><label htmlFor={'life-'+stat}>{t(statNames[stat])}</label><b data-testid={'stat-'+stat}>{life.stats[stat]}</b></div><meter id={'life-'+stat} min={0} max={100} value={life.stats[stat]}>{life.stats[stat]}/100</meter></div>)}</section>
            <section className={styles.panel}><span className={styles.kicker}>{text('YOUR RESOURCES','手中的资源')}</span><div className={styles.money}>{life.money.toLocaleString(lang?'zh-CN':'en-US')}<small>{text('credits','点数')}</small></div><p className={styles.hint}>{text('Yearly income','每年收入')} +{budget.income}<br/>{text('Living costs','生活开销')} −{budget.cost}</p><p className={styles.hint}>{text('Fictional game currency','虚构游戏货币')}</p></section>
            <section className={styles.panel}><span className={styles.kicker}>{text('A LIFE IN LITTLE SQUARES','把人生，装进小格子')}</span><div className={styles.yearMap} role="img" aria-label={text(life.age+' years lived out of a maximum of 96', '已度过 '+life.age+' 年，最多 96 年')}>{Array.from({length:96},(_,i)=><span key={i} className={i<life.age?styles.lived:undefined} aria-hidden="true"/>)}</div><p className={styles.hint}>{text('One square, one year.','一格，就是一年。')}</p></section>
          </aside>
          <div className={styles.story}>
            {life.ended?<section className={styles.ending} aria-labelledby="ending-title">
              <span className={styles.kicker}>{text('THE FINAL PAGE','最后一页')}</span><h3 id="ending-title">{text('A life, fully lived.','一生，走到了终点。')}</h3><p>{text('Not every life becomes famous. Every life leaves something behind.','不是每一段人生都会被世界记住，但每一段人生都曾留下什么。')}</p><div className={styles.endingStats}><span>{life.age}<small>{text('years lived','岁月走过')}</small></span><span>{life.log.filter(e=>e.kind==='choice').length}<small>{text('choices made','次人生选择')}</small></span></div><p>{text('This life is saved in your journal below.','这段人生，已保存在下方的图鉴中。')}</p><button className={styles.primary} onClick={newStory}>{text('Discover another life','遇见另一段人生')} ↗</button>
            </section>:event?<section className={styles.decision} aria-labelledby="decision-title" data-testid="life-decision">
              <span className={styles.kicker}>{text('A CROSSROADS','人生的岔路口')} · {life.age}</span><h3 id="decision-title">{t(event.title)}</h3><p>{t(event.body)}</p>
              <div className={styles.choices}>{event.choices.map(option=><button key={option.id} disabled={!canChoose(life,option)} onClick={()=>pick(option)} className={styles.choice}><strong>{t(option.label)} <span aria-hidden="true">↗</span></strong><small>{consequence(option)}</small>{(option.knowledge||option.degree)?<small>{text('Requires','需要')} {option.knowledge?text('knowledge ','学识 ')+option.knowledge:''}{option.degree?text(' · college degree',' · 大学学位'):''}</small>:null}</button>)}</div>
              <p className={styles.hint}>{text('Time waits here unless Autopilot is enabled. A dimmed choice needs more resources or preparation.','不开启自动选择时，时间会停在这里。灰色选项需要更多资源或前期准备。')}</p>
            </section>:<section className={styles.moment}><span className={styles.kicker}>{text('RIGHT HERE, RIGHT NOW','此刻，就在这里')}</span><h3>{t(life.log[0].title)}</h3><p>{t(life.log[0].body)}</p><span className={styles.momentOrnament} aria-hidden="true">✳</span></section>}
            {!life.ended&&<section className={styles.focus}><div><h3>{text('What matters this year?','这一年，你最在意什么？')}</h3><p className={styles.hint}>{text('Change your focus at any time. Aging still affects health.','随时调整生活重心。年龄仍会影响健康。')}</p></div><div className={styles.focusGrid}>{focuses.map(f=><button key={f.id} aria-pressed={life.focus===f.id} title={t(f.detail)} onClick={()=>focus(f.id)}><strong>{t(f.name)}</strong><small>{t(f.detail)}</small></button>)}</div></section>}
            <section className={styles.journal} aria-labelledby="life-journal-title"><div className={styles.journalHeading}><h3 id="life-journal-title">{text('The story so far','走过的故事')}</h3><span>{text('NEWEST FIRST','最近发生的事')}</span></div><ol>{life.log.slice(0,showAll?180:12).map((entry,i)=><li key={life.log.length-i} className={entry.kind==='choice'?styles.choiceEntry:undefined}><span>{entry.age.toString().padStart(2,'0')}</span><div><h4>{t(entry.title)}</h4><p>{t(entry.body)}</p></div></li>)}</ol>{life.log.length>12&&<button className={styles.secondary} onClick={()=>setShowAll(value=>!value)}>{showAll?text('Show recent entries','只看最近的故事'):text('Read earlier chapters','翻阅更早的篇章')}</button>}</section>
          </div>
        </div>
        <p className={styles.disclosure}>{text('Life Atlas is an original fictional simulation. Game probabilities and credits do not describe real places or predict real lives. Progress saves only in this browser; clearing browser data removes it.','人生图鉴是原创虚构模拟游戏。游戏概率与点数不描述真实地区，也不预测现实人生。进度只保存在当前浏览器，清理浏览器数据会移除存档。')}</p>
      </div>}
      {save.history.length>0&&<section className={styles.history} aria-labelledby="life-history-title"><div className={styles.journalHeading}><h3 id="life-history-title">{text('Lives in your atlas','图鉴中的人生')}</h3><span>{save.history.length}/20</span></div><div className={styles.historyGrid}>{save.history.map(item=><details key={item.id}><summary><span>{t(item.name)}<small>{t(regions[item.region].name)}</small></span><b>{item.age}<small>{text('years','岁')}</small></b></summary><p>{text('Final chapter','人生终章')} · {item.money.toLocaleString()} {text('credits','点数')}</p>{(Object.keys(statNames) as Stat[]).map(stat=><p key={stat}>{t(statNames[stat])} <b>{item.stats[stat]}/100</b></p>)}</details>)}</div><p className={styles.hint}>{text('The latest 20 completed lives are kept on this device.','本机保留最近 20 段已完结的人生。')}</p></section>}
    </div>
  </GameShell>;
}
