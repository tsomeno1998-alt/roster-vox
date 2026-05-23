import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  const acceptLang = request.headers.get('accept-language') ?? '';
  const locale = acceptLang.toLowerCase().includes('ja') ? 'ja' : 'en';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next === 'reset-password') {
        return NextResponse.redirect(`${origin}/${locale}/reset-password`);
      }
      return NextResponse.redirect(`${origin}/${locale}/timeline?pwa=1`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=auth`);
}
