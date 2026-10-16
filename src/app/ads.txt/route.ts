import {adsense, validAdSenseClient} from '@/config/adsense';
export function GET() {
  if (!validAdSenseClient) return new Response('', {status:404});
  return new Response(`google.com, ${adsense.client.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {'Content-Type':'text/plain; charset=utf-8'},
  });
}
