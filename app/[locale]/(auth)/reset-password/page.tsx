import { getTranslations } from 'next-intl/server';
import { resetPassword } from '@/app/actions/auth';
import SubmitButton from '@/components/ui/SubmitButton';

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xs">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Roster Vox" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-tx">{t('resetTitle')}</h1>
          <p className="text-sm text-tx-muted mt-1">{t('resetDescription')}</p>
        </div>

        {error && (
          <p className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center">
            {t('resetError')}
          </p>
        )}

        <form action={resetPassword} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder={t('resetNewPassword')}
            className="w-full px-4 py-3 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <SubmitButton fullWidth size="lg" pendingLabel={t('resetSubmitting')}>
            {t('resetSubmit')}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
