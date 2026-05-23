'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { headers } from 'next/headers';
import { redirect as nextRedirect } from 'next/navigation';
import { redirect } from '@/i18n/navigation';

async function getCallbackUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
  }
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}/auth/callback`;
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const callbackUrl = await getCallbackUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: callbackUrl },
  });

  if (error) await redirect('/login?error=oauth');
  if (data.url) nextRedirect(data.url);
}

export async function signInWithDiscord() {
  const supabase = await createClient();
  const callbackUrl = await getCallbackUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: callbackUrl },
  });

  if (error) await redirect('/login?error=oauth');
  if (data.url) nextRedirect(data.url);
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const display_name = (formData.get('display_name') as string)?.trim() || null;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) await redirect('/login?error=signup');

  if (data.user) {
    const admin = createAdminClient();
    // Confirm email immediately so user can log in regardless of Supabase settings
    await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true });
    await supabase.auth.signInWithPassword({ email, password });

    // Save display name to profile
    if (display_name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any)
        .from('profiles')
        .upsert({ id: data.user.id, display_name }, { onConflict: 'id' });
    }
  }

  await redirect('/timeline?pwa=1');
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error?.code === 'email_not_confirmed' || error?.message === 'Email not confirmed') {
    await redirect('/login?error=email_not_confirmed');
  }
  if (error) await redirect('/login?error=credentials');
  await redirect('/timeline?pwa=1');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await redirect('/login');
}

export async function sendPasswordResetEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();
  const callbackUrl = await getCallbackUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${callbackUrl}?next=reset-password`,
  });

  if (error) await redirect('/forgot-password?error=send');
  nextRedirect(`/forgot-password?sent=${encodeURIComponent(email)}`);
}

export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) await redirect('/reset-password?error=reset');
  await redirect('/timeline');
}

export async function changePassword(formData: FormData) {
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) await redirect('/profile/edit?error=password');
  await redirect('/profile/edit?success=password');
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return await redirect('/login');

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(user.id);
  await supabase.auth.signOut();
  await redirect('/login');
}
