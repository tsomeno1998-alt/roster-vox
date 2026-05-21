'use server';

import { createClient } from '@/lib/supabase/server';
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
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) await redirect('/login?error=signup');
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
