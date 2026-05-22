import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 環境変数が未設定の場合はi18nのみ
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return handleI18n(request);
  }

  const { pathname } = request.nextUrl;

  // ロケールをURLから検出（なければデフォルト）
  const locale =
    (routing.locales as readonly string[]).find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    ) ?? routing.defaultLocale;

  const rest = pathname.startsWith(`/${locale}`)
    ? pathname.slice(locale.length + 1) || '/'
    : pathname;

  const isAuthRoute =
    rest === '/login' ||
    rest === '/verify-email' ||
    rest.startsWith('/auth/');

  const isPublicRoute =
    rest.startsWith('/posts/') ||
    rest === '/terms' ||
    rest === '/privacy';

  // Auth callbackはi18nリダイレクトをスキップ（ロケールプレフィックスなしで直接処理）
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next({ request });
  }

  // i18nミドルウェアを実行（ロケールリダイレクトの場合はそのまま返す）
  const i18nResult = handleI18n(request);
  if (i18nResult.status === 307 || i18nResult.status === 308) {
    return i18nResult;
  }

  // Supabase認証チェック
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (user && isAuthRoute && !rest.startsWith('/auth/')) {
    return NextResponse.redirect(new URL(`/${locale}/timeline`, request.url));
  }

  // i18nヘッダー（ロケール情報）をsupabaseレスポンスにマージ
  i18nResult.headers.forEach((value, key) => {
    supabaseResponse.headers.set(key, value);
  });
  for (const cookie of i18nResult.cookies.getAll()) {
    supabaseResponse.cookies.set(cookie.name, cookie.value);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
