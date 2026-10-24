'use strict';
window.W = {};
W.civs = [
 {id:'qin',name:'秦',title:'玄甲一统',desc:'严整军阵，攻城拔寨。',bonus:'步兵生命 +25%，建筑建造速度 +20%',unit:'锐士',special:'infantry',hp:1.25,build:1.2,color:'#d9c395'},
 {id:'han',name:'汉',title:'大风长歌',desc:'屯田固本，骑军出塞。',bonus:'采集效率 +30%，骑兵生命 +15%',unit:'羽林骑',special:'cavalry',gather:1.3,cavhp:1.15,color:'#c57858'},
 {id:'tang',name:'唐',title:'万邦来朝',desc:'弓骑协同，远略四方。',bonus:'弓手攻击 +20%，全军移动 +15%',unit:'神策弓',special:'archer',ranged:1.2,speed:1.15,color:'#c9a655'},
 {id:'song',name:'宋',title:'机巧天工',desc:'火器工事，商贸兴军。',bonus:'市集收入 +50%，攻城射程 +35',unit:'霹雳车',special:'siege',income:1.5,siegeRange:35,color:'#94b5a0'},
 {id:'wei',name:'魏晋',title:'长风玄骑',desc:'轻骑奇袭，以逸待劳。',bonus:'骑兵攻击 +25%，训练速度 +20%',unit:'虎豹骑',special:'cavalry',cavattack:1.25,train:1.2,color:'#a0a4c3'},
 {id:'yuan',name:'元',title:'苍狼踏野',desc:'弦鸣草原，奔袭如风。',bonus:'全军移动 +20%，骑兵造价 −20%',unit:'怯薛骑',special:'cavalry',speed:1.2,cavcost:.8,color:'#87b5b5'},
 {id:'ming',name:'明',title:'日月山河',desc:'坚城重炮，步步为营。',bonus:'防御塔攻击 +35%，攻城攻击 +20%',unit:'神机炮',special:'siege',tower:1.35,siegeAttack:1.2,color:'#c48165'},
 {id:'qing',name:'清',title:'八旗劲旅',desc:'弓马合一，进退有度。',bonus:'骑兵生命 +25%，采集效率 +15%',unit:'骁骑卫',special:'cavalry',cavhp:1.25,gather:1.15,color:'#c5bc75'},
 {id:'athens',name:'雅典',title:'智慧之城',desc:'海风与长弓，城邦的远见。',bonus:'远程射程 +25，建筑费用 −15%',unit:'卫城弓',special:'archer',range:25,buildcost:.85,color:'#99c7d0'},
 {id:'sparta',name:'斯巴达',title:'赤盾誓约',desc:'重装方阵，寸土不让。',bonus:'步兵攻击 +30%，步兵生命 +20%',unit:'赤盾卫',special:'infantry',infattack:1.3,hp:1.2,color:'#d38c85'},
 {id:'rome',name:'罗马',title:'鹰旗永驻',desc:'军团筑垒，秩序推进。',bonus:'建筑生命 +30%，全军训练速度 +15%',unit:'鹰旗兵',special:'infantry',buildinghp:1.3,train:1.15,color:'#c9b18a'}
];
W.types = {
 hq:{name:'军令中枢',glyph:'令',kind:'building',cost:1000,hp:2200,size:38,vision:310,range:180,attack:23,rate:1.4,build:30},
 barracks:{name:'军营',glyph:'营',kind:'building',cost:400,hp:1100,size:29,vision:210,build:15},
 stable:{name:'马厩',glyph:'马',kind:'building',cost:550,hp:1000,size:30,vision:210,build:19},
 workshop:{name:'工坊',glyph:'工',kind:'building',cost:650,hp:950,size:31,vision:210,build:23},
 market:{name:'市集',glyph:'市',kind:'building',cost:400,hp:850,size:27,vision:170,build:16},
 house:{name:'民居',glyph:'居',kind:'building',cost:200,hp:600,size:23,vision:150,build:10},
 tower:{name:'箭楼',glyph:'楼',kind:'building',cost:350,hp:800,size:20,vision:300,range:235,attack:32,rate:1,build:15},
 worker:{name:'民夫',glyph:'役',kind:'unit',cost:80,hp:80,size:6,speed:65,vision:170,range:17,attack:4,rate:1,train:6,from:'hq'},
 infantry:{name:'长枪兵',glyph:'枪',kind:'unit',cost:110,hp:165,size:8,speed:61,vision:190,range:24,attack:20,rate:1,train:8,from:'barracks'},
 archer:{name:'弓弩手',glyph:'弓',kind:'unit',cost:140,hp:100,size:7,speed:62,vision:220,range:157,attack:15,rate:1.2,train:10,from:'barracks'},
 cavalry:{name:'重骑兵',glyph:'骑',kind:'unit',cost:230,hp:250,size:10,speed:95,vision:240,range:26,attack:28,rate:1.05,train:15,from:'stable'},
 siege:{name:'攻城车',glyph:'砲',kind:'unit',cost:350,hp:210,size:12,speed:40,vision:250,range:245,attack:58,rate:2.5,train:22,from:'workshop'}
};
W.modes=[{id:'skirmish',name:'遭遇战',glyph:'⚔',desc:'自由发展基地，击溃敌方军令中枢。对手会采集、扩张与组织攻势。'}, {id:'campaign',name:'时空战役',glyph:'旗',desc:'六章战役，跨越历史的裂隙。通关将解锁下一段征途。'}, {id:'survival',name:'波次生存',glyph:'∞',desc:'没有敌方基地。每隔 75 秒迎击更强波次，坚持 8 波即可取胜。'}, {id:'defense',name:'基地防守',glyph:'城',desc:'坚守中央要塞。拥有初始箭楼与工坊，抵御来自三面的 6 波围攻。'}, {id:'conquest',name:'天下征服',glyph:'舆',desc:'在战略版图上逐区推进。占领区域会为后续战场提供军资援助。'}];
W.chapters=[{name:'第一章 · 裂隙初鸣',desc:'敌军前哨孤立无援。发展基地，摧毁北境的时空锚点。',enemy:'rome',funds:2400,enemyFunds:1500,bonusEnemies:0}, {name:'第二章 · 双城烽烟',desc:'两座敌方中枢遥相呼应。敌军拥有机动骑队，需协同攻坚。',enemy:'yuan',funds:2700,enemyFunds:3000,bonusEnemies:1}, {name:'第三章 · 万朝归一',desc:'精锐禁卫守护裂时核心。建立完整军团，终结时空战争。',enemy:'qin',funds:3200,enemyFunds:4500,bonusEnemies:1}];
W.regions=[{name:'河西走廊',enemy:'han',x:0,bonus:0},{name:'临海诸城',enemy:'athens',x:1,bonus:300},{name:'苍狼原野',enemy:'yuan',x:2,bonus:600},{name:'赤盾山隘',enemy:'sparta',x:3,bonus:900},{name:'裂时王庭',enemy:'rome',x:4,bonus:1200}];
W.util={dist:(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}};
