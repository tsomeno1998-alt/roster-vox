'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

function revalidatePost(postId: string) {
  for (const locale of ['en', 'ja'] as const) revalidatePath(`/${locale}/posts/${postId}`);
}

export async function addComment(postId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const body = (formData.get('body') as string)?.trim() || null;
  const type = (formData.get('type') as string) || 'comment';
  const result = (formData.get('result') as string) || null;
  const opponent_faction_id = (formData.get('opponent_faction_id') as string) || null;

  if (!body && type === 'comment') return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('comments').insert({
    post_id: postId,
    user_id: user.id,
    type,
    body,
    result: result || null,
    opponent_faction_id: opponent_faction_id || null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: post } = await (supabase as any)
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (post && post.user_id !== user.id) {
    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('notifications').insert({
      user_id: post.user_id,
      type: 'comment',
      actor_id: user.id,
      post_id: postId,
    });
  }

  revalidatePost(postId);
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('comments').delete().eq('id', commentId).eq('user_id', user.id);
  revalidatePost(postId);
}
