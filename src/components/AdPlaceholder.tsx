"use client";
import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';
import {useI18n} from '@/i18n/LocaleContext';
import {adsense, validAdSenseClient} from '@/config/adsense';

type AdWindow = Window & {adsbygoogle?: {push: (value: Record<string, never>) => unknown}};
function AdUnit({slotId}: {slotId: string}) {
  const element = useRef<HTMLModElement>(null);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      if (node.getBoundingClientRect().width <= 0 || node.hasAttribute('data-adsbygoogle-status')) return;
      observer.disconnect();
      try {
        const adWindow = window as AdWindow;
        const queue = adWindow.adsbygoogle ?? ([] as Record<string, never>[]);
        adWindow.adsbygoogle = queue;
        queue.push({});
      } catch (error) { console.warn('AdSense unit could not initialize', error); }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <ins ref={element} className="adsbygoogle" style={{display:'block'}}
    data-ad-client={adsense.client} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true"/>;
}
export default function AdPlaceholder({slot}: {slot: string}) {
  const {t} = useI18n(), pathname = usePathname();
  const slotId = adsense.slots[slot as keyof typeof adsense.slots];
  if (!validAdSenseClient || !/^\d+$/.test(slotId ?? '')) return null;
  return <aside aria-label={t.common.advertisement} style={{margin:'40px 0',padding:'16px 0',textAlign:'center'}}>
    <p className="muted" style={{fontSize:12}}>{t.common.advertisement}</p>
    <AdUnit key={`${pathname}:${slotId}`} slotId={slotId}/>
  </aside>;
}
