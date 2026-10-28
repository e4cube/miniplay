import DeadDaysGame from '@/components/DeadDaysGame';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata('en','/games/dead-days','Dead Days: Free Browser Survival Game | GameVado','Explore an abandoned town, scavenge supplies and improve a shelter. Original desktop browser survival preview with a Chinese interface.');
export default function Page(){return <><DeadDaysGame/><p data-original-credit="gamevado" className="container muted" style={{textAlign:'center',padding:24}}>GameVado Original</p></>}
