'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { favorited: false };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('favorites')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('favorites').delete().eq('id', existing.id);
    for (const locale of ['en', 'ja'] as const) revalidatePath(`/${locale}/posts/${postId}`);
    revalidatePath('/[locale]/timeline', 'page');
    return { favorited: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('favorites').insert({ post_id: postId, user_id: user.id });
  for (const locale of ['en', 'ja'] as const) revalidatePath(`/${locale}/posts/${postId}`);
  revalidatePath('/[locale]/timeline', 'page');
  return { favorited: true };
}
