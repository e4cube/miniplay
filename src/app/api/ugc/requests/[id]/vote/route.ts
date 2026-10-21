import { writeGuard } from '@/lib/ugc/api';
import { failure, rpc } from '@/lib/ugc/http';
import { uuidPattern } from '@/lib/ugc/validation';

type Ctx = { params: Promise<{ id: string }> };
async function vote(request: Request, context: Ctx, voted: boolean) {
  const guard = await writeGuard(request); if (guard.error) return guard.error;
  const { id } = await context.params;
  if (!uuidPattern.test(id)) return failure('INVALID_INPUT', 'Invalid request ID.', 400);
  try {
    const count = await rpc<number>('set_request_vote', { p_request_id: id, p_voted: voted }, guard.token!);
    if (count < 0) return failure('RATE_LIMITED', 'Please wait before voting again.', 429);
    return Response.json({ voted, voteCount: count }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('VOTE_FAILED', 'Vote could not be updated.', 409); }
}
export async function PUT(request: Request, context: Ctx) { return vote(request, context, true); }
export async function DELETE(request: Request, context: Ctx) { return vote(request, context, false); }
