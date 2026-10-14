import type {Input} from './core';
/** Physical keys remain usable with Chinese IMEs and non-English keyboard layouts. */
export function normalizeGameKey(code:string,key:string):string {
 const physical:Record<string,string>={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyP:'p',Space:' ',Enter:'enter',NumpadEnter:'enter',Slash:'/',ArrowUp:'arrowup',ArrowDown:'arrowdown',ArrowLeft:'arrowleft',ArrowRight:'arrowright',Escape:'escape'};
 return physical[code]??key.toLowerCase();
}
export function readControls(keys:Set<string>,players:number):Input[] {
 const solo=players===1;
 const p1:Input={direction:keys.has('w')||(solo&&keys.has('arrowup'))?'up':keys.has('s')||(solo&&keys.has('arrowdown'))?'down':keys.has('a')||(solo&&keys.has('arrowleft'))?'left':keys.has('d')||(solo&&keys.has('arrowright'))?'right':null,fire:keys.has('fire')||keys.has(' ')||(solo&&(keys.has('enter')||keys.has('/')))};
 const p2:Input={direction:keys.has('arrowup')?'up':keys.has('arrowdown')?'down':keys.has('arrowleft')?'left':keys.has('arrowright')?'right':null,fire:keys.has('enter')||keys.has('/')};
 return solo?[p1]:[p1,p2];
}
