'use client';

import { useTranslations } from 'next-intl';

interface Props {
  action: () => Promise<void>;
}

export default function DeleteAccountButton({ action }: Props) {
  const t = useTranslations('profile');

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(t('deleteAccountConfirm'))) e.preventDefault();
      }}
    >
      <button type="submit" className="text-xs text-red-400 hover:text-red-600 transition-colors">
        {t('deleteAccount')}
      </button>
    </form>
  );
}
