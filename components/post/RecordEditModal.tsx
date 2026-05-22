'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  win: number;
  loss: number;
  draw: number;
  action: (formData: FormData) => Promise<void>;
}

export default function RecordEditModal({ win, loss, draw, action }: Props) {
  const t = useTranslations('post');
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-primary font-medium hover:opacity-80 transition-opacity"
      >
        {t('editRecord')}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { if (!isPending) setOpen(false); }} />
          <div className="relative bg-surface rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="font-bold text-tx text-base mb-5">{t('editRecord')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-3 mb-6">
                {([
                  ['win', t('winLabel'), win],
                  ['loss', t('lossLabel'), loss],
                  ['draw', t('drawLabel'), draw],
                ] as const).map(([name, label, val]) => (
                  <div key={name} className="flex-1">
                    <label className="block text-xs text-tx-muted mb-1 text-center">{label}</label>
                    <input
                      type="number"
                      name={name}
                      min={0}
                      defaultValue={val}
                      className="w-full px-2 py-2 rounded-xl border border-bd bg-surface-alt text-sm text-tx text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl border border-bd text-sm text-tx-muted font-medium disabled:opacity-50"
                >
                  {tc('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending && (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                    </svg>
                  )}
                  {isPending ? t('savingRecord') : t('saveRecord')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
