# UGC foundation setup

The migration in `migrations/20261010000000_ugc_foundation.sql` is designed for a Supabase Postgres project. It has not been applied to a real project by this repository.

1. Create separate development and production Supabase projects in a suitable region.
2. Apply the migration using Supabase CLI (`supabase db push`) or the SQL editor after reviewing the target project. Keep `private.ugc_settings.writes_enabled = false`.
3. Enable email OTP in Supabase Auth. Set the email template body to include `{{ .Token }}` as a numeric code, rather than relying only on a magic link. Configure a production SMTP provider and Auth rate limits before public use.
4. Set site URL and allowed redirect URLs in Supabase Auth. Create a Cloudflare Turnstile widget for the site. Put its public site key in `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; configure the secret key in Supabase Auth CAPTCHA settings and enable Turnstile protection there. The app forwards the token to Supabase Auth, which verifies it once. Do not also call Cloudflare Siteverify from the app with that same token.
5. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` as server environment variables on the deployment platform. Do not use a service-role key in the app. Set `UGC_WRITES_ENABLED=false`.
6. Create a moderator by first signing in with their email, then running this once as a database administrator with the actual user UUID: `update public.profiles set role='moderator' where user_id='<actual-uuid>';`. Do not expose role changes through a public API.
7. Visit `/admin/ugc` and verify that an ordinary user cannot load the queue. The page is `noindex` and is absent from the sitemap.
8. Against a disposable local database or isolated development project, run `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/ugc_rls.test.sql`. The SQL test rolls back all seeded users and records and has five-second lock and 30-second statement timeouts. Never run it against production. It passed against the isolated development project on 2026-10-10; check the latest acceptance report for exact results and remaining OTP/CAPTCHA blockers.

Player writes have two independent gates: the server environment flag and the database setting. A later phase can enable both only after CAPTCHA, moderation staffing and production tests are complete. Anonymous browsing does not create a Supabase user. The admin screen can review requests, comments and reports already present in the database while public posting remains closed.

No leaderboard, share-score persistence or game-state migration is included.
