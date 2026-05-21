import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Accept-Language からロケールを推定
      const acceptLang = request.headers.get('accept-language') ?? '';
      const locale = acceptLang.toLowerCase().includes('ja') ? 'ja' : 'en';
      return NextResponse.redirect(`${origin}/${locale}/timeline?pwa=1`);
    }
  }

  const acceptLang = request.headers.get('accept-language') ?? '';
  const locale = acceptLang.toLowerCase().includes('ja') ? 'ja' : 'en';
  return NextResponse.redirect(`${origin}/${locale}/login?error=auth`);
}
