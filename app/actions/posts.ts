'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/navigation';

function parseQaInt(formData: FormData, name: string): number | null {
  const val = (formData.get(name) as string)?.trim();
  if (!val) return null;
  const n = parseInt(val);
  return isNaN(n) ? null : n;
}

function parseQaBool(formData: FormData, name: string): boolean | null {
  const val = formData.get(name) as string;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return null;
}

function extractQaFields(formData: FormData) {
  return {
    qa_infiltrators:     parseQaInt(formData, 'qa_infiltrators'),
    qa_deep_strike:      parseQaInt(formData, 'qa_deep_strike'),
    qa_scout:            parseQaInt(formData, 'qa_scout'),
    qa_lone_operative:   parseQaInt(formData, 'qa_lone_operative'),
    qa_advance_charge:   parseQaBool(formData, 'qa_advance_charge'),
    qa_surge_move:       parseQaBool(formData, 'qa_surge_move'),
    qa_reactive_move:    parseQaBool(formData, 'qa_reactive_move'),
    qa_reserves:         parseQaBool(formData, 'qa_reserves'),
    qa_feel_no_pain:     parseQaBool(formData, 'qa_feel_no_pain'),
    qa_damage_reduction: parseQaBool(formData, 'qa_damage_reduction'),
    qa_oc_modifier:      parseQaBool(formData, 'qa_oc_modifier'),
    qa_battleshock:      parseQaBool(formData, 'qa_battleshock'),
  };
}

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
  const roster_text = (formData.get('roster_text') as string).trim();
  const photo_url = (formData.get('photo_url') as string)?.trim() || null;
  const comment_body = (formData.get('comment_body') as string)?.trim() || null;

  if (!faction_id || !points || !title || !roster_text) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data, error } = await sb
    .from('posts')
    .insert({ user_id: user.id, faction_id, points, title, roster_text, photo_url, ...extractQaFields(formData) })
    .select('id')
    .single();

  if (error) { console.error('createPost:', error); return; }

  if (comment_body) {
    await sb.from('comments').insert({
      post_id: data.id,
      user_id: user.id,
      type: 'comment',
      body: comment_body,
    });
  }

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
      ...extractQaFields(formData),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) { console.error('updatePost:', error); return; }

  revalidatePost(id);
  revalidateTimeline();
  await redirect(`/posts/${id}`);
}

export async function updateRecord(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('posts')
    .update({
      win: parseInt(formData.get('win') as string) || 0,
      loss: parseInt(formData.get('loss') as string) || 0,
      draw: parseInt(formData.get('draw') as string) || 0,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePost(id);
  revalidateTimeline();
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
