import PortalHome from '@/components/PortalHome';import{localizedMetadata}from'@/i18n/metadata';import{absoluteUrl,site}from'@/config/site';
export const metadata=localizedMetadata('zh-CN','/','GameVado - 免费在线浏览器小游戏','打开就玩坦克大战、霓雨街区和喵呜咖啡馆。探索原创动作、益智、街机和双人游戏，无需下载或注册。');
export default function Home(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:site.name,url:absoluteUrl('/zh'),inLanguage:'zh-CN'})}}/><PortalHome locale="zh-CN"/></>}
