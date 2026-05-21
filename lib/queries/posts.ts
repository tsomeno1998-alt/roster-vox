import { createClient } from '@/lib/supabase/server';

type CountArr = { count: number }[];

function extractCount(arr: unknown): number {
  if (!Array.isArray(arr)) return 0;
  return (arr as CountArr)[0]?.count ?? 0;
}

// Raw type that Supabase actually returns (before we transform counts)
type RawPost = {
  id: string;
  user_id: string;
  faction_id: string;
  points: number;
  title: string;
  concept: string | null;
  roster_text: string;
  win: number;
  loss: number;
  draw: number;
  photo_url: string | null;
  created_at: string;
  profiles: { id: string; username: string; display_name: string; avatar_url: string | null } | null;
  factions: { id: string; name: string; group: string } | null;
  likes: unknown;
  comments: unknown;
};

export interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  type: string;
  body: string | null;
  photo_url: string | null;
  result: string | null;
  opponent_faction_id: string | null;
  created_at: string;
  profiles: { id: string; username: string; display_name: string; avatar_url: string | null } | null;
  factions: { id: string; name: string; group: string } | null;
}

export interface PostRow {
  id: string;
  user_id: string;
  faction_id: string;
  points: number;
  title: string;
  concept: string | null;
  roster_text: string;
  win: number;
  loss: number;
  draw: number;
  photo_url: string | null;
  created_at: string;
  profiles: { id: string; username: string; display_name: string; avatar_url: string | null } | null;
  factions: { id: string; name: string; group: string } | null;
  likes_count: number;
  comments_count: number;
}

export async function getPosts({
  factionId,
  points,
  sort = 'latest',
  limit = 20,
  offset = 0,
  userId,
  followingOnly = false,
}: {
  factionId?: string;
  points?: number;
  sort?: 'latest' | 'popular';
  limit?: number;
  offset?: number;
  userId?: string;
  followingOnly?: boolean;
} = {}): Promise<PostRow[]> {
  const supabase = await createClient();

  if (followingOnly && userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: follows } = await (supabase as any)
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    const ids: string[] = (follows ?? []).map((f: { following_id: string }) => f.following_id);
    if (ids.length === 0) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any).from('posts').select(`
      *,
      profiles(id, username, display_name, avatar_url),
      factions(id, name, group),
      likes(count),
      comments(count)
    `).in('user_id', ids);
    if (factionId) query = query.eq('faction_id', factionId);
    if (points) query = query.eq('points', points);
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    const { data, error } = await query;
    if (error) { console.error('getPosts(following):', error); return []; }
    const rows = (data as RawPost[]).map((p): PostRow => ({
      ...p,
      likes_count: extractCount(p.likes),
      comments_count: extractCount(p.comments),
    }));
    if (sort === 'popular') rows.sort((a, b) => b.likes_count - a.likes_count);
    return rows;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any).from('posts').select(`
    *,
    profiles(id, username, display_name, avatar_url),
    factions(id, name, group),
    likes(count),
    comments(count)
  `);

  if (factionId) query = query.eq('faction_id', factionId);
  if (points) query = query.eq('points', points);

  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) { console.error('getPosts:', error); return []; }

  const rows = (data as RawPost[]).map((p): PostRow => ({
    ...p,
    likes_count: extractCount(p.likes),
    comments_count: extractCount(p.comments),
  }));

  if (sort === 'popular') {
    rows.sort((a, b) => b.likes_count - a.likes_count);
  }

  return rows;
}

export async function getPost(id: string): Promise<PostRow | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('posts')
    .select(`
      *,
      profiles(id, username, display_name, avatar_url),
      factions(id, name, group),
      likes(count)
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  const raw = data as RawPost;
  return { ...raw, likes_count: extractCount(raw.likes), comments_count: 0 };
}

export async function getUserPosts(userId: string): Promise<PostRow[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('posts')
    .select(`
      *,
      profiles(id, username, display_name, avatar_url),
      factions(id, name, group),
      likes(count),
      comments(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];

  return (data as RawPost[]).map((p): PostRow => ({
    ...p,
    likes_count: extractCount(p.likes),
    comments_count: extractCount(p.comments),
  }));
}

export async function getComments(postId: string): Promise<CommentRow[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('comments')
    .select(`*, profiles(id, username, display_name, avatar_url), factions(id, name, group)`)
    .eq('post_id', postId)
    .eq('type', 'comment')
    .order('created_at', { ascending: true });

  return (data ?? []) as CommentRow[];
}

export async function getUsedReports(postId: string): Promise<CommentRow[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('comments')
    .select(`*, profiles(id, username, display_name, avatar_url), factions(id, name, group)`)
    .eq('post_id', postId)
    .eq('type', 'used')
    .order('created_at', { ascending: false });

  return (data ?? []) as CommentRow[];
}

export async function getUserLikedPostIds(userId: string, postIds: string[]) {
  if (postIds.length === 0) return new Set<string>();

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('likes')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', postIds);

  return new Set(((data ?? []) as { post_id: string }[]).map((l) => l.post_id));
}

export async function searchPosts(keyword: string): Promise<PostRow[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('posts')
    .select(`
      *,
      profiles(id, username, display_name, avatar_url),
      factions(id, name, group),
      likes(count),
      comments(count)
    `)
    .or(`title.ilike.%${keyword}%,concept.ilike.%${keyword}%`)
    .order('created_at', { ascending: false })
    .limit(30);

  return ((data ?? []) as RawPost[]).map((p): PostRow => ({
    ...p,
    likes_count: extractCount(p.likes),
    comments_count: extractCount(p.comments),
  }));
}
