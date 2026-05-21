'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/navigation';

export async function updateAvatar(avatarUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin as any)
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id);

  revalidatePath('/[locale]/profile', 'page');
  revalidatePath('/[locale]/profile/edit', 'page');
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return await redirect('/login');

  const username = (formData.get('username') as string).trim();
  const display_name = (formData.get('display_name') as string).trim();
  const bio = (formData.get('bio') as string)?.trim() || null;

  if (!username || !display_name) return;

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin as any)
    .from('profiles')
    .upsert({ id: user.id, username, display_name, bio }, { onConflict: 'id' });

  if (error) { console.error('updateProfile:', error); return; }

  revalidatePath('/[locale]/profile', 'page');
  revalidatePath('/[locale]/profile/[username]', 'page');
  await redirect('/profile');
}
