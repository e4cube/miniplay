import 'server-only';
import { supabaseRequest } from './http';

export type PublicGameRequest = {
  id: string;
  title: string;
  body: string;
  category: string | null;
  locale: 'en' | 'zh-CN';
  status: 'approved' | 'planned' | 'added';
  vote_count: number;
  published_at: string | null;
};

export async function listPublicGameRequests(offset = 0): Promise<PublicGameRequest[]> {
  const response = await supabaseRequest(`/rest/v1/game_requests?select=id,title,body,category,locale,status,vote_count,published_at&status=in.(approved,planned,added)&deleted_at=is.null&order=vote_count.desc,published_at.desc&limit=20&offset=${offset}`,
    { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error('READ_FAILED');
  return response.json() as Promise<PublicGameRequest[]>;
}
