import { writeGuard } from '@/lib/ugc/api';
import { failure, jsonBody, rpc } from '@/lib/ugc/http';
import { plainText, uuidPattern } from '@/lib/ugc/validation';

export async function POST(request: Request) {
  const guard = await writeGuard(request); if (guard.error) return guard.error;
  const body = await jsonBody(request);
  const type = body?.type;
  const id = body?.id;
  const reason = body?.reason;
  const details = body?.details == null ? null : plainText(body.details, 1, 500);
  if ((type !== 'request' && type !== 'comment') || typeof id !== 'string' || !uuidPattern.test(id)
    || !['spam', 'abuse', 'off_topic', 'privacy', 'other'].includes(String(reason))
    || (body?.details != null && !details)) return failure('INVALID_INPUT', 'Check the report fields.', 400);
  try {
    const reportId = await rpc<string | null>('submit_report', { p_target_type: type, p_target_id: id, p_reason: reason, p_details: details }, guard.token!);
    if (!reportId) return failure('RATE_LIMITED', 'Please wait before reporting again.', 429);
    return Response.json({ id: reportId }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('REPORT_FAILED', 'Report could not be submitted.', 409); }
}
