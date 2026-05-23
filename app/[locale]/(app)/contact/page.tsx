import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { submitContact } from '@/app/actions/contact';
import SubmitButton from '@/components/ui/SubmitButton';

interface Props {
  searchParams: Promise<{ sent?: string; error?: string }>;
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary';

export default async function ContactPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  const t = await getTranslations('contact');
  const tp = await getTranslations('profile');

  if (sent) {
    return (
      <div className="flex flex-col min-h-full">
        <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
          <Link href="/profile" className="text-tx-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-tx">{t('title')}</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-tx">{t('successTitle')}</h2>
          <p className="text-sm text-tx-muted">{t('successBody')}</p>
          <Link href="/profile" className="text-sm text-primary hover:underline">{t('backToProfile')}</Link>
        </div>
      </div>
    );
  }

  const errorMsg = error === 'required' ? t('errorRequired')
    : error === 'failed' ? t('errorFailed')
    : null;

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/profile" className="text-tx-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-tx">{t('title')}</h1>
      </header>

      <div className="px-4 py-6 space-y-5">
        <p className="text-sm text-tx-muted">{t('subtitle')}</p>

        {errorMsg && (
          <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{errorMsg}</p>
        )}

        <form action={submitContact} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tx mb-1.5">{t('nameLabel')}</label>
            <input type="text" name="name" required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-tx mb-1.5">{t('emailLabel')}</label>
            <input type="email" name="email" required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-tx mb-1.5">{t('messageLabel')}</label>
            <textarea
              name="message"
              rows={5}
              required
              placeholder={t('messagePlaceholder')}
              className={`${inputCls} resize-none`}
            />
          </div>
          <SubmitButton fullWidth size="lg" pendingLabel={t('sending')}>{t('submitButton')}</SubmitButton>
        </form>

        <div className="pt-2 text-center">
          <Link href="/guide" className="text-sm text-primary hover:underline">
            {tp('guide')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
