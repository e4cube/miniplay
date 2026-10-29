import DeadDaysIntroduction from '@/components/DeadDaysIntroduction';
import DeadDaysGame from '@/components/DeadDaysGame';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata('zh-CN','/games/dead-days','Dead Days 末日生存日志｜原创生存游戏 - GameVado','探索住宅、市集、别墅和废弃工厂，搜刮物资并加固据点。原创电脑浏览器试玩版，中文界面。');
export default function Page(){return <><DeadDaysGame/><DeadDaysIntroduction/><p data-original-credit="gamevado" className="container muted" style={{textAlign:'center',padding:24}}>GameVado Original</p></>}
