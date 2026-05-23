import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-tx mb-2">{t('verifyTitle')}</h1>

      {email && (
        <p className="text-sm text-tx-muted mb-1">
          <span className="font-medium text-tx">{email}</span>{' '}
          {t('verifySentTo')}
        </p>
      )}

      <p className="text-sm text-tx-muted mb-8 max-w-xs leading-relaxed">
        {t('verifyInstructions')}
      </p>

      <Link href="/login" className="text-sm text-primary font-medium hover:underline">
        {t('backToLogin')}
      </Link>
    </div>
  );
}
