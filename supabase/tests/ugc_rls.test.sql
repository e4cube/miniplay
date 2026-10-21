-- Run against a disposable Supabase local database after db reset:
-- psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/ugc_rls.test.sql
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

insert into auth.users(id, instance_id, aud, role, email, encrypted_password, email_confirmed_at)
values
('11111111-1111-4111-8111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ugc-owner@example.test','',now()),
('22222222-2222-4222-8222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ugc-other@example.test','',now()),
('33333333-3333-4333-8333-333333333333','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ugc-moderator@example.test','',now()),
('44444444-4444-4444-8444-444444444444','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ugc-admin@example.test','',now());
update public.profiles set role='moderator' where user_id='33333333-3333-4333-8333-333333333333';
update public.profiles set role='admin' where user_id='44444444-4444-4444-8444-444444444444';

insert into public.game_requests(id,author_id,title,title_normalized,body,locale,status)
values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','Pending wish','pending wish','Please add a new puzzle game.','en','pending'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','11111111-1111-4111-8111-111111111111','Approved wish','approved wish','Please add an arcade game.','en','approved'),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','11111111-1111-4111-8111-111111111111','Admin wish','admin wish','Please add another puzzle game.','en','pending');
insert into public.game_comments(id,game_slug,author_id,body,locale,status)
values
('cccccccc-cccc-4ccc-8ccc-cccccccccccc','snake','11111111-1111-4111-8111-111111111111','Pending comment','en','pending'),
('dddddddd-dddd-4ddd-8ddd-dddddddddddd','snake','11111111-1111-4111-8111-111111111111','Approved comment','en','approved');

set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$
declare blocked boolean := false;
begin
  if (select count(*) from public.game_requests) <> 1 then raise exception 'anon can read pending requests'; end if;
  if (select count(*) from public.game_comments) <> 1 then raise exception 'anon can read pending comments'; end if;
  begin
    perform public.submit_game_request('Anon wish','Anonymous posting must stay blocked.',null,'en');
  exception when insufficient_privilege then blocked := true;
  end;
  if not blocked then raise exception 'anon can invoke write RPC'; end if;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$
declare blocked boolean;
begin
  if (select count(*) from public.game_requests) <> 1 then raise exception 'other user can read pending requests'; end if;
  if (select count(*) from public.game_comments) <> 1 then raise exception 'other user can read pending comments'; end if;
  if (select count(*) from public.profiles) <> 1 then raise exception 'other user can read profiles'; end if;
  blocked := false;
  begin
    update public.game_requests set status='approved' where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  exception when insufficient_privilege then blocked := true;
  end;
  if not blocked then raise exception 'ordinary user can update request directly'; end if;
  blocked := false;
  begin
    perform public.moderate_ugc('request','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','approved','Test review');
  exception when insufficient_privilege then blocked := true;
  end;
  if not blocked then raise exception 'ordinary user can moderate'; end if;
  blocked := false;
  begin
    perform public.submit_game_request('Another wish','This submission must stay blocked.',null,'en');
  exception when insufficient_privilege then blocked := true;
  end;
  if not blocked then raise exception 'database write gate is ineffective'; end if;
end $$;

select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ declare blocked boolean := false; begin
  if (select count(*) from public.game_requests) <> 3 then raise exception 'author cannot read own pending request'; end if;
  if (select count(*) from public.game_comments) <> 2 then raise exception 'author cannot read own pending comment'; end if;
  begin
    update public.game_requests set status='approved' where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  exception when insufficient_privilege then blocked := true;
  end;
  if not blocked then raise exception 'author can bypass moderation on own request'; end if;
end $$;

