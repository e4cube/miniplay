import {adsense, validAdSenseClient} from '@/config/adsense';
export default function AdSense() {
  if (!validAdSenseClient) return null;
  return <script id="gamevado-adsense" async crossOrigin="anonymous"
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}/>;
}
