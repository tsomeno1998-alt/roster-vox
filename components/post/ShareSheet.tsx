'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  postTitle: string;
  postUrl: string;
}

export default function ShareSheet({ postTitle, postUrl }: Props) {
  const t = useTranslations('share');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1500);
  }

  function shareToX() {
    const text = encodeURIComponent(`${postTitle} #RosterVox`);
    const url = encodeURIComponent(postUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(postUrl)}&format=png`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-tx-muted rounded-full active:bg-surface-alt transition-colors"
        aria-label={t('title')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setShowQR(false); }} />
          <div className="relative w-full bg-surface rounded-t-2xl shadow-xl p-5 pb-10 max-w-lg mx-auto">
            <div className="w-10 h-1 bg-bd rounded-full mx-auto mb-5" />
            {showQR ? (
              <>
                <h3 className="font-semibold text-tx text-center mb-4">{t('qrCode')}</h3>
                <div className="flex flex-col items-center gap-4 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrSrc} alt="QR Code" width={200} height={200} className="rounded-xl" />
                  <p className="text-xs text-tx-muted text-center">{t('qrHint')}</p>
                </div>
                <button
                  onClick={() => setShowQR(false)}
                  className="w-full mt-4 py-2.5 rounded-xl border border-bd text-sm text-tx-muted font-medium"
                >
                  {t('back')}
                </button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-tx text-center mb-4">{t('title')}</h3>
                <div className="space-y-3">
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-bd active:bg-surface-alt transition-colors"
                  >
                    <span className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                      {copied ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b2fc9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b2fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium text-tx">
                      {copied ? t('copied') : t('copyLink')}
                    </span>
                  </button>

                  <button
                    onClick={shareToX}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-bd active:bg-surface-alt transition-colors"
                  >
                    <span className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-tx">{t('shareToX')}</span>
                  </button>

                  <button
                    onClick={() => setShowQR(true)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-bd active:bg-surface-alt transition-colors"
                  >
                    <span className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-tx">{t('showQR')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
