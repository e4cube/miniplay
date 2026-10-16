// Touch input stays separate from keyboard input so releasing one cannot cancel the other.
export function stickVector(x,y,radius){
  const length=Math.hypot(x,y),scale=length>radius?radius/length:1;
  return {x:x*scale,y:y*scale,dx:Math.abs(x)>radius*.28?Math.sign(x):0,dy:Math.abs(y)>radius*.28?Math.sign(y):0,angle:Math.atan2(y,x),aiming:length>radius*.18};
}
// Mobile is the default: a packaged build can end up in a WebView where media
// queries lie, so only an explicit `?mode=desktop` or a confirmed fine-pointer
// desktop keeps the keyboard layout.
function detectMobile(host){
  const ua=(host.navigator&&host.navigator.userAgent)||'';
  const uaMobile=/Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile|HarmonyOS/i.test(ua);
  const query=host.matchMedia?function(q){return !!(host.matchMedia(q)&&host.matchMedia(q).matches)}:function(){return false};
  const coarse=query('(any-pointer: coarse)');
  const small=Math.min(host.innerWidth||0,host.innerHeight||0)<=900;
  const desktopOnly=!uaMobile&&!coarse&&query('(any-pointer: fine)');
  return uaMobile||coarse||(small&&!desktopOnly);
}
// WebViews happily pinch/double-tap zoom the whole page even with
// user-scalable=no in the viewport meta. Kill the gestures at the document.
function preventBrowserZoom(root){
  const stop=event=>{if(event.cancelable)event.preventDefault()};
  for(const name of ['gesturestart','gesturechange','gestureend'])root.addEventListener(name,stop);
  root.addEventListener('touchmove',event=>{if(event.touches&&event.touches.length>1)stop(event)},{passive:false});
  root.addEventListener('dblclick',stop);
}
export function mountTouch({touch,getState,getFace,pause,root=document,host=window}){
  preventBrowserZoom(root);
  const mode=new URLSearchParams(host.location.search).get('mode');
  const enabled=mode?mode==='mobile':detectMobile(host);
  root.body.classList.toggle('mobile-game',enabled);
  const controls=root.querySelector('#touch-controls'),menu=root.querySelector('#touch-menu');
  const sticks=[root.querySelector('#move-stick'),root.querySelector('#aim-stick')];
  const actions=[...root.querySelectorAll('[data-touch-key]')];
  const pointers=new Map();let prone=false,previousState='';
  function refresh(){
    touch.keys.clear();touch.firing=false;
    if(prone)touch.keys.add('c');
    for(const p of pointers.values()){
      if(p.kind==='move'){if(p.v.dx)touch.keys.add(p.v.dx>0?'d':'a');if(p.v.dy)touch.keys.add(p.v.dy>0?'s':'w')}
      else if(p.kind==='aim'){touch.firing=true;touch.angle=p.v.aiming?p.v.angle:getFace()<0?Math.PI:0}
      else touch.keys.add(p.key);
    }
  }
  function release(){
    pointers.clear();prone=false;touch.keys.clear();touch.firing=false;
    for(const el of [...sticks,...actions]){el.classList.remove('held');el.style.setProperty('--stick-x','0px');el.style.setProperty('--stick-y','0px')}
    root.querySelector('#touch-prone').setAttribute('aria-pressed','false');
  }
  function sync(state){if(state===previousState)return;previousState=state;controls.hidden=state!=='playing';menu.textContent=state==='playing'?'暂停':'菜单';if(state!=='playing')release()}
  if(!enabled)return {release,sync,enabled};
  // The mini-tool window may never rotate, so portrait must stay playable:
  // the canvas is laid on its side (CSS rotate 90°) instead of being blocked
  // by a "turn your phone" overlay. Touch vectors are rotated back below.
  let sideways=host.innerHeight>host.innerWidth;
  root.body.classList.toggle('landscape-sim',sideways);
  function applyOrientation(){
    const next=host.innerHeight>host.innerWidth;
    if(next===sideways)return;
    sideways=next;
    root.body.classList.toggle('landscape-sim',sideways);
  }
  // Old WebViews ship no PointerEvent; fall back to raw touch events.
  const hasPointer=typeof host.PointerEvent==='function';
  const downName=hasPointer?'pointerdown':'touchstart';
  const moveName=hasPointer?'pointermove':'touchmove';
  const endNames=hasPointer?['pointerup','pointercancel','lostpointercapture']:['touchend','touchcancel'];
  function touchPoint(event,id){
    const list=event.changedTouches||event.touches||[];
    for(let i=0;i<list.length;i++)if(list[i].identifier===id)return list[i];
    return list[0]||null;
  }
  function bind(el,kind,key){
    el.addEventListener(downName,event=>{
      if(getState()!=='playing'||[...pointers.values()].some(p=>p.el===el))return;
      const native=hasPointer?event:touchPoint(event,null);
      if(!native)return;
      event.preventDefault();
      const id=hasPointer?event.pointerId:native.identifier;
      if(hasPointer&&el.setPointerCapture)el.setPointerCapture(event.pointerId);
      const bounds=el.getBoundingClientRect(),radius=bounds.width/2;
      const p={el,kind,key,cx:bounds.left+radius,cy:bounds.top+bounds.height/2,radius:radius*.7,v:stickVector(0,0,radius)};
      pointers.set(id,p);el.classList.add('held');refresh();
    });
    el.addEventListener(moveName,event=>{
      const native=hasPointer?event:touchPoint(event,null);
      if(!native)return;
      const id=hasPointer?event.pointerId:native.identifier;
      const p=pointers.get(id);if(!p||p.el!==el||kind==='button')return;
      event.preventDefault();
      const point=hasPointer?native:touchPoint(event,id)||native;
      // 画面被旋转了 90°，屏幕位移要逆变换回游戏坐标系。
      const raw={x:point.clientX-p.cx,y:point.clientY-p.cy};
      const local=sideways?{x:raw.y,y:-raw.x}:raw;
      p.v=stickVector(local.x,local.y,p.radius);
      el.style.setProperty('--stick-x',`${p.v.x}px`);el.style.setProperty('--stick-y',`${p.v.y}px`);refresh();
    });
    const end=event=>{
      const native=hasPointer?event:touchPoint(event,null);
      const id=hasPointer?event.pointerId:(native?native.identifier:undefined);
      const p=pointers.get(id);if(!p||p.el!==el)return;
      pointers.delete(id);el.classList.remove('held');el.style.setProperty('--stick-x','0px');el.style.setProperty('--stick-y','0px');refresh()};
    for(const name of endNames)el.addEventListener(name,end);
    // pointerdown 的 preventDefault 不会阻止浏览器手势；连续点按摇杆会触发
    // 双击缩放，画面被放大到手指位置、左侧摇杆被推出视野。这里单独压掉。
    el.addEventListener('touchstart',event=>{if(event.cancelable)event.preventDefault()},{passive:false});
  }
  bind(sticks[0],'move');bind(sticks[1],'aim');
  for(const el of actions)bind(el,'button',el.dataset.touchKey);
  root.querySelector('#touch-prone').onclick=()=>{if(getState()!=='playing')return;prone=!prone;root.querySelector('#touch-prone').setAttribute('aria-pressed',String(prone));refresh()};
  menu.onclick=()=>{if(getState()==='playing')pause();else root.querySelector('#mobile-options').showModal()};
  root.querySelector('#close-mobile-options').onclick=()=>root.querySelector('#mobile-options').close();
  for(const el of root.querySelectorAll('[data-mobile-action]'))el.onclick=()=>{root.querySelector('#mobile-options').close();root.querySelector(`#${el.dataset.mobileAction}`).click()};
  // 竖屏不再强制暂停：侧躺模式下游戏继续跑，只重置摇杆。
  function viewportChanged(){applyOrientation();release()}
  host.addEventListener('resize',viewportChanged);host.addEventListener('orientationchange',viewportChanged);host.addEventListener('blur',release);
  root.addEventListener('visibilitychange',()=>{if(root.hidden)release()});
  return {release,sync,enabled};
}
