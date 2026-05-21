'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/queries/profiles';
import { redirect } from '@/i18n/navigation';

export async function submitContact(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!name || !email || !message) {
    await redirect('/contact?error=required');
  }

  const user = await getCurrentUser();
  const admin = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin as any).from('contact_messages').insert({
    user_id: user?.id ?? null,
    name,
    email,
    message,
  });

  if (error) {
    console.error('submitContact:', error);
    await redirect('/contact?error=failed');
  }

  await redirect('/contact?sent=1');
}
