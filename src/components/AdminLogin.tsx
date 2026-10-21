'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    void fetch('/api/ugc/auth/refresh', { method: 'POST' })
      .then(response => { if (active && response.ok) router.refresh(); })
      .catch(() => {});
    return () => { active = false; };
  }, [router]);
  async function submit(path: string, body: object) {
    setMessage('');
    try {
      const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error?.message || 'Please try again.'); return false; }
      return true;
    } catch { setMessage('Connection failed. Please try again.'); return false; }
  }
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  return <section className="card" style={{ maxWidth: 440, padding: 24 }}>
    {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}
    <h1>Moderator sign in</h1>
    <p className="muted">Enter your approved moderator email. We will send a one-time code.</p>
    <form onSubmit={async event => { event.preventDefault(); const captchaToken = (event.currentTarget.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value; if (await submit('/api/ugc/auth/request-code', { email, captchaToken })) { setSent(true); setMessage('Check your email for the code.'); } }}>
      <label htmlFor="admin-email">Email</label><br />
      <input id="admin-email" type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} style={{ width: '100%', padding: 12, margin: '8px 0 16px' }} />
      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} />}
      <button className="btn" type="submit">Send code</button>
    </form>
    {sent && <form style={{ marginTop: 24 }} onSubmit={async event => { event.preventDefault(); if (await submit('/api/ugc/auth/verify-code', { email, code })) router.refresh(); }}>
      <label htmlFor="admin-code">One-time code</label><br />
      <input id="admin-code" inputMode="numeric" pattern="[0-9]{6,8}" required autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value)} style={{ width: '100%', padding: 12, margin: '8px 0 16px' }} />
      <button className="btn" type="submit">Sign in</button>
    </form>}
    {message && <p role="status">{message}</p>}
  </section>;
}
