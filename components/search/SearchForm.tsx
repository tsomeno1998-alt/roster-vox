'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { POINT_OPTIONS } from '@/lib/types';

interface SearchFormProps {
  factions: { id: string; name: string; group: string }[];
  isLoggedIn?: boolean;
}

export default function SearchForm({ factions, isLoggedIn = false }: SearchFormProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentQ = searchParams.get('q') ?? '';
  const currentFaction = searchParams.get('faction') ?? '';
  const currentPoints = searchParams.get('points') ?? '';
  const currentPeriod = searchParams.get('period') ?? '';
  const currentWinRate = searchParams.get('winRate') ?? '';
  const currentFollowing = searchParams.get('following') === '1';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const q = (data.get('q') as string).trim();
    const faction = data.get('faction') as string;
    const points = data.get('points') as string;
    const period = data.get('period') as string;
    const following = data.get('following') as string;
    if (q) params.set('q', q);
    if (faction) params.set('faction', faction);
    if (points) params.set('points', points);
    if (period) params.set('period', period);
    if (following) params.set('following', '1');
    const winRate = data.get('winRate') as string;
    if (winRate) params.set('winRate', winRate);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
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

      <div className="flex gap-2">
        <select
          name="faction"
          defaultValue={currentFaction}
          className="flex-1 text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('allArmies')}</option>
          {factions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select
          name="points"
          defaultValue={currentPoints}
          className="text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('allPoints')}</option>
          {POINT_OPTIONS.map((pt) => <option key={pt} value={String(pt)}>{pt}pt</option>)}
        </select>
        <select
          name="period"
          defaultValue={currentPeriod}
          className="text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('allPeriods')}</option>
          <option value="7d">{t('period7d')}</option>
          <option value="30d">{t('period30d')}</option>
          <option value="90d">{t('period90d')}</option>
        </select>
        <select
          name="winRate"
          defaultValue={currentWinRate}
          className="text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('filterWinRate')}</option>
          <option value="recorded">{t('winRateRecorded')}</option>
          <option value="50">{t('winRate50')}</option>
          <option value="70">{t('winRate70')}</option>
          <option value="80">{t('winRate80')}</option>
        </select>
      </div>

      {isLoggedIn && (
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="following"
            value="1"
            defaultChecked={currentFollowing}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-xs text-tx-muted">{t('filterFollowing')}</span>
        </label>
      )}

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
      >
        {t('searchButton')}
      </button>
    </form>
  );
}
