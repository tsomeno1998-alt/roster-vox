'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signInWithEmail, signUpWithEmail } from '@/app/actions/auth';
import Button from '@/components/ui/Button';

interface Props {
  error?: string;
}

export const EMAIL_ERRORS = ['credentials', 'email_not_confirmed', 'signup'];

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:ring-2 focus:ring-primary/30';

export default function EmailAuthForm({ error }: Props) {
  const t = useTranslations('auth');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const emailError = error && EMAIL_ERRORS.includes(error) ? getErrorMessage(t, error) : null;

  return (
    <div className="w-full max-w-xs">
      <div className="flex gap-1 mb-4 bg-surface-alt rounded-xl p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            mode === 'login' ? 'bg-surface text-tx shadow-sm' : 'text-tx-muted'
          }`}
        >
          {t('loginTab')}
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            mode === 'signup' ? 'bg-surface text-tx shadow-sm' : 'text-tx-muted'
          }`}
        >
          {t('signupTab')}
        </button>
      </div>

      {emailError && (
        <p className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center">
          {emailError}
        </p>
      )}

      {mode === 'login' ? (
        <form action={signInWithEmail} className="flex flex-col gap-3">
          <input type="email" name="email" required autoComplete="email" placeholder={t('emailPlaceholder')} className={inputCls} />
          <input type="password" name="password" required autoComplete="current-password" placeholder={t('passwordPlaceholder')} className={inputCls} />
          <Button type="submit" variant="primary" fullWidth>{t('loginButton')}</Button>
        </form>
      ) : (
        <form action={signUpWithEmail} className="flex flex-col gap-3">
          <input type="email" name="email" required autoComplete="email" placeholder={t('emailPlaceholder')} className={inputCls} />
          <input type="password" name="password" required minLength={6} autoComplete="new-password" placeholder={t('passwordSignupPlaceholder')} className={inputCls} />
          <Button type="submit" variant="primary" fullWidth>{t('signupButton')}</Button>
        </form>
      )}
    </div>
  );
}

function getErrorMessage(t: (key: string) => string, error: string): string {
  if (error === 'credentials') return t('errorCredentials');
  if (error === 'email_not_confirmed') return t('errorEmailNotConfirmed');
  if (error === 'signup') return t('errorSignup');
  return t('errorOAuth');
}
