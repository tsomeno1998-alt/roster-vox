'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PhotoPicker from '@/components/ui/PhotoPicker';
import SubmitButton from '@/components/ui/SubmitButton';

interface Props {
  userId: string;
  initialPhotoUrl?: string | null;
  photoLabel: string;
  photoHint: string;
  submitLabel: string;
  pendingLabel: string;
}

export default function PostFormFooter({
  userId,
  initialPhotoUrl,
  photoLabel,
  photoHint,
  submitLabel,
  pendingLabel,
}: Props) {
  const t = useTranslations('post');
  const [uploading, setUploading] = useState(false);

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-tx mb-1.5">{t('photoLabel')}</label>
        <PhotoPicker
          userId={userId}
          initialUrl={initialPhotoUrl}
          label={photoLabel}
          hint={photoHint}
          onUploadChange={setUploading}
        />
        {uploading && (
          <p className="text-xs text-primary mt-1">アップロード中...完了までお待ちください</p>
        )}
      </div>
      <div className="pb-6">
        <SubmitButton fullWidth size="lg" pendingLabel={pendingLabel} disabled={uploading}>
          {submitLabel}
        </SubmitButton>
      </div>
    </>
  );
}
