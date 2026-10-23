import type { Game } from './games';
export const lifeAtlas: Game = {
  id:'life-atlas',slug:'life-atlas',title:'Life Atlas',
  shortDescription:'One beginning. A lifetime of possibilities.',
  description:'Follow a fictional life from childhood to its final chapter. Discover six imagined regions, choose a yearly focus, make decisions about learning, work and relationships, and keep a journal of the lives you have lived. All probabilities and credits are original game rules, not real-world statistics.',
  category:'Casual',categories:['Casual','Strategy'],tags:['life simulation','story','choices','simulation'],icon:'✳',featured:false,isNew:true,
  controls:'Use the on-screen buttons. Next year advances one year; Pause stops time. Choose 1×, 3× or 10× speed. Autopilot makes available decisions for you.',
  seoTitle:'Life Atlas — Free Life Simulation Game',
  seoDescription:'Play Life Atlas, an original free life simulation. Start in a fictional region, make meaningful choices, and discover a different story every time.',
  howTo:['Begin a life with a random starting region, or choose one of six fictional places.','Balance Health, Joy, Knowledge and Bonds with a yearly focus.','Read life events and choose an available option; some opportunities require savings, knowledge or a degree.','Use Autopilot to watch a complete life, or leave it off to make each decision yourself.'],
  tips:['Try a learning focus before the college decision at age 18.','Income begins in adulthood; later career decisions can change it.','A paid option is not always the most rewarding one.','Time pauses while waiting for your decision unless Autopilot is enabled.'],
  faq:[{q:'Is Life Atlas based on real statistics?',a:'No. Its places, probabilities, currency and life events are fictional game rules.'},{q:'Does my progress save?',a:'The current life and the latest 20 completed life summaries save in this browser when storage is available. Clearing browser data removes them.'},{q:'Can I replay a life?',a:'Enter the same story seed and region, and make the same choices to reproduce the same simulated journey.'},{q:'What happens if I leave the tab?',a:'The simulation pauses when the tab is hidden. Open it again and select Resume.'}],
  longContent:[{heading:'A Story Made of Small Decisions',paragraphs:['Life Atlas is a quiet browser game about the way an ordinary life takes shape. The starting household changes your resources, while choices and a yearly focus alter what becomes possible later. A degree can open a research role; a demanding career can increase income while costing health and time with other people.','There is no universal winning life. You can pursue knowledge, protect your energy, build a career or invest in relationships. The journal records decisions as well as ordinary years so each finished life has a history you can reflect on.']},{heading:'An Imagined World',paragraphs:['The six regions are original fictional places with different game weights, incomes and living costs. Credits have no real-world monetary value. No outcome should be used as a forecast or a claim about any real country or person.','The game runs locally without an account. Play with touch or mouse, choose your pace, and use Autopilot if you prefer to watch a story unfold.']}],
};
export const lifeAtlasZh: Pick<Game,'title'|'shortDescription'|'description'|'controls'|'seoTitle'|'seoDescription'|'howTo'|'tips'|'faq'> = {
  title:'人生图鉴',shortDescription:'一个起点，一生的无限可能。',
  description:'从童年走向人生终章。在六个虚构地区中，选择生活重心，面对学习、事业与关系中的岔路口，留下属于自己的故事。所有概率与点数都是原创游戏设定，不代表现实统计。',
  controls:'点击屏幕按钮操作。“下一年”前进一步，“暂停”停止时间。支持 1×、3×、10× 倍速，开启“自动选择”后可以观看完整人生。',
  seoTitle:'人生图鉴 — 免费在线人生模拟游戏',
  seoDescription:'免费玩人生图鉴：从虚构地区开始，在学习、事业、健康和关系之间作出选择，探索每一次不同的人生。',
  howTo:['随机开启人生，或选择六个虚构地区之一。','通过每年的生活重心，平衡健康、快乐、学识与关系。','阅读事件并作出选择，部分机会需要积蓄、学识或学位。','可以开启自动选择观看一生，也可以亲自决定每个岔路口。'],
  tips:['在 18 岁之前重视学习，有助于解锁大学选项。','成年后开始收支，后续职业选择会影响收入。','花费最多的选项，不一定带来最值得的结果。','未开启自动选择时，人生事件会等待你的决定。'],
  faq:[{q:'游戏使用真实统计吗？',a:'不使用。地区、概率、货币与事件均为虚构游戏设定。'},{q:'进度会保存吗？',a:'存储可用时，当前人生与最近 20 段已完结人生摘要会保存在当前浏览器中。清理浏览器数据会移除存档。'},{q:'可以重玩相同人生吗？',a:'使用相同种子、地区并作出相同选择，就可以重现相同的模拟旅程。'},{q:'离开标签页会发生什么？',a:'标签页进入后台时游戏会暂停，返回后点击“继续”即可。'}],
};
