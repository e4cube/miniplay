"use client";
import Script from 'next/script';
import {adsense, validAdSenseClient} from '@/config/adsense';
export default function AdSense() {
  if (!validAdSenseClient) return null;
  return <Script id="gamevado-adsense" async strategy="afterInteractive" crossOrigin="anonymous"
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}/>;
}
