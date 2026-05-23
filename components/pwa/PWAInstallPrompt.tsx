'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const DISMISSED_KEY = 'pwa-prompt-dismissed-at';
const DISMISS_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function IOSGuide({ t }: { t: ReturnType<typeof useTranslations<'pwa'>> }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-xl border border-bd">
        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-tx">{t('iosStep1Title')}</p>
          <p className="text-xs text-tx-muted mb-2">{t('iosStep1Hint')}</p>
          <div className="bg-[#f2f2f7] rounded-xl px-4 py-3 flex items-center justify-around">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#b0b0b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#d0d0d8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="bg-primary/20 rounded-xl p-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v13" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 7l4-4 4 4" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="#b0b0b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="border-[1.8px] border-[#b0b0b8] rounded-md w-[22px] h-[18px] flex items-center justify-center">
              <span className="text-[9px] font-bold text-[#b0b0b8]">2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-xl border border-bd">
        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-tx">{t('iosStep2Title')}</p>
          <p className="text-xs text-tx-muted mb-2">{t('iosStep2Hint')}</p>
          <div className="bg-[#f2f2f7] rounded-xl p-2.5">
            <div className="flex items-start justify-around">
              <div className="flex flex-col items-center gap-1 w-1/4">
                <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </div>
                <span className="text-[8px] text-[#3c3c43] text-center leading-tight">コピー</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-1/4">
                <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <span className="text-[8px] text-[#3c3c43] text-center leading-tight">デバイスに<br />送信</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-1/4">
                <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="3" y1="6" x2="13" y2="6"/><line x1="3" y1="11" x2="13" y2="11"/><line x1="3" y1="16" x2="13" y2="16"/>
                    <line x1="18" y1="9" x2="18" y2="15"/><line x1="15" y1="12" x2="21" y2="12"/>
                  </svg>
                </div>
                <span className="text-[8px] text-[#3c3c43] text-center leading-tight">リーディング<br />リストに追加</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-1/4">
                <div className="w-11 h-11 rounded-xl bg-primary/20 ring-2 ring-primary flex items-center justify-center">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </div>
                <span className="text-[8px] text-primary font-semibold text-center leading-tight">表示を<br />増やす</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-xl border border-bd">
        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-tx">{t('iosStep3Title')}</p>
          <p className="text-xs text-tx-muted mb-2">{t('iosStep3Hint')}</p>
          <div className="bg-white rounded-2xl border border-bd shadow-sm px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl shadow flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#1c1c1e" strokeWidth="1.8"/>
                <path d="M12 8v8M8 12h8" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-tx">{t('iosStep3MenuLabel')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PWAInstallPrompt() {
  const t = useTranslations('pwa');
  const [device, setDevice] = useState<'ios' | 'android' | null>(null);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [noShow, setNoShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('pwa')) return;

    window.history.replaceState(null, '', window.location.pathname);

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_DAYS * 86_400_000) return;

    const ua = navigator.userAgent;

    if (/iPad|iPhone|iPod/.test(ua)) {
      setDevice('ios');
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setDevice('android');
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function close() {
    setVisible(false);
  }

  async function installAndroid() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible || !device) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="relative w-full bg-surface rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="p-5 pb-[calc(4rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Roster Vox" className="w-12 h-12" />
              <div>
                <p className="font-bold text-tx">{t('title')}</p>
                <p className="text-xs text-tx-muted">{t('subtitle')}</p>
              </div>
            </div>
            <button onClick={close} className="p-1.5 text-tx-muted rounded-full active:bg-surface-alt">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {device === 'android' && (
            <button
              onClick={installAndroid}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl mb-5 active:opacity-80 transition-opacity"
            >
              {t('androidButton')}
            </button>
          )}

          {device === 'ios' && (
            <div className="mb-5">
              <IOSGuide t={t} />
            </div>
          )}

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={noShow}
              onChange={e => {
                const checked = e.target.checked;
                setNoShow(checked);
                if (checked) localStorage.setItem(DISMISSED_KEY, String(Date.now()));
                else localStorage.removeItem(DISMISSED_KEY);
              }}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-xs text-tx-muted">{t('noShow')}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
