'use strict';
(()=>{
 const dictionary=window.WanchaoTranslations||{},cache=new Map(),textRecords=new WeakMap(),attributeRecords=new WeakMap();
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const pattern=new RegExp(Object.keys(dictionary).filter(k=>(k.trim().length>1||/^[秦汉唐宋元明清]$/.test(k))&&!k.includes('<')).sort((a,b)=>b.length-a.length).map(escape).join('|'),'g');
 let stored;try{stored=localStorage.getItem('wanchao-language')}catch{}
 const requested=new URLSearchParams(location.search).get('lang');
 const i18n=W.i18n={language:requested==='en'?'en':requested==='zh'||requested==='zh-CN'?'zh':stored==='en'?'en':'zh',
  t(value){const s=String(value??'');if(this.language!=='en')return s;if(cache.has(s))return cache.get(s);let out=dictionary[s]??s.replace(pattern,k=>dictionary[k]);out=out.replace(/，/g,', ').replace(/。/g,'.').replace(/：/g,': ').replace(/；/g,'; ').replace(/（/g,' (').replace(/）/g,')');if(cache.size>2048)cache.clear();cache.set(s,out);return out;},
  setLanguage(language){this.language=language==='en'?'en':'zh';cache.clear();try{localStorage.setItem('wanchao-language',this.language)}catch{}try{const url=new URL(location.href);url.searchParams.set('lang',this.language);history.replaceState(null,'',url)}catch{}document.documentElement.lang=this.language==='en'?'en':'zh-CN';document.title=this.language==='en'?'Wanchao: Rift Command — Original Civilization RTS':'万朝：裂时战线 — 原创文明即时战略';toggle.textContent=this.language==='en'?'中文':'English';walk(document.body);window.dispatchEvent(new CustomEvent('wanchao:language',{detail:this.language}));}
 };
 function skip(node){return node.parentElement?.closest('script,style,[data-i18n-skip],textarea,input');}
 function updateText(node){if(skip(node)||!node.nodeValue.trim())return;let record=textRecords.get(node);if(!record||node.nodeValue!==record.last)record={original:node.nodeValue,last:null};const out=i18n.t(record.original);record.last=out;textRecords.set(node,record);if(node.nodeValue!==out)node.nodeValue=out;}
 function updateAttributes(element){if(element.closest('[data-i18n-skip]'))return;let records=attributeRecords.get(element);if(!records){records={};attributeRecords.set(element,records)}for(const name of ['title','alt','aria-label','placeholder']){if(!element.hasAttribute(name))continue;const value=element.getAttribute(name);let record=records[name];if(!record||value!==record.last)record=records[name]={original:value,last:null};const out=i18n.t(record.original);record.last=out;if(value!==out)element.setAttribute(name,out);}}
 function walk(root){if(root.nodeType===3){updateText(root);return}if(root.nodeType!==1)return;if(root.matches('script,style,[data-i18n-skip]'))return;updateAttributes(root);for(const child of root.childNodes)walk(child);}
 const toggle=document.createElement('button');toggle.id='languageToggle';toggle.type='button';toggle.dataset.i18nSkip='true';toggle.setAttribute('aria-label','Switch language / 切换语言');toggle.onclick=()=>i18n.setLanguage(i18n.language==='en'?'zh':'en');document.body.append(toggle);
 const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')updateText(record.target);else if(record.type==='attributes')updateAttributes(record.target);else for(const node of record.addedNodes)walk(node);}});
 observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','alt','aria-label','placeholder']});
 if(window.CanvasRenderingContext2D)for(const method of ['fillText','strokeText','measureText']){const original=CanvasRenderingContext2D.prototype[method];CanvasRenderingContext2D.prototype[method]=function(text,...args){return original.call(this,i18n.t(text),...args);};}
 i18n.setLanguage(i18n.language);
})();
