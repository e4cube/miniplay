import Image from 'next/image';
export default function DeadDaysIntroduction(){return <article className="container" style={{padding:'32px 20px',maxWidth:1080,lineHeight:1.8,overflowWrap:'anywhere'}}>
<h2>Dead Days · 开发中的原创末日生存游戏</h2>
<p>Dead Days 是由 GameVado 原创开发的末日生存游戏，目前仍处于项目开发阶段。我们的目标是将它打磨成一款 PC 单机游戏。当前版本已上线 GameVado，提供电脑浏览器试玩，让玩家提前体验并参与反馈。</p>
<p lang="en">Dead Days is an original survival game developed by GameVado. The project is currently in development, with the goal of becoming a standalone, single-player PC game. A desktop browser preview is available on GameVado so players can try the current build and share feedback.</p>
<h3>当前场景 / Current locations</h3>
<p>当前版本包含住宅与避难据点、市集、别墅以及废弃工厂，并已接入可探索的连通世界。</p>
<p lang="en">The current build includes residential areas and a shelter, a market, a villa, and an abandoned factory within a connected world to explore.</p>
<h3>已实现玩法 / Playable features</h3>
<p>探索与搜刮物资、背包和容器管理、饥饿与饮水及体力管理、近战与枪械战斗、应对丧尸、物品制作、据点门窗加固、外出远征与返回储存物资，以及存档读取和生存日志。当前试玩以电脑键鼠操作为主，游戏内界面为中文；各系统仍在持续调整。</p>
<p lang="en">Playable systems include exploration and scavenging, inventory and container management, hunger, hydration and stamina, melee and firearm combat, zombie encounters, crafting, shelter barricades, supply expeditions and returning loot to storage, saving and loading, and a survival journal. The preview is designed for keyboard and mouse and currently has a Chinese in-game interface. These systems are still being refined.</p>
<h3>开发版本实机截图 / Screenshots from the development build</h3>
<p>以下为当前开发版本的实际场景画面，最终版本可能调整。 / Actual scenes from the development build; visuals may change before release.</p>
{[['villa','别墅 / Villa'],['market','市集 / Market'],['factory','废弃工厂 / Abandoned factory']].map(([name,label])=><figure key={name} style={{margin:'24px 0'}}><Image src={'/assets/dead-days/'+name+'.webp'} alt={'Dead Days — '+label} width={1280} height={720} sizes="(max-width: 1080px) 100vw, 1040px" style={{width:'100%',height:'auto',borderRadius:12}}/><figcaption>{label}</figcaption></figure>)}
<h3>后续规划 / Development plans</h3>
<p>我们计划继续完善探索场景、远征体验、生存与战斗平衡、制作与据点系统，并优化字体、界面、加载速度、性能及存档稳定性，逐步推进 PC 单机版本。这些是开发方向，具体内容和发布时间以实际进展为准。</p>
<p lang="en">We plan to refine the locations, expedition experience, survival and combat balance, crafting and shelter systems, along with fonts, interface clarity, loading times, performance and save reliability as we work toward the standalone PC version. These are development goals; features and release timing will depend on progress.</p>
<p>我们会定期更新开发进度，欢迎回来关注新版本。也欢迎告诉我们你期待的玩法与改进意见。</p>
<p lang="en">We will regularly share development progress. Check back for new builds, and let us know which features you would like to see and what we can improve.</p>
<h3>联系开发者 / Contact the developer</h3>
<p>Email: <a href="mailto:jin123yi123@gmail.com">jin123yi123@gmail.com</a><br/>WeChat / 微信: ddjin12</p>
</article>}
