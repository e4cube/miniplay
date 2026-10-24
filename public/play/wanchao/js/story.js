'use strict';
// Campaign rules and narrative share stable chapter ids. The simulation owns all objective state.
W.storyArt={dawn:'assets/story/rift-dawn.png',council:'assets/story/council.png',final:'assets/story/final-anchor.png'};
W.chapters=[
 {
  "id": "rift",
  "name": "第一章 · 裂隙初鸣",
  "enemy": "rome",
  "funds": 2600,
  "enemyFunds": 1500,
  "art": "dawn",
  "goal": {
   "type": "destroy"
  },
  "desc": "建立营地，摧毁控制裂隙的敌方军令中枢。",
  "briefing": "一道裂隙将十一种纪年压在同一个今天。唐使陆昭与罗马工程官莉维娅在荒原相遇，发现受定序装置驱使的军队封锁了归路。击破军令中枢，寻找尚未消失的生还者。",
  "pre": [
   {
    "speaker": "陆昭 · 唐使",
    "text": "地图上没有这里。先让所有人活过今晚。"
   },
   {
    "speaker": "莉维娅 · 罗马工程官",
    "text": "那道光吞掉了我的城。要找答案，先拆掉封锁。"
   }
  ],
  "post": [
   {
    "speaker": "伊娥 · 雅典记录官",
    "text": "俘获的记录里，十一种纪年写着同一个今天。"
   },
   {
    "speaker": "陆昭",
    "text": "北方的档案楼还亮着灯。先把活人的记录带出来。"
   }
  ],
  "comms": [
   {
    "id": "economy",
    "at": 12,
    "speaker": "陆昭",
    "text": "民夫已在采集。市集能补充军资，民居能容纳更多战兵。"
   },
   {
    "id": "firstbuild",
    "when": "built",
    "speaker": "伊娥",
    "text": "新营地立起了。不同年代的人，正在同一面军令下劳作。"
   },
   {
    "id": "enemy",
    "when": "contact",
    "speaker": "陆昭",
    "text": "发现敌军！长枪护住弓手，攻城器留给建筑。"
   }
  ]
 },
 {
  "id": "archive",
  "name": "第二章 · 不落之城",
  "enemy": "yuan",
  "funds": 3400,
  "enemyFunds": 2400,
  "art": "dawn",
  "goal": {
   "type": "defend",
   "seconds": 180
  },
  "desc": "保护青灯档案楼与己方中枢，坚持180秒。敌军从三面进攻。",
  "briefing": "档案楼没有黄金，只有正在消失的城邦名册。定序同盟的秦将商砚拒绝焚毁它，决定与联军共同守城。保护青灯档案楼180秒，让抄录员保存这些文明曾经存在的证据。",
  "pre": [
   {
    "speaker": "伊娥",
    "text": "楼里没有黄金，只有我们曾经存在的证据。"
   },
   {
    "speaker": "商砚 · 秦将",
    "text": "我奉命接管档案，不是奉命烧掉它。守住这里。"
   }
  ],
  "post": [
   {
    "speaker": "莉维娅",
    "text": "被抹去的不只是城墙，连人们的记忆都在褪色。"
   },
   {
    "speaker": "伊娥",
    "text": "有三个盟约的使者带着求援信被困在东边。我们得找到他们。"
   }
  ],
  "comms": [
   {
    "id": "wall",
    "at": 10,
    "speaker": "阿勒岚",
    "text": "档案楼在营地东北。箭楼可以补足兵力，修复军令能挽救受损建筑。"
   },
   {
    "id": "rush",
    "at": 75,
    "speaker": "陆昭",
    "text": "第二路追兵来了。保住档案楼，时间站在我们这一边！"
   },
   {
    "id": "last",
    "at": 145,
    "speaker": "伊娥",
    "text": "抄录就快完成了。再守住最后一段时间。"
   }
  ]
 },
 {
  "id": "envoys",
  "name": "第三章 · 共同之路",
  "enemy": "qing",
  "funds": 3100,
  "enemyFunds": 2600,
  "art": "council",
  "goal": {
   "type": "rescue",
   "required": 2
  },
  "desc": "抵达东部被困营地，救出3名使者，并护送至少2名返回己方中枢。",
  "briefing": "通途盟约、定序同盟、守灯公议的使者都被困在东部废营。他们互不信任，却共享同一条归路。用战斗部队接近营地解除围困，随后护送至少两名使者返回己方中枢。",
  "pre": [
   {
    "speaker": "阿勒岚 · 元信使",
    "text": "三条路都有人追。给我一条能回家的路就够了。"
   },
   {
    "speaker": "陆昭",
    "text": "他们来自不同盟约，但今天都由我们护送。"
   }
  ],
  "post": [
   {
    "speaker": "阿勒岚",
    "text": "两个人带回了求援，第三封信也不能被遗忘。"
   },
   {
    "speaker": "伊娥",
    "text": "我们需要一场真正的议会。让十一席都有机会说出自己的名字。"
   }
  ],
  "comms": [
   {
    "id": "site",
    "at": 8,
    "speaker": "阿勒岚",
    "text": "使者营地已标在小地图。战兵进入金色圆环即可救援，民夫不能解除围困。"
   },
   {
    "id": "released",
    "when": "rescued",
    "speaker": "莉维娅",
    "text": "使者开始撤离！他们没有甲胄，请守住返营道路。"
   },
   {
    "id": "home",
    "when": "delivered",
    "speaker": "陆昭",
    "text": "已有使者抵营。继续接应，至少两人安全返回。"
   }
  ]
 },
 {
  "id": "council",
  "name": "第四章 · 无王之盟",
  "enemy": "sparta",
  "funds": 3500,
  "enemyFunds": 3200,
  "art": "council",
  "goal": {
   "type": "capture",
   "hold": 30,
   "required": 2
  },
  "desc": "夺取两座议会信标：战兵在圈内、无敌军干扰时各占领30秒。",
  "briefing": "十一文明不愿由任何一朝决定谁能留在历史里。派战斗部队占领两座议会信标，每座持续驻守30秒，恢复跨盟通信。敌军进入时暂停占领；我方离开后未完成进度缓慢回落，完成后永久保留。",
  "pre": [
   {
    "speaker": "陆昭",
    "text": "十一席都要开口，没有谁能替别人决定是否存在。"
   },
   {
    "speaker": "商砚",
    "text": "定序同盟要秩序。我现在知道，秩序不能建立在空城上。"
   }
  ],
  "post": [
   {
    "speaker": "伊娥",
    "text": "议会通过共存议案：锚点由三盟共同持有，无人加冕。"
   },
   {
    "speaker": "莉维娅",
    "text": "装置的夺用者叫沈衡。他一直在修改同一天。"
   }
  ],
  "comms": [
   {
    "id": "capture",
    "at": 10,
    "speaker": "伊娥",
    "text": "两座信标无需民夫建造。用战兵进入圆环，占领计时才会启动。"
   },
   {
    "id": "secured",
    "when": "captured",
    "speaker": "莉维娅",
    "text": "第一处信标归于盟约。守军可以转移，已完成的占领不会失去。"
   }
  ]
 },
 {
  "id": "names",
  "name": "第五章 · 失败者之名",
  "enemy": "ming",
  "funds": 4400,
  "enemyFunds": 4000,
  "art": "final",
  "goal": {
   "type": "timed",
   "seconds": 360
  },
  "desc": "在360秒倒计时结束前摧毁敌方全部军令中枢。",
  "briefing": "宋籍工程师沈衡想抹去那次失败的实验，救回女儿沈星。他每修正一次过去，就有其他文明的人从未出生。360秒后，新一轮历史删改会完成。必须在归零前摧毁全部校时中枢，保住失败者的名字。",
  "pre": [
   {
    "speaker": "沈衡 · 宋籍工程师",
    "text": "我只想让那次失败没有发生。她本该活着。"
   },
   {
    "speaker": "莉维娅",
    "text": "你救一个人的方法，正在让千万个人从未出生。"
   }
  ],
  "post": [
   {
    "speaker": "沈衡",
    "text": "每修正一次，她都离我更远……为什么？"
   },
   {
    "speaker": "伊娥",
    "text": "因为你删掉了她爱过的世界。"
   }
  ],
  "comms": [
   {
    "id": "clock",
    "at": 15,
    "speaker": "陆昭",
    "text": "六分钟是硬限时。训练攻城车，对建筑伤害更高；右键可设置生产建筑的集结点。"
   },
   {
    "id": "half",
    "at": 180,
    "speaker": "伊娥",
    "text": "时间过半。不要为了清理每个守军而错过中枢。"
   },
   {
    "id": "urgent",
    "at": 300,
    "speaker": "阿勒岚",
    "text": "只剩一分钟！把攻城军团集中到最后的中枢。"
   }
  ]
 },
 {
  "id": "anchor",
  "name": "第六章 · 共存之锚",
  "enemy": "qin",
  "funds": 4800,
  "enemyFunds": 4500,
  "art": "final",
  "goal": {
   "type": "finale",
   "hold": 20,
   "required": 3
  },
  "desc": "占领三座稳定信标以解除核心护盾，再摧毁裂时核心。",
  "briefing": "共存议案已经通过，但最后的核心仍在校准世界。三座稳定信标分别驻守20秒后，才能解除核心保护。稳定锚点，摧毁核心，并保住己方中枢。让所有纪年继续向前，而不是留下唯一的胜者。",
  "pre": [
   {
    "speaker": "陆昭",
    "text": "先稳住三座锚点。毁掉核心，也必须保住里面的世界。"
   },
   {
    "speaker": "沈衡",
    "text": "如果关闭它，我就永远失去她。"
   },
   {
    "speaker": "伊娥",
    "text": "我们不能替你选择遗忘。但我们能把她的名字留下。"
   }
  ],
  "post": [
   {
    "speaker": "商砚",
    "text": "没有哪一朝能命令历史只记住胜者。"
   },
   {
    "speaker": "陆昭",
    "text": "把她的名字留下。把所有人的名字留下。"
   },
   {
    "speaker": "伊娥",
    "text": "裂隙仍在，十一种纪年继续向前。无王之盟，从今天开始。"
   }
  ],
  "comms": [
   {
    "id": "shield",
    "at": 9,
    "speaker": "伊娥",
    "text": "核心当前免疫伤害。先占领三座稳定信标，进度会显示在目标栏。"
   },
   {
    "id": "unlocked",
    "when": "unlocked",
    "speaker": "陆昭",
    "text": "护盾已解除！集中攻城火力，结束沈衡的删改。"
   }
  ]
 }
];
W.story={
 init(g){if(g.config.mode!=='campaign')return;const ch=W.chapters[g.config.chapter||0],type=ch.goal.type;g.story={chapter:ch.id,goal:type,events:[],comms:[],beacons:[],rescued:false,vips:[],delivered:[],failed:null,spawned:[]};let s=g.story;
 if(type==='defend'){g.entities=g.entities.filter(e=>e.team===0);let archive=g.add('market',0,g.home.x+145,g.home.y-135);archive.storyLabel='青灯档案楼';archive.maxHp=1800;archive.hp=1800;s.protected=archive.id;g.add('tower',0,g.home.x+60,g.home.y-150);g.add('tower',0,g.home.x+170,g.home.y+40);}
 if(type==='rescue'){s.site={x:1500,y:1080};for(let i=0;i<5;i++)g.add(i<3?'infantry':'archer',1,1410+i*35,1000);}
 if(type==='capture'||type==='finale'){let points=type==='capture'?[{x:920,y:840},{x:1500,y:650}]:[{x:800,y:850},{x:1280,y:1050},{x:1510,y:550}];s.beacons=points.map((p,i)=>({...p,id:i,progress:0,captured:false,label:(type==='finale'?'稳定':'议会')+'信标 '+(i+1)}));for(let p of points)for(let i=0;i<3;i++)g.add(i===2?'archer':'infantry',1,p.x+(i-1)*35,p.y-30);if(type==='finale'){let core=g.entities.find(e=>e.team===1&&e.type==='hq');s.core=core.id;core.storyLabel='裂时核心';core.shielded=true;}}
 },
 emit(g,event){let s=g.story;if(s&&!s.events.includes(event))s.events.push(event)},
 tick(g,dt){let s=g.story;if(!s||s.legacy)return;let ch=W.chapters[g.config.chapter||0],goal=ch.goal;
 if(goal.type==='defend'){if(!g.entity(s.protected))s.failed='青灯档案楼失守，档案未能保全。';for(let at of [30,75,120])if(g.time>=at&&!s.spawned.includes(at)){s.spawned.push(at);for(let i=0;i<9+at/15;i++){let side=i%3,x=side===0?70:side===1?g.width-70:500+g.rng()*1200,y=side===2?70:650+g.rng()*650;let u=g.add(i%4===0?'cavalry':i%3===0?'archer':'infantry',1,x,y);let target=g.entity(s.protected)||g.home;u.order={type:'attackMove',x:target.x,y:target.y};}}}
 if(goal.type==='rescue'){let military=g.entities.filter(e=>e.team===0&&e.kind==='unit'&&e.type!=='worker'&&e.type!=='engineer');if(!s.rescued&&military.some(e=>W.util.dist(e,s.site)<110)){s.rescued=true;this.emit(g,'rescued');for(let i=0;i<3;i++){let v=g.add('worker',0,s.site.x+i*20,s.site.y);v.storyVIP=true;v.storyLabel='议会使者';v.maxHp=180;v.hp=180;v.order={type:'move',x:g.home.x+(i-1)*30,y:g.home.y-65};s.vips.push(v.id);}}
 for(let id of s.vips){let v=g.entity(id);if(v&&!s.delivered.includes(id)&&W.util.dist(v,g.home)<125){s.delivered.push(id);v.storySafe=true;v.order=null;this.emit(g,'delivered');}}if(s.rescued&&s.delivered.length+ s.vips.filter(id=>!s.delivered.includes(id)&&g.entity(id)).length<goal.required)s.failed='可护送的使者不足两名，营救行动失败。';}
 if(['capture','finale'].includes(goal.type)){for(let b of s.beacons){if(b.captured)continue;let own=g.entities.some(e=>e.team===0&&e.kind==='unit'&&e.type!=='worker'&&e.type!=='engineer'&&W.util.dist(e,b)<110),enemy=g.entities.some(e=>e.team===1&&e.kind==='unit'&&W.util.dist(e,b)<130);if(own&&!enemy)b.progress=Math.min(goal.hold,b.progress+dt);else if(!own)b.progress=Math.max(0,b.progress-dt*.15);if(b.progress>=goal.hold){b.captured=true;this.emit(g,'captured');}}if(goal.type==='finale'&&s.beacons.every(b=>b.captured)){let core=g.entity(s.core);if(core)core.shielded=false;this.emit(g,'unlocked');}}
 if(goal.type==='timed'&&g.time>=goal.seconds&&g.entities.some(e=>e.team===1&&e.type==='hq'))s.failed='倒计时归零，时页已被焚毁。';
 for(let c of ch.comms){let ready=(c.at!==undefined&&g.time>=c.at)||(c.when&&s.events.includes(c.when));if(c.when==='built')ready=g.entities.some(e=>e.team===0&&e.kind==='building'&&e.wasConstructed&&e.build>=1&&!['hq','house','barracks'].includes(e.type));if(c.when==='contact')ready=g.entities.some(e=>e.team===1&&g.isVisible(e));if(ready&&!s.comms.includes(c.id)){s.comms.push(c.id);W.storyUI?.communicate(c,g);}}
 },
 result(g){let s=g.story;if(!s||s.legacy)return null;let ch=W.chapters[g.config.chapter||0],t=ch.goal.type;if(s.failed)return {won:false,reason:s.failed};let won=t==='destroy'||t==='timed'?!g.entities.some(e=>e.team===1&&e.type==='hq'):t==='defend'?g.time>=ch.goal.seconds&&!!g.entity(s.protected):t==='rescue'?s.delivered.length>=ch.goal.required:t==='capture'?s.beacons.every(b=>b.captured):t==='finale'?s.events.includes('unlocked')&&!g.entity(s.core):false;return {won};},
 objective(g){let s=g.story;if(!s)return null;if(s.legacy)return '旧版战局 · 摧毁全部敌方中枢';let ch=W.chapters[g.config.chapter||0],t=ch.goal.type;if(t==='defend')return '保护档案楼 · 坚守 '+Math.max(0,Math.ceil(ch.goal.seconds-g.time))+'s';if(t==='rescue')return s.rescued?'护送使者返营 '+s.delivered.length+' / '+ch.goal.required:'前往金色标记 · 营救议会使者';if(t==='capture'||t==='finale'){let n=s.beacons.filter(b=>b.captured).length;return n<s.beacons.length?'占领信标 '+n+' / '+s.beacons.length+' · '+ch.goal.hold+'s / 座':t==='finale'?'核心护盾已解除 · 摧毁裂时核心':'盟约已建立';}if(t==='timed')return '摧毁全部中枢 · 剩余 '+Math.max(0,Math.ceil(ch.goal.seconds-g.time))+'s';return '摧毁敌方军令中枢';}
};