select set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
do $$ begin
  if (select count(*) from public.game_requests) <> 3 then raise exception 'moderator cannot read pending request'; end if;
  if not public.moderate_ugc('request','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','approved','Reviewed in test')
    then raise exception 'moderation failed'; end if;
  if not public.moderate_ugc('comment','cccccccc-cccc-4ccc-8ccc-cccccccccccc','approved','Reviewed in test')
    then raise exception 'comment approval failed'; end if;
  if not public.moderate_ugc('comment','cccccccc-cccc-4ccc-8ccc-cccccccccccc','held','Reported in test')
    then raise exception 'comment hold failed'; end if;
  if (select count(*) from public.moderation_actions where target_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') <> 1
    then raise exception 'moderation action not audited'; end if;
end $$;

select set_config('request.jwt.claim.sub','44444444-4444-4444-8444-444444444444',true);
do $$ declare blocked boolean := false; begin
  if (select count(*) from public.game_requests) <> 3 then raise exception 'admin cannot read pending requests'; end if;
  if not public.moderate_ugc('request','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','approved','Admin reviewed')
    then raise exception 'admin moderation failed'; end if;
  begin
    update public.profiles set role='admin' where user_id='22222222-2222-4222-8222-222222222222';
  exception when insufficient_privilege then blocked := true;
  end;
  if not blocked then raise exception 'admin can grant roles through client role'; end if;
end $$;

reset role;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
  if (select count(*) from public.game_requests) <> 3 then raise exception 'approved request is not public'; end if;
  if (select count(*) from public.game_comments) <> 1 then raise exception 'held comment remains public'; end if;
end $$;
reset role;
update private.ugc_settings set writes_enabled=true where singleton;
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$
declare first_report uuid; second_report uuid; i integer;
begin
  if public.set_request_vote('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true) <> 1 then
    raise exception 'first vote failed'; end if;
  if public.set_request_vote('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true) <> 1 then
    raise exception 'repeat vote increased count'; end if;
  if (select vote_count from public.game_requests where id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb') <> 1 then
    raise exception 'vote count drift'; end if;
  for i in 1..28 loop
    if public.set_request_vote('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true) <> 1 then
      raise exception 'vote changed during rate test'; end if;
  end loop;
  if public.set_request_vote('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true) <> -1 then
    raise exception 'vote rate limit bypassed'; end if;
  if public.submit_game_request('First new wish','Please add a cooperative puzzle game.',null,'en') is null then
    raise exception 'first request submission failed'; end if;
  if public.submit_game_request('Second new wish','Please add a cooperative arcade game.',null,'en') is null then
    raise exception 'second request submission failed'; end if;
  if public.submit_game_request('Third new wish','Please add a third kind of game.',null,'en') is not null then
    raise exception 'request rate limit bypassed'; end if;
  first_report := public.submit_report('comment','dddddddd-dddd-4ddd-8ddd-dddddddddddd','spam',null);
  second_report := public.submit_report('comment','dddddddd-dddd-4ddd-8ddd-dddddddddddd','spam',null);
  if first_report is distinct from second_report then raise exception 'duplicate report created'; end if;
  if public.submit_game_comment('snake','A pending test comment.','en') is null then
    raise exception 'comment submission failed'; end if;
  if public.submit_game_comment('snake','Another pending test comment.','en') is null then
    raise exception 'second comment submission failed'; end if;
  if public.submit_game_comment('snake','Third pending test comment.','en') is null then
    raise exception 'third comment submission failed'; end if;
  if public.submit_game_comment('snake','Fourth pending test comment.','en') is not null then
    raise exception 'comment rate limit bypassed'; end if;
  if (select count(*) from public.game_comments where author_id='22222222-2222-4222-8222-222222222222' and status='pending') <> 3 then
    raise exception 'submitted comment is not pending'; end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
do $$
declare v_report uuid; blocked boolean := false;
begin
  select id into v_report from public.reports
    where target_type='comment' and target_id='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
  if v_report is null then raise exception 'moderator cannot read report queue'; end if;
  if not public.hold_reported_ugc(v_report,'Confirmed spam report') then
    raise exception 'reported comment was not held'; end if;
  if (select status from public.game_comments where id='dddddddd-dddd-4ddd-8ddd-dddddddddddd') <> 'held'
    then raise exception 'reported comment status did not change'; end if;
  if (select status from public.reports where id=v_report) <> 'actioned'
    then raise exception 'report not marked actioned'; end if;
  if (select count(*) from public.moderation_actions where target_id=v_report and target_type='report') <> 1
    then raise exception 'report action not audited'; end if;
  begin
    perform public.hold_reported_ugc(v_report,'Repeat action must fail');
  exception when invalid_parameter_value then blocked := true;
  end;
  if not blocked then raise exception 'closed report can be actioned twice'; end if;
end $$;
reset role;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
  if (select count(*) from public.game_comments) <> 0 then
    raise exception 'reported held comment remains public'; end if;
  if (select count(*) from public.game_requests) <> 3 then
    raise exception 'new pending requests became public'; end if;
end $$;
reset role;
rollback;
