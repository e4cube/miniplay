export type AssetStatus = "idle" | "loading" | "ready" | "degraded";
export type PreloadResult = { images: Map<string, HTMLImageElement>; loaded: number; total: number; failed: string[]; status: AssetStatus };

export const CORE_IMAGE_ASSETS = {
 player1:"/games/battle-tanks/assets/tanks/runtime/player-1.webp",
 player2:"/games/battle-tanks/assets/tanks/runtime/player-2.webp",
 scout:"/games/battle-tanks/assets/tanks/runtime/scout.webp",
 assault:"/games/battle-tanks/assets/tanks/runtime/assault.webp",
 heavy:"/games/battle-tanks/assets/tanks/runtime/heavy.webp",
 elite:"/games/battle-tanks/assets/tanks/runtime/elite.webp",
 tileGrass:"/games/battle-tanks/assets/tiles/runtime/grass-ground.webp",
 tileBrick:"/games/battle-tanks/assets/tiles/runtime/brick-wall.webp",
 tileSteel:"/games/battle-tanks/assets/tiles/runtime/steel-wall.webp",
 tileWater:"/games/battle-tanks/assets/tiles/runtime/water.webp",
 tileIce:"/games/battle-tanks/assets/tiles/runtime/ice.webp",
 tileTallGrass:"/games/battle-tanks/assets/tiles/runtime/tall-grass.webp",
 tileBaseGround:"/games/battle-tanks/assets/tiles/runtime/base-ground.webp",
 tileBase:"/games/battle-tanks/assets/tiles/runtime/base-structure.webp",
 menuBackground:"/games/battle-tanks/assets/ui/runtime/menu-battlefield.webp",
 hud:"/games/battle-tanks/assets/ui/runtime/panel.webp",
 victory:"/games/battle-tanks/assets/ui/runtime/victory.webp",
 defeat:"/games/battle-tanks/assets/ui/runtime/defeat.webp"
} as const;

async function loadImage(src:string){
 const image=new Image();
 await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`Timed out loading ${src}`)),15000);image.onload=()=>{clearTimeout(timer);resolve()};image.onerror=()=>{clearTimeout(timer);reject(new Error(`Failed to load ${src}`))};image.src=src});
 if(typeof image.decode==="function")await image.decode();
 return image;
}

export async function preloadBattleAssets(onProgress:(loaded:number,total:number)=>void):Promise<PreloadResult>{
 const entries=Object.entries(CORE_IMAGE_ASSETS),images=new Map<string,HTMLImageElement>(),failed:string[]=[];let loaded=0;
 onProgress(0,entries.length);
 await Promise.all(entries.map(async([key,src])=>{try{images.set(key,await loadImage(src))}catch{failed.push(src)}finally{loaded++;onProgress(loaded,entries.length)}}));
 return{images,loaded,total:entries.length,failed,status:failed.length?"degraded":"ready"};
}
