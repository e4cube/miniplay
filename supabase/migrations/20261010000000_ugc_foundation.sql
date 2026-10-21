-- GameVado UGC foundation. Apply with Supabase CLI after reviewing the target project.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Player',
  role text not null default 'user' check (role in ('user','moderator','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint display_name_length check (char_length(display_name) between 1 and 40)
);

create function private.create_profile() returns trigger language plpgsql security definer
set search_path = '' as $$
begin
  insert into public.profiles(user_id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function private.create_profile();

create function private.is_moderator() returns boolean language sql stable security definer
set search_path = '' as $$
  select exists(select 1 from public.profiles
    where user_id = (select auth.uid()) and role in ('moderator','admin'));
$$;
revoke all on function private.is_moderator() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_moderator() to authenticated;

create table public.game_requests (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id),
  title text not null check (char_length(title) between 3 and 80),
  title_normalized text not null,
  body text not null check (char_length(body) between 20 and 500),
  category text,
  locale text not null check (locale in ('en','zh-CN')),
  status text not null default 'pending' check (status in ('pending','approved','planned','added','rejected','merged','held')),
  canonical_request_id uuid references public.game_requests(id),
  vote_count integer not null default 0 check (vote_count >= 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint only_merged_has_canonical check ((status = 'merged') = (canonical_request_id is not null)),
  constraint no_self_merge check (canonical_request_id is distinct from id)
);
create unique index game_requests_unique_live_title on public.game_requests(title_normalized)
  where deleted_at is null and status in ('pending','approved','planned','added');
create index game_requests_public_order on public.game_requests(status, vote_count desc, published_at desc);

create table public.request_votes (
  request_id uuid not null references public.game_requests(id) on delete cascade,
  voter_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(request_id, voter_id)
);

create table public.game_comments (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null check (char_length(game_slug) between 1 and 80),
  author_id uuid not null references auth.users(id),
  body text not null check (char_length(body) between 10 and 1000),
  body_hash text generated always as (md5(lower(btrim(body)))) stored,
  locale text not null check (locale in ('en','zh-CN')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','held','deleted')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index game_comments_public_order on public.game_comments(game_slug, locale, status, published_at desc);
create unique index game_comments_no_repeat on public.game_comments(game_slug, author_id, body_hash)
  where deleted_at is null;

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id),
  target_type text not null check (target_type in ('request','comment')),
  target_id uuid not null,
  reason text not null check (reason in ('spam','abuse','off_topic','privacy','other')),
  details text check (char_length(details) <= 500),
  status text not null default 'open' check (status in ('open','reviewed','dismissed','actioned')),
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  unique(reporter_id, target_type, target_id)
);
create index reports_queue on public.reports(status, created_at);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  moderator_id uuid not null references auth.users(id),
  target_type text not null check (target_type in ('request','comment','report')),
  target_id uuid not null,
  action text not null,
  from_status text not null,
  to_status text not null,
  reason text not null check (char_length(reason) between 3 and 500),
  created_at timestamptz not null default now()
);
create index moderation_actions_target on public.moderation_actions(target_type, target_id, created_at desc);

create table private.rate_limits (
  actor_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  window_start timestamptz not null,
  attempts integer not null default 0,
  primary key(actor_id, action, window_start)
);

-- Mutations are blocked at the database boundary until an operator explicitly enables them.
create table private.ugc_settings (
  singleton boolean primary key default true check (singleton),
  writes_enabled boolean not null default false
);
insert into private.ugc_settings(singleton,writes_enabled) values(true,false);

create function private.assert_writes_enabled() returns void language plpgsql security definer
set search_path = '' as $$
begin
  if not exists(select 1 from private.ugc_settings where singleton and writes_enabled)
    then raise exception 'UGC_WRITES_DISABLED' using errcode='42501'; end if;
end $$;

create function private.check_rate(p_action text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := auth.uid(); v_start timestamptz; v_attempts integer;
begin
  if v_actor is null then raise exception 'AUTH_REQUIRED' using errcode='28000'; end if;
  v_start := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into private.rate_limits(actor_id,action,window_start,attempts)
  values(v_actor,p_action,v_start,1)
  on conflict(actor_id,action,window_start) do update set attempts=private.rate_limits.attempts+1
  returning attempts into v_attempts;
  return v_attempts <= p_limit;
end $$;

alter table public.profiles enable row level security;
alter table public.game_requests enable row level security;
alter table public.request_votes enable row level security;
alter table public.game_comments enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table private.rate_limits enable row level security;

create policy profiles_read on public.profiles for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_moderator()));
create policy requests_read_anon on public.game_requests for select to anon
  using (status in ('approved','planned','added') and deleted_at is null);
