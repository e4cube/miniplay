export type Text = readonly [string, string];
export type Stat = 'health' | 'joy' | 'knowledge' | 'bonds';
export type Focus = 'learn' | 'work' | 'rest' | 'connect';
export type Stats = Record<Stat, number>;
export type Choice = { id: string; label: Text; result: Text; effects: Partial<Stats> & { money?: number; qualification?: number; job?: number }; cost?: number; knowledge?: number; degree?: number };
export type LifeEvent = { id: string; title: Text; body: Text; choices: Choice[] };
export type Entry = { age: number; title: Text; body: Text; kind: 'birth' | 'year' | 'choice' | 'ending' };
export type Life = { id: string; seed: number; rng: number; region: number; background: number; name: Text; age: number; stats: Stats; money: number; qualification: number; job: number; focus: Focus; pending: string | null; ended: boolean; log: Entry[] };
export type Summary = { id: string; name: Text; region: number; age: number; money: number; stats: Stats };
export type Save = { version: 1; life: Life | null; history: Summary[] };

export const regions = [
  { name: ['Solmere Coast', '晴湾海岸'] as Text, detail: ['A lively port where new ideas arrive with the tide.', '潮水带来新想法的热闹港湾。'] as Text, weight: 24, cost: 280, income: 410, hue: '#f0ba6c' },
  { name: ['Cedar Vale', '杉木谷地'] as Text, detail: ['A wooded valley with close-knit neighborhoods.', '树林环绕、邻里相依的山谷。'] as Text, weight: 21, cost: 220, income: 330, hue: '#a9c49a' },
  { name: ['Lumen City', '流光之城'] as Text, detail: ['Bright streets, busy days and expensive ambitions.', '灯光、忙碌的街道和昂贵的梦想。'] as Text, weight: 18, cost: 370, income: 530, hue: '#a8b8ed' },
  { name: ['Amber Fields', '琥珀原野'] as Text, detail: ['Open skies and a slower rhythm of life.', '开阔的天空，缓慢的生活节奏。'] as Text, weight: 17, cost: 190, income: 290, hue: '#d7c66d' },
  { name: ['Frosthaven', '霜港小镇'] as Text, detail: ['Long winters and a town that looks after its own.', '漫长的冬天，彼此照应的小镇。'] as Text, weight: 12, cost: 310, income: 440, hue: '#9bcbd1' },
  { name: ['Orchid Isles', '兰屿群岛'] as Text, detail: ['Small islands connected by ferries and friendships.', '渡船和友情连接起的小岛。'] as Text, weight: 8, cost: 240, income: 350, hue: '#c5a6d5' },
];
export const focuses: { id: Focus; name: Text; detail: Text }[] = [
  { id: 'learn', name: ['Learn', '学习'], detail: ['Knowledge +3 · Joy −1 each year', '每年学识 +3 · 快乐 −1'] },
  { id: 'work', name: ['Build', '事业'], detail: ['Extra income as an adult · Health −2', '成年后增加收入 · 健康 −2'] },
  { id: 'rest', name: ['Restore', '休养'], detail: ['Health +3 · Joy +2 each year', '每年健康 +3 · 快乐 +2'] },
  { id: 'connect', name: ['Connect', '陪伴'], detail: ['Bonds +4 · Joy +1 each year', '每年关系 +4 · 快乐 +1'] },
];
const choice = (id: string, label: Text, result: Text, effects: Choice['effects'], limits: Pick<Choice, 'cost' | 'knowledge' | 'degree'> = {}): Choice => ({ id, label, result, effects, ...limits });
export const events: LifeEvent[] = [
  { id:'first-friend', title:['A seat beside you', '身旁的座位'], body:['On your first school day, a quiet child sits alone. What do you do?', '开学第一天，一个安静的孩子独自坐着。你会怎么做？'], choices:[
    choice('hello',['Say hello','主动打招呼'],['An awkward hello becomes the beginning of a friendship.','一句生涩的问候，成了友情的开头。'],{bonds:10,joy:5}),
    choice('books',['Explore the library','去图书馆看看'],['You find a shelf that makes the world feel larger.','书架上的故事，让世界变大了。'],{knowledge:10,joy:3}),
  ] },
  { id:'club', title:['An afternoon of your own','属于自己的下午'],body:['School clubs are opening their doors. Where will you spend your time?','学校社团开始招新。你想把时间放在哪里？'],choices:[
    choice('sport',['Join the walking club','加入徒步社'],['Fresh air becomes a habit you enjoy.','走进户外，成了你喜欢的习惯。'],{health:10,bonds:4}),
    choice('science',['Build a tiny radio','制作小收音机'],['Your first crackling signal feels like a discovery.','第一次响起的沙沙声，让你感到发现的快乐。'],{knowledge:12,joy:3}),
    choice('art',['Join a theatre group','加入戏剧社'],['You learn to be seen, and to listen.','你学习表达，也学习倾听。'],{joy:10,bonds:8}),
  ] },
  { id:'mentor',title:['Someone sees potential','有人看见了你的潜力'],body:['A teacher offers to help with a personal project. It will take some of your free time.','一位老师愿意指导你的个人项目，但它需要占用课余时间。'],choices:[
    choice('project',['Commit to the project','认真完成项目'],['Weeks of practice turn curiosity into confidence.','数周的练习，让好奇心变成了自信。'],{knowledge:14,joy:-4,bonds:3}),
    choice('balance',['Keep a balanced schedule','保留生活的空白'],['You leave room for friends and ordinary afternoons.','你为朋友和普通的午后，留出了一点空间。'],{joy:8,bonds:7}),
  ] },
  {id:'path',title:['The road after school','离开校园的路'],body:['Adult life is beginning. There is more than one way to build a future.','成年生活即将开始。通往未来的路，不只有一条。'],choices:[
    choice('degree',['Attend college','进入大学'],['You spend your savings on a degree and a new circle of friends.','你用积蓄换来了学位，也认识了新朋友。'],{knowledge:18,qualification:2,joy:3},{cost:500,knowledge:55}),
    choice('apprentice',['Take an apprenticeship','成为学徒'],['Learning on the job gives you practical skills and a first wage.','边做边学，让你拥有实用技能和第一份薪水。'],{knowledge:10,qualification:1,job:1,money:160}),
    choice('explore',['Work and explore','工作并探索方向'],['You start with a modest job and time to discover what matters.','你从一份普通工作开始，慢慢寻找自己在意的事。'],{job:1,joy:9,bonds:4}),
  ]},
  {id:'career',title:['An opening on the noticeboard','布告栏上的机会'],body:['A new role could change your working life. Preparation opens some doors; other doors are open already.','一份新工作也许会改变你的生活。准备让一些门打开，也有些门一直敞开着。'],choices:[
    choice('research',['Join a research team','加入研究团队'],['You find work that rewards your long hours of study.','长久以来的学习，在这份工作中得到了回报。'],{job:3,joy:7},{knowledge:70,degree:2}),
    choice('craft',['Become a specialist','成为技术骨干'],['People begin to trust your practical expertise.','人们开始信任你的专业能力。'],{job:2,knowledge:5},{knowledge:45}),
    choice('steady',['Choose steady local work','选择稳定的本地工作'],['A familiar routine leaves room for the rest of life.','熟悉的工作节奏，为生活的其他部分留出了空间。'],{job:1,bonds:7,joy:5}),
  ]},
  {id:'connection',title:['An unexpected invitation','一次意外的邀请'],body:['Someone you enjoy talking to invites you on a weekend trip.','一个聊得来的人，邀请你一起度过周末。'],choices:[
    choice('yes',['Make time for them','为对方留出时间'],['Shared stories bring the two of you closer.','共同经历的故事，让你们更亲近。'],{bonds:15,joy:9},{cost:90}),
    choice('local',['Suggest a walk nearby','约在附近散步'],['A simple walk turns into a conversation you remember.','一次简单的散步，变成了难忘的长谈。'],{bonds:10,joy:5}),
    choice('no',['Enjoy your own company','享受独处'],['A quiet weekend gives you space to breathe.','安静的周末，让你重新找回了自己的节奏。'],{health:5,joy:7}),
  ]},
  {id:'home',title:['A place to call home','一个叫作家的地方'],body:['You can put roots down, or keep your life flexible.','你可以在这里扎根，也可以保持轻装前行。'],choices:[
    choice('settle',['Create a shared home','打造共同的家'],['A home becomes the backdrop for small daily rituals.','一个家，承载起了日常的小小仪式。'],{bonds:15,joy:10},{cost:650}),
    choice('rent',['Keep things simple','简单生活'],['You choose a small space and a lighter financial load.','你选择了小空间，也选择了更轻的负担。'],{joy:6,money:100}),
  ]},
  {id:'crossroads',title:['A different kind of success','另一种成功'],body:['You are offered more responsibility. It would mean less time away from work.','你获得了承担更多责任的机会，但工作之外的时间会变少。'],choices:[
    choice('lead',['Take the leadership role','接受管理职位'],['You earn more, but learn how much energy responsibility takes.','收入提高了，你也体会到责任消耗着多少精力。'],{job:3,health:-7,bonds:-6,knowledge:4}),
    choice('balance',['Protect your time','守护自己的时间'],['You keep your evenings for the people and things you love.','你把夜晚留给了喜欢的人和事。'],{bonds:10,joy:10,health:4}),
  ]},
  {id:'care',title:['Showing up','陪在身边'],body:['A relative needs help with everyday tasks for a while.','一位亲人暂时需要日常生活上的帮助。'],choices:[
    choice('time',['Spend more time together','多花时间陪伴'],['You trade a little income for days that matter.','你放下了一点收入，换来珍贵的相处。'],{bonds:16,joy:4,money:-120}),
    choice('help',['Arrange paid support','安排专业照护'],['Practical support gives everyone some breathing room.','专业的帮助，让彼此都轻松了一些。'],{bonds:9,health:4},{cost:240}),
    choice('neighbors',['Ask the neighborhood','向邻里寻求帮助'],['You discover how much a community can carry together.','你发现，一个社区能一起分担很多事。'],{bonds:10,joy:2}),
  ]},
  {id:'second-act',title:['The idea that stayed','一直留在心里的想法'],body:['An old ambition returns. Is it time to try something new?','一个旧日的梦想又浮上心头。现在，是尝试新事物的时候吗？'],choices:[
    choice('start',['Start a small venture','开始一项小事业'],['Some plans fail, but your new venture gives you a fresh purpose.','有些计划没能成功，但新的事业让你重新有了目标。'],{job:3,joy:12,health:-5},{cost:750}),
    choice('hobby',['Make it a weekend project','把它变成周末爱好'],['You discover that an idea does not have to pay the bills to matter.','你发现，一个想法不必带来收入，也可以很重要。'],{joy:13,knowledge:5},{cost:100}),
    choice('mentor',['Help someone else begin','帮助别人出发'],['Someone else takes their first step with your encouragement.','在你的鼓励下，有人迈出了自己的第一步。'],{bonds:12,joy:7,knowledge:3}),
  ]},
  {id:'health-check',title:['A reason to slow down','慢下来的理由'],body:['A routine check reminds you to make more space for your health.','一次常规检查提醒你，应该为健康留出更多空间。'],choices:[
    choice('routine',['Build a healthier routine','建立更健康的习惯'],['Small daily changes begin to add up.','每天小小的改变，慢慢积累成了不同。'],{health:15,joy:4},{cost:120}),
    choice('walk',['Start with a daily walk','从每天散步开始'],['You find a route you like, and keep returning to it.','你找到一条喜欢的路线，并一直坚持走下去。'],{health:9,bonds:3}),
  ]},
  {id:'retire',title:['A new rhythm','新的节奏'],body:['Your working years are giving way to a different chapter. What will fill your days?','工作岁月渐渐走向下一个篇章。你想如何度过今后的日子？'],choices:[
    choice('garden',['Grow a garden','照料一座花园'],['You learn the quiet satisfaction of helping things grow.','你体会到，照料生命慢慢长大的安静满足。'],{health:8,joy:12}),
    choice('community',['Join a community project','参与社区项目'],['People still count on you, in a new and gentler way.','人们依然需要你，只是换了一种更温柔的方式。'],{bonds:16,joy:9}),
    choice('study',['Study something new','学习新事物'],['Curiosity turns out to have no retirement age.','好奇心，原来并没有退休年龄。'],{knowledge:12,joy:10}),
  ]},
  {id:'legacy',title:['What you pass on','留给后来的人'],body:['Someone younger asks what you have learned from life.','一个年轻人问起，这些年你从生活中学到了什么。'],choices:[
    choice('stories',['Share your stories','分享自己的故事'],['The stories are imperfect, and that is why they help.','故事并不完美，也正因如此，它们才有意义。'],{bonds:14,joy:10}),
    choice('teach',['Teach a useful skill','传授一门手艺'],['A skill you once struggled with becomes a gift to someone else.','一门曾让你苦恼的技能，变成了送给别人的礼物。'],{knowledge:6,bonds:12}),
  ]},
  {id:'reunion',title:['Faces from another chapter','上一章的面孔'],body:['An old friend gets in touch. It has been years.','一位老朋友联系了你。已经很多年了。'],choices:[
    choice('visit',['Visit them','去见一面'],['You laugh about what changed and what never did.','你们笑谈着变了的事，也谈起从未变过的事。'],{joy:11,bonds:12},{cost:80}),
    choice('letter',['Write a long letter','写一封长信'],['A careful letter crosses the distance between you.','一封认真写下的信，跨越了你们之间的距离。'],{joy:7,bonds:9}),
  ]},
  {id:'sunset',title:['An ordinary beautiful day','普通而美好的一天'],body:['The light falls across a familiar room. There is no urgent task today.','阳光照进熟悉的房间。今天，没有什么急事。'],choices:[
    choice('people',['Call someone you love','给在意的人打个电话'],['A familiar voice makes the day feel full.','一个熟悉的声音，让这一天变得充实。'],{joy:10,bonds:10}),
    choice('reflect',['Spend a little time reflecting','静静回想一路走来'],['You make room for gratitude and for things left unfinished.','你为感谢，也为未完成的事情，留出了空间。'],{joy:10,health:3}),
  ]},
  {id:'festival',title:['Lights in the square','广场上的灯光'],body:['A local festival brings the neighborhood outside.','一场节庆，让街坊们走出家门。'],choices:[
    choice('join',['Join the celebration','参加庆祝'],['For an evening, everyone feels a little less like a stranger.','这个晚上，大家似乎都不再那么陌生。'],{joy:7,bonds:5}),
    choice('quiet',['Take a quiet evening','享受安静的夜晚'],['Rest feels like its own small celebration.','好好休息，也是另一种庆祝。'],{health:5,joy:3}),
  ]},
  {id:'rainy-day',title:['When plans change','当计划发生变化'],body:['A sudden repair bill interrupts your plans.','一笔意外的维修费用，打乱了你的计划。'],choices:[
    choice('repair',['Pay for a quick repair','支付维修费'],['The problem is solved and life returns to its usual rhythm.','问题解决了，生活恢复了原来的节奏。'],{joy:2},{cost:140}),
    choice('learn',['Learn to fix it yourself','试着自己修理'],['It takes patience, but you learn something useful.','它需要耐心，但也让你学到了有用的东西。'],{knowledge:6,joy:-3}),
    choice('ask',['Ask a friend for help','向朋友求助'],['Working together makes a frustrating day easier.','一起动手，让烦恼的一天轻松了一点。'],{bonds:4,joy:1}),
  ]},
  {id:'course',title:['A small spark of curiosity','一点好奇的火花'],body:['You come across a class on a subject you know nothing about.','你发现一门自己完全不熟悉的课程。'],choices:[
    choice('enroll',['Join the class','报名课程'],['Being a beginner again feels surprisingly good.','重新成为初学者的感觉，出乎意料地不错。'],{knowledge:10,joy:5},{cost:90}),
    choice('free',['Borrow a book instead','先借一本书'],['You follow your curiosity at your own pace.','你按自己的节奏，追随着好奇心。'],{knowledge:5,joy:2}),
  ]},
  {id:'tired',title:['Running on empty','有点累了'],body:['You notice how tired you have been lately.','你发现，自己最近一直很疲惫。'],choices:[
    choice('rest',['Take a proper break','认真休息一下'],['A few slower days help you feel like yourself again.','几天缓慢的日子，让你重新找回自己。'],{health:9,joy:6,money:-60}),
    choice('push',['Finish what you started','先完成手头的事情'],['The work gets done, though it costs some energy.','工作完成了，只是消耗了不少精力。'],{health:-7,joy:-3,money:90}),
  ]},
  {id:'kindness',title:['A chance to be kind','一次善意的机会'],body:['Someone nearby could use a little help.','身边有人需要一点帮助。'],choices:[
    choice('help',['Lend a hand','伸出援手'],['You are reminded that small gestures can travel far.','你发现，小小的善意，也可以走得很远。'],{bonds:7,joy:5}),
    choice('time',['Offer some time later','约个时间再帮忙'],['You find a way to help without abandoning your own needs.','你找到了兼顾自己和别人的方式。'],{bonds:4,health:3}),
  ]},
  {id:'opportunity',title:['A little recognition','被看见的一刻'],body:['Someone notices the effort you have been putting in.','有人注意到，你一直以来的努力。'],choices:[
    choice('challenge',['Accept a new challenge','接受新的挑战'],['A little uncertainty makes room for growth.','一点不确定，为成长腾出了位置。'],{knowledge:7,joy:4,money:120,health:-3}),
    choice('share',['Share the credit','分享这份肯定'],['You make sure the people beside you feel seen too.','你也让身边的人，感受到了被看见的温暖。'],{bonds:9,joy:6}),
  ]},
];
const milestone: Record<number,string> = {6:'first-friend',12:'club',16:'mentor',18:'path',22:'career',26:'connection',30:'home',36:'crossroads',43:'care',50:'second-act',57:'health-check',65:'retire',72:'legacy',79:'reunion',86:'sunset'};
const randomEvents = ['festival','rainy-day','course','tired','kindness','opportunity'];
export const getEvent = (id: string | null) => events.find(event => event.id === id);
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
function roll(life: Life) { life.rng = (Math.imul(1664525, life.rng) + 1013904223) >>> 0; return life.rng / 4294967296; }
export function createLife(seed: number, region = -1): Life {
  const life: Life = { id: String(seed >>> 0), seed: seed >>> 0, rng: seed >>> 0, region: 0, background: 0, name:['',''], age:0, stats:{health:80,joy:65,knowledge:25,bonds:65}, money:0,qualification:0,job:0,focus:'learn',pending:null,ended:false,log:[] };
  const draw=roll(life)*100; let cumulative=0;
  life.region=region>=0 && region<regions.length?region:regions.findIndex(r=>(cumulative+=r.weight)>draw);
  life.background=Math.floor(roll(life)*3);
  const names:Text[]=[['Ari','小禾'],['Rowan','知夏'],['Mika','星然'],['Jules','雨安'],['Sage','远舟'],['Remy','初晴'],['Noa','见山'],['Ellis','云舒']];
  life.name=names[Math.floor(roll(life)*names.length)];
  life.stats.health=72+Math.floor(roll(life)*20);life.stats.knowledge=18+life.background*8+Math.floor(roll(life)*12);
  life.stats.joy=58+Math.floor(roll(life)*20);life.stats.bonds=55+Math.floor(roll(life)*25);
  life.money=[180,520,1050][life.background];
  life.log=[{age:0,kind:'birth',title:['A life begins','一段人生开始了'],body:['Your story begins with circumstances you did not choose. What comes next is still unwritten.','你的故事，从无法选择的起点开始。而下一页，还没有写下。']}];
  return life;
}
function copy(life: Life): Life { return {...life,stats:{...life.stats},log:[...life.log]}; }
function add(life:Life,entry:Entry) { life.log=[entry,...life.log].slice(0,180); }
export function canChoose(life:Life,option:Choice) { return !life.ended && life.money>=(option.cost??0) && life.stats.knowledge>=(option.knowledge??0) && life.qualification>=(option.degree??0); }
export function choose(life:Life,id:string):Life {
  const event=getEvent(life.pending),option=event?.choices.find(c=>c.id===id);
  if(!option||!canChoose(life,option))return life;
  const next=copy(life);
  for(const key of ['health','joy','knowledge','bonds'] as Stat[])next.stats[key]=clamp(next.stats[key]+(option.effects[key]??0));
  next.money=Math.max(0,next.money-(option.cost??0)+(option.effects.money??0));
  next.qualification=option.effects.qualification??next.qualification;next.job=option.effects.job??next.job;next.pending=null;
  add(next,{age:next.age,kind:'choice',title:option.label,body:option.result});return next;
}
export function yearlyBudget(life:Life) {
  if(life.age<18)return {income:0,cost:0};
  const r=regions[life.region],retired=life.age>=65;
  const income=retired?Math.round(r.income*.66):r.income+life.job*95+(life.focus==='work'?100:0);
  return {income,cost:retired?Math.round(r.cost*.8):r.cost};
}
export function advance(life:Life):Life {
  if(life.ended||life.pending)return life;
  const next=copy(life);next.age++;
  const s=next.stats;
  s.health-=next.age>60?2:1;s.joy-=1;s.bonds-=1;
  if(next.focus==='learn'){s.knowledge+=3;s.joy-=1;}
  if(next.focus==='work'){s.knowledge+=1;s.health-=2;if(next.age>=18)s.joy-=1;}
  if(next.focus==='rest'){s.health+=3;s.joy+=2;}
  if(next.focus==='connect'){s.bonds+=4;s.joy+=1;}
  const budget=yearlyBudget(next);next.money=Math.max(0,next.money+budget.income-budget.cost);
  if(next.age>=18 && next.money===0){s.joy-=3;s.health-=1;}
  for(const key of ['health','joy','knowledge','bonds'] as Stat[])s[key]=clamp(s[key]);
  const mortality=next.age<65?0:(next.age-60)/700+Math.max(30-s.health,0)/300;
  const chance=roll(next);
  if(next.age>=96||chance<mortality){
    next.ended=true;add(next,{age:next.age,kind:'ending',title:['A life, fully lived','一生，走到了终点'],body:['This chapter closes. What remains is a collection of moments, choices and connections.','这一章结束了。留下来的，是一路的瞬间、选择与相遇。']});return next;
  }
  next.pending=milestone[next.age]??(next.age>=8&&next.age%4===0?randomEvents[Math.floor(roll(next)*randomEvents.length)]:null);
  const stage:Text=next.age<6?['A small new discovery','一个小小的新发现']:next.age<18?['Growing into yourself','慢慢长成自己']:next.age<65?['Another year takes shape','又一年，渐渐有了形状']:['Time for the things that matter','把时间，留给重要的事'];
  add(next,{age:next.age,kind:'year',title:stage,body:next.age<18?['Learning, playing and finding your place in the world.','学习、玩耍，寻找自己在世界里的位置。']:next.age<65?['Work, ordinary routines and room for small changes.','工作、日常，以及一点点改变的空间。']:['A slower rhythm, with stories worth keeping.','节奏慢了下来，故事依然值得珍藏。']});
  return next;
}
export function automaticChoice(life:Life):Life { const choices=getEvent(life.pending)?.choices.filter(c=>canChoose(life,c)); if(!choices?.length)return life;const next=copy(life);const selected=choices[Math.floor(roll(next)*choices.length)];return choose(next,selected.id); }
export function summary(life:Life):Summary { return {id:life.id,name:life.name,region:life.region,age:life.age,money:life.money,stats:{...life.stats}}; }
export function updateSave(save:Save,next:Life):Save {
  return {version:1,life:next,history:next.ended?[summary(next),...save.history.filter(h=>h.id!==next.id)].slice(0,20):save.history};
}
export const emptySave = ():Save => ({version:1,life:null,history:[]});
const isText=(value:unknown):value is Text=>Array.isArray(value)&&value.length===2&&value.every(t=>typeof t==='string'&&t.length<1500);
const isNumber=(n:unknown)=>typeof n==='number'&&Number.isFinite(n);
const isStats=(s:unknown):s is Stats=>!!s&&typeof s==='object'&&(['health','joy','knowledge','bonds'] as const).every(k=>isNumber((s as Stats)[k])&&(s as Stats)[k]>=0&&(s as Stats)[k]<=100);
function isSummary(value:unknown):value is Summary {
  if(!value||typeof value!=='object')return false;
  const s=value as Summary;
  return typeof s.id==='string'&&s.id.length<80&&isText(s.name)&&s.name.every(n=>n.length<=80)&&Number.isInteger(s.region)&&s.region>=0&&s.region<regions.length&&Number.isInteger(s.age)&&s.age>=0&&s.age<=96&&isNumber(s.money)&&s.money>=0&&s.money<1e9&&isStats(s.stats);
}
export function parseSave(value:unknown):Save {
  if(!value||typeof value!=='object')return emptySave();
  const saved=value as Save;
  if(saved.version!==1||!Array.isArray(saved.history)||saved.history.length>20||!saved.history.every(isSummary))return emptySave();
  if(saved.life===null)return {version:1,life:null,history:saved.history};
  const l=saved.life;
  if(!isSummary(l)||!Number.isInteger(l.seed)||!Number.isInteger(l.rng)||l.seed<0||l.seed>4294967295||l.rng<0||l.rng>4294967295||!Number.isInteger(l.background)||l.background<0||l.background>2||!Number.isInteger(l.qualification)||l.qualification<0||l.qualification>2||!Number.isInteger(l.job)||l.job<0||l.job>3||!focuses.some(f=>f.id===l.focus)||typeof l.ended!=='boolean'||(l.pending!==null&&!getEvent(l.pending))||!Array.isArray(l.log)||l.log.length===0||l.log.length>180||!l.log.every(e=>e&&Number.isInteger(e.age)&&e.age>=0&&e.age<=96&&isText(e.title)&&isText(e.body)&&['birth','year','choice','ending'].includes(e.kind)))return {version:1,life:null,history:saved.history};
  return {version:1,life:l,history:saved.history};
}
