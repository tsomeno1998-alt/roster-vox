'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/navigation';

function revalidateTimeline() {
  revalidatePath('/[locale]/timeline', 'page');
}

function revalidatePost(id: string) {
  for (const locale of ['en', 'ja'] as const) {
    revalidatePath(`/${locale}/posts/${id}`);
  }
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return await redirect('/login');

  const faction_id = formData.get('faction_id') as string;
  const points = parseInt(formData.get('points') as string);
  const title = (formData.get('title') as string).trim();
  const concept = (formData.get('concept') as string)?.trim() || null;
  const roster_text = (formData.get('roster_text') as string).trim();
  const photo_url = (formData.get('photo_url') as string)?.trim() || null;

  if (!faction_id || !points || !title || !roster_text) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('posts')
    .insert({ user_id: user.id, faction_id, points, title, concept, roster_text, photo_url })
    .select('id')
    .single();

  if (error) { console.error('createPost:', error); return; }

  revalidateTimeline();
  await redirect(`/posts/${data.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return await redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('posts')
    .update({
      faction_id: formData.get('faction_id') as string,
      points: parseInt(formData.get('points') as string),
      title: (formData.get('title') as string).trim(),
      concept: (formData.get('concept') as string)?.trim() || null,
      roster_text: (formData.get('roster_text') as string).trim(),
      photo_url: (formData.get('photo_url') as string)?.trim() || null,
      win: parseInt(formData.get('win') as string) || 0,
      loss: parseInt(formData.get('loss') as string) || 0,
      draw: parseInt(formData.get('draw') as string) || 0,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) { console.error('updatePost:', error); return; }

  revalidatePost(id);
  revalidateTimeline();
  await redirect(`/posts/${id}`);
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return await redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('posts').delete().eq('id', id).eq('user_id', user.id);

  revalidateTimeline();
  await redirect('/timeline');
}