create policy requests_read on public.game_requests for select to authenticated
  using ((status in ('approved','planned','added') and deleted_at is null)
    or (select auth.uid()) = author_id or (select private.is_moderator()));
create policy votes_read on public.request_votes for select to authenticated
  using (voter_id = (select auth.uid()) or (select private.is_moderator()));
create policy comments_read_anon on public.game_comments for select to anon
  using (status = 'approved' and deleted_at is null);
create policy comments_read on public.game_comments for select to authenticated
  using ((status = 'approved' and deleted_at is null)
    or (select auth.uid()) = author_id or (select private.is_moderator()));
create policy reports_read on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select private.is_moderator()));
create policy actions_read on public.moderation_actions for select to authenticated
  using ((select private.is_moderator()));
-- No direct INSERT/UPDATE/DELETE policies: all mutations are constrained RPCs.

revoke all on public.profiles, public.game_requests, public.request_votes,
  public.game_comments, public.reports, public.moderation_actions from anon, authenticated;
grant select on public.game_requests, public.game_comments to anon;
grant select on public.profiles, public.game_requests, public.request_votes,
  public.game_comments, public.reports, public.moderation_actions to authenticated;

create function public.submit_game_request(p_title text, p_body text, p_category text, p_locale text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_actor uuid := auth.uid(); v_title text := btrim(p_title); v_body text := btrim(p_body);
begin
  if v_actor is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  perform private.assert_writes_enabled();
  if not private.check_rate('request', 2, 3600) then return null; end if;
  if char_length(v_title) not between 3 and 80 or char_length(v_body) not between 20 and 500
     or p_locale not in ('en','zh-CN') or v_title ~ '[<>[:cntrl:]]' or v_body ~ '[<>[:cntrl:]]'
     or char_length(coalesce(p_category,'')) > 40 or coalesce(p_category,'') ~ '[<>[:cntrl:]]'
     then raise exception 'INVALID_INPUT' using errcode = '22023'; end if;
  insert into public.game_requests(author_id,title,title_normalized,body,category,locale)
  values(v_actor,v_title,lower(regexp_replace(v_title,'\s+',' ','g')),v_body,p_category,p_locale)
  returning id into v_id;
  return v_id;
end $$;

create function public.submit_game_comment(p_game_slug text, p_body text, p_locale text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_actor uuid := auth.uid(); v_body text := btrim(p_body);
begin
  if v_actor is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  perform private.assert_writes_enabled();
  if not private.check_rate('comment', 3, 600) then return null; end if;
  if p_game_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or char_length(p_game_slug) > 80
     or char_length(v_body) not between 10 and 1000 or v_body ~ '[<>[:cntrl:]]'
     or p_locale not in ('en','zh-CN') then raise exception 'INVALID_INPUT' using errcode = '22023'; end if;
  insert into public.game_comments(game_slug,author_id,body,locale)
  values(p_game_slug,v_actor,v_body,p_locale) returning id into v_id;
  return v_id;
end $$;

create function public.set_request_vote(p_request_id uuid, p_voted boolean)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer; v_actor uuid := auth.uid();
begin
  if v_actor is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  perform private.assert_writes_enabled();
  if not private.check_rate('vote', 30, 60) then return -1; end if;
  perform 1 from public.game_requests where id = p_request_id and status in ('approved','planned')
    and deleted_at is null for update;
  if not found then raise exception 'REQUEST_UNAVAILABLE' using errcode = '22023'; end if;
  if p_voted then
    insert into public.request_votes(request_id,voter_id) values(p_request_id,v_actor) on conflict do nothing;
  else
    delete from public.request_votes where request_id=p_request_id and voter_id=v_actor;
  end if;
  select count(*) into v_count from public.request_votes where request_id=p_request_id;
  update public.game_requests set vote_count=v_count, updated_at=now() where id=p_request_id;
  return v_count;
end $$;

create function public.submit_report(p_target_type text, p_target_id uuid, p_reason text, p_details text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_actor uuid := auth.uid();
begin
  if v_actor is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  perform private.assert_writes_enabled();
  if not private.check_rate('report', 10, 86400) then return null; end if;
  if p_target_type not in ('request','comment') or p_reason not in ('spam','abuse','off_topic','privacy','other')
     or char_length(coalesce(p_details,'')) > 500 then raise exception 'INVALID_INPUT' using errcode = '22023'; end if;
  if p_target_type='request' then
    perform 1 from public.game_requests where id=p_target_id and status in ('approved','planned','added') and deleted_at is null;
  else
    perform 1 from public.game_comments where id=p_target_id and status='approved' and deleted_at is null;
  end if;
  if not found then raise exception 'TARGET_UNAVAILABLE' using errcode = '22023'; end if;
  insert into public.reports(reporter_id,target_type,target_id,reason,details)
  values(v_actor,p_target_type,p_target_id,p_reason,p_details)
  on conflict (reporter_id,target_type,target_id) do update set id=public.reports.id
  returning id into v_id;
  return v_id;
end $$;

create function public.moderate_ugc(p_target_type text, p_target_id uuid, p_to_status text, p_reason text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_from text; v_actor uuid := auth.uid();
begin
  if not private.is_moderator() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if char_length(btrim(coalesce(p_reason,''))) not between 3 and 500 then
    raise exception 'REASON_REQUIRED' using errcode='22023'; end if;
  if p_target_type='request' then
    select status into v_from from public.game_requests where id=p_target_id for update;
    if v_from is null or not (
      (v_from in ('pending','held') and p_to_status in ('approved','rejected')) or
      (v_from in ('approved','planned','added') and p_to_status in ('held','planned','added')) or
      (v_from='rejected' and p_to_status='pending')) then
      raise exception 'INVALID_TRANSITION' using errcode='22023'; end if;
    update public.game_requests set status=p_to_status,updated_at=now(),
      published_at=case when p_to_status in ('approved','planned','added') then coalesce(published_at,now()) else null end
      where id=p_target_id;
  elsif p_target_type='comment' then
    select status into v_from from public.game_comments where id=p_target_id for update;
    if v_from is null or not (
      (v_from in ('pending','held') and p_to_status in ('approved','rejected')) or
      (v_from='approved' and p_to_status='held') or
      (v_from='rejected' and p_to_status='pending')) then
      raise exception 'INVALID_TRANSITION' using errcode='22023'; end if;
    update public.game_comments set status=p_to_status,updated_at=now(),
      published_at=case when p_to_status='approved' then coalesce(published_at,now()) else null end
      where id=p_target_id;
  elsif p_target_type='report' then
    select status into v_from from public.reports where id=p_target_id for update;
    if v_from <> 'open' or p_to_status not in ('reviewed','dismissed','actioned') then
      raise exception 'INVALID_TRANSITION' using errcode='22023'; end if;
    update public.reports set status=p_to_status,reviewed_by=v_actor,reviewed_at=now() where id=p_target_id;
  else raise exception 'INVALID_TARGET' using errcode='22023'; end if;
  insert into public.moderation_actions(moderator_id,target_type,target_id,action,from_status,to_status,reason)
  values(v_actor,p_target_type,p_target_id,'status_change',v_from,p_to_status,btrim(p_reason));
  return true;
end $$;

create function public.hold_reported_ugc(p_report_id uuid, p_reason text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_report public.reports%rowtype; v_actor uuid := auth.uid();
begin
  if not private.is_moderator() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select * into v_report from public.reports where id=p_report_id for update;
  if v_report.id is null or v_report.status <> 'open' then
    raise exception 'REPORT_UNAVAILABLE' using errcode='22023'; end if;
  perform public.moderate_ugc(v_report.target_type,v_report.target_id,'held',p_reason);
  update public.reports set status='actioned',reviewed_by=v_actor,reviewed_at=now() where id=p_report_id;
  insert into public.moderation_actions(moderator_id,target_type,target_id,action,from_status,to_status,reason)
  values(v_actor,'report',p_report_id,'hold_target','open','actioned',btrim(p_reason));
  return true;
end $$;

revoke all on function public.submit_game_request(text,text,text,text),
  public.submit_game_comment(text,text,text), public.set_request_vote(uuid,boolean),
  public.submit_report(text,uuid,text,text),
  public.moderate_ugc(text,uuid,text,text), public.hold_reported_ugc(uuid,text) from public, anon;
revoke all on function private.create_profile(), private.is_moderator(),
  private.assert_writes_enabled(), private.check_rate(text,integer,integer)
  from public, anon, authenticated;
grant execute on function private.is_moderator() to authenticated;
revoke all on private.rate_limits, private.ugc_settings from public, anon, authenticated;
grant execute on function public.submit_game_request(text,text,text,text),
  public.submit_game_comment(text,text,text), public.set_request_vote(uuid,boolean),
  public.submit_report(text,uuid,text,text),
  public.moderate_ugc(text,uuid,text,text), public.hold_reported_ugc(uuid,text) to authenticated;
