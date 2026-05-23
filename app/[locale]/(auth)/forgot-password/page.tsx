import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sendPasswordResetEmail } from '@/app/actions/auth';
import SubmitButton from '@/components/ui/SubmitButton';

interface Props {
  searchParams: Promise<{ sent?: string; error?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  const t = await getTranslations('auth');

  if (sent) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-tx mb-2">{t('forgotSentTitle')}</h1>
          <p className="text-sm text-tx-muted mb-6">
            {t('forgotSentDescription', { email: decodeURIComponent(sent) })}
          </p>
          <Link href="/login" className="text-sm font-medium text-primary underline">
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xs">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Roster Vox" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-tx">{t('forgotTitle')}</h1>
          <p className="text-sm text-tx-muted mt-1">{t('forgotDescription')}</p>
        </div>

        {error && (
          <p className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center">
            {t('forgotError')}
          </p>
        )}

        <form action={sendPasswordResetEmail} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <SubmitButton fullWidth size="lg" pendingLabel={t('forgotSubmitting')}>
            {t('forgotSubmit')}
          </SubmitButton>
        </form>

        <p className="mt-6 text-center">
          <Link href="/login" className="text-sm text-tx-muted hover:text-primary">
            {t('backToLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
}
