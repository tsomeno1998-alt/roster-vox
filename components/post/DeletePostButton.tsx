'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

interface DeletePostButtonProps {
  action: () => Promise<void>;
}

export default function DeletePostButton({ action }: DeletePostButtonProps) {
  const t = useTranslations('post');

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(t('deleteConfirm'))) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger" fullWidth>{t('delete')}</Button>
    </form>
  );
}
