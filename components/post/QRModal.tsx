'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  postUrl: string;
}

export default function QRModal({ postUrl }: Props) {
  const t = useTranslations('share');
  const [open, setOpen] = useState(false);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(postUrl)}&format=png`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-tx-muted rounded-full active:bg-surface-alt transition-colors"
        aria-label={t('qrCode')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="3" height="3"/>
          <rect x="18" y="14" width="3" height="3"/>
          <rect x="14" y="18" width="3" height="3"/>
          <rect x="18" y="18" width="3" height="3"/>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-surface rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center gap-4">
            <h3 className="font-semibold text-tx">{t('qrCode')}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="QR Code" width={200} height={200} className="rounded-xl" />
            <p className="text-xs text-tx-muted text-center">{t('qrHint')}</p>
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 rounded-xl border border-bd text-sm text-tx-muted font-medium"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
