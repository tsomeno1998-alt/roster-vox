import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ProfileRow {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
  if (data) return data as ProfileRow;

  // トリガーが未実行の場合にフォールバックとして作成
  const emailPrefix = (user.email ?? 'user').split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'user';
  const suffix = user.id.replace(/-/g, '').slice(0, 6);
  const username = `${emailPrefix}_${suffix}`;
  const display_name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    username;
  const avatar_url = user.user_metadata?.avatar_url ?? null;

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: created } = await (admin as any)
    .from('profiles')
    .upsert({ id: user.id, username, display_name, avatar_url }, { onConflict: 'id' })
    .select('*')
    .single();

  return (created ?? null) as ProfileRow | null;
}

export async function getProfileByUsername(username: string): Promise<ProfileRow | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  return (data ?? null) as ProfileRow | null;
}

export async function getProfileStats(userId: string) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const [posts, followers, following] = await Promise.all([
    sb.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    sb.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    sb.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
  ]);

  return {
    postCount: (posts.count as number) ?? 0,
    followerCount: (followers.count as number) ?? 0,
    followingCount: (following.count as number) ?? 0,
  };
}

export async function isFollowing(followerId: string, followingId: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
  return !!data;
}

export interface NotificationWithActor {
  id: string;
  user_id: string;
  type: string;
  actor_id: string;
  post_id: string | null;
  comment_id: string | null;
  read: boolean;
  created_at: string;
  actor: { id: string; username: string; display_name: string; avatar_url: string | null } | null;
}

export async function getNotifications(userId: string): Promise<NotificationWithActor[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('notifications')
    .select('*, actor:profiles!notifications_actor_id_fkey(id, username, display_name, avatar_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  return (data ?? []) as NotificationWithActor[];
}

export interface FactionRow {
  id: string;
  name: string;
  group: string;
}

export const getFactions = cache(async (): Promise<FactionRow[]> => {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('factions')
    .select('id, name, group')
    .order('group')
    .order('name');
  return (data ?? []) as FactionRow[];
});
