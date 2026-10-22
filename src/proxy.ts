import { NextResponse, type NextRequest } from 'next/server';

// Only HexGL is gated. Its upstream licenses still need commercial-use clearance.
export function proxy(request: NextRequest) {
  const headers = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'private, no-store' };
  if (process.env.HEXGL_REVIEW_ENABLED !== '1') {
    return new NextResponse('Not found', { status: 404, headers });
  }
  if (request.nextUrl.pathname.replace(/\/$/, '') === '/play/hexgl') {
    const target = request.nextUrl.clone();
    target.pathname = '/play/hexgl/index.html';
    return NextResponse.rewrite(target, { headers });
  }
  return NextResponse.next({ headers });
}

export const config = { matcher: ['/play/hexgl/:path*', '/games/hexgl'] };
