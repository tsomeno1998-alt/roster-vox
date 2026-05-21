'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { POINT_OPTIONS } from '@/lib/types';

interface SearchFormProps {
  factions: { id: string; name: string; group: string }[];
}

export default function SearchForm({ factions }: SearchFormProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  const currentQ = searchParams.get('q') ?? '';
  const currentFaction = searchParams.get('faction') ?? '';
  const currentPoints = searchParams.get('points') ?? '';
  const currentPeriod = searchParams.get('period') ?? '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const q = (data.get('q') as string).trim();
    if (q) params.set('q', q);
    if (currentFaction) params.set('faction', currentFaction);
    if (currentPoints) params.set('points', currentPoints);
    router.push(`${pathname}?${params.toString()}`);
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            name="q"
            defaultValue={currentQ}
            placeholder={t('placeholder')}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-bd bg-surface-alt text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary focus:bg-surface"
          />
        </div>
      </form>

      <div className="flex gap-2">
        <select
          value={currentFaction}
          onChange={(e) => updateFilter('faction', e.target.value)}
          className="flex-1 text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('allArmies')}</option>
          {factions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select
          value={currentPoints}
          onChange={(e) => updateFilter('points', e.target.value)}
          className="text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('allPoints')}</option>
          {POINT_OPTIONS.map((pt) => <option key={pt} value={String(pt)}>{pt}pt</option>)}
        </select>
        <select
          value={currentPeriod}
          onChange={(e) => updateFilter('period', e.target.value)}
          className="text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('allPeriods')}</option>
          <option value="7d">{t('period7d')}</option>
          <option value="30d">{t('period30d')}</option>
          <option value="90d">{t('period90d')}</option>
        </select>
      </div>
    </div>
  );
}
