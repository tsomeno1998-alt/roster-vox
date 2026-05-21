'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { liked: false };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('likes').delete().eq('id', existing.id);
    for (const locale of ['en', 'ja'] as const) revalidatePath(`/${locale}/posts/${postId}`);
    revalidatePath('/[locale]/timeline', 'page');
    return { liked: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('likes').insert({ post_id: postId, user_id: user.id });

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
      type: 'like',
      actor_id: user.id,
      post_id: postId,
    });
  }

  for (const locale of ['en', 'ja'] as const) revalidatePath(`/${locale}/posts/${postId}`);
  revalidatePath('/[locale]/timeline', 'page');
  return { liked: true };
}
