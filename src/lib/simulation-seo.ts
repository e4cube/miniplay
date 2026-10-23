import type {Metadata} from 'next';
import type {Locale} from '@/i18n/config';
import {absoluteUrl} from '@/config/site';
import {coverFor} from '@/config/covers';
export function isSimulationSlug(slug:string){return slug==='life-atlas'||slug==='epoch-trails';}
export function withSimulationMetadata(locale:Locale,slug:string,metadata:Metadata):Metadata{
 if(!isSimulationSlug(slug))return metadata;
 const zh=locale==='zh-CN';
 const alt=slug==='life-atlas'?(zh?'人生图鉴原创封面：连接学习、家庭与成长的光之小径':'Life Atlas artwork: a branching path through learning, home and the stages of life'):(zh?'时光旅途原创封面：连接微观生命、恐龙、猛犸象与工坊的时间之门':'Epoch Trails artwork: a time portal linking microscopic life, dinosaurs, mammoths and an artisan workshop');
 const image={url:absoluteUrl('/assets/covers/'+slug+'-og.webp'),width:1200,height:630,alt};
 return {...metadata,openGraph:{...metadata.openGraph,images:[image]},twitter:{...metadata.twitter,card:'summary_large_image',images:[image]}};
}
export function withSimulationSchema(slug:string,schema:Record<string,unknown>[]){
 if(!isSimulationSlug(slug))return schema;
 return schema.filter(item=>item['@type']!=='FAQPage').map(item=>item['@type']==='VideoGame'?{...item,'@id':String(item.url)+'#game',image:absoluteUrl(coverFor(slug)),thumbnailUrl:absoluteUrl(coverFor(slug)),gamePlatform:'Web browser',playMode:'SinglePlayer',browserRequirements:'A modern browser with JavaScript enabled',offers:{'@type':'Offer',price:0,priceCurrency:'USD',url:item.url}}:item);
}
