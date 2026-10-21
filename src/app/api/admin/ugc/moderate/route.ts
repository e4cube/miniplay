import { requireModerator } from '@/lib/ugc/auth';
import { failure, jsonBody, rpc, sameOrigin } from '@/lib/ugc/http';
import { plainText, uuidPattern } from '@/lib/ugc/validation';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure('BAD_ORIGIN', 'Invalid request origin.', 403);
  const moderator = await requireModerator();
  if (!moderator) return failure('FORBIDDEN', 'Moderator access required.', 403);
  const body = await jsonBody(request);
  const type = body?.type;
  const id = body?.id;
  const status = body?.status;
  const reason = plainText(body?.reason, 3, 500);
  const validStatus = type === 'report' ? ['reviewed', 'dismissed', 'actioned'].includes(String(status))
    : (type === 'request' || type === 'comment') && ['approved', 'rejected', 'held'].includes(String(status));
  if (!validStatus || typeof id !== 'string' || !uuidPattern.test(id) || !reason) {
    return failure('INVALID_INPUT', 'Check the moderation decision.', 400);
  }
  try {
    if (type === 'report' && status === 'actioned') {
      await rpc<boolean>('hold_reported_ugc', { p_report_id: id, p_reason: reason }, moderator.token);
    } else {
      await rpc<boolean>('moderate_ugc', { p_target_type: type, p_target_id: id, p_to_status: status, p_reason: reason }, moderator.token);
    }
    return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('MODERATION_FAILED', 'Decision could not be recorded.', 409); }
}
