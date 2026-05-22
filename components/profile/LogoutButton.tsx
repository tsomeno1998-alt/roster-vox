'use client';

import { useTranslations } from 'next-intl';

interface Props {
  action: () => Promise<void>;
}

export default function LogoutButton({ action }: Props) {
  const t = useTranslations('profile');

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(t('logoutConfirm'))) e.preventDefault();
      }}
    >
      <button type="submit" className="text-xs text-tx-muted hover:text-red-500 transition-colors">
        {t('logout')}
      </button>
    </form>
  );
}
