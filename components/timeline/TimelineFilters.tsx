'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { POINT_OPTIONS } from '@/lib/types';
import type { FactionGroup } from '@/lib/types';

interface Faction {
  id: string;
  name: string;
  group: string;
}

interface TimelineFiltersProps {
  factions: Faction[];
}

const GROUPS: FactionGroup[] = ['Imperium', 'Chaos', 'Xenos'];
const GROUP_COLORS: Record<FactionGroup, string> = {
  Imperium: 'bg-amber-100 text-amber-800 border-amber-300',
  Chaos: 'bg-red-100 text-red-800 border-red-300',
  Xenos: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export default function TimelineFilters({ factions }: TimelineFiltersProps) {
  const t = useTranslations('timeline');
  const tf = useTranslations('factions');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get('sort') ?? 'latest';
  const currentFaction = searchParams.get('faction') ?? '';
  const currentPoints = searchParams.get('points') ?? '';

  const selectedFactionGroup = currentFaction
    ? (factions.find((f) => f.id === currentFaction)?.group as FactionGroup | undefined)
    : undefined;
  const currentGroup = selectedFactionGroup ?? (searchParams.get('group') as FactionGroup | null) ?? '';

  function update(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function selectGroup(group: FactionGroup | '') {
    update({ group: group as string, faction: '' });
  }

  function selectFaction(factionId: string) {
    update({ faction: factionId, group: '' });
  }

  const groupFactions = currentGroup
    ? factions.filter((f) => f.group === currentGroup)
    : [];

  const groupLabel: Record<FactionGroup, string> = {
    Imperium: tf('imperium'),
    Chaos: tf('chaos'),
    Xenos: tf('xenos'),
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          {[
            { value: 'latest', label: t('sortLatest') },
            { value: 'popular', label: t('sortPopular') },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => update({ sort: value === 'latest' ? '' : value })}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                currentSort === value
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-bd text-tx-muted hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={currentPoints}
          onChange={(e) => update({ points: e.target.value })}
          className="ml-auto text-xs px-2 py-1.5 rounded-full border border-bd text-tx-muted bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">{t('filterAllPoints')}</option>
          {POINT_OPTIONS.map((pt) => (
            <option key={pt} value={String(pt)}>{pt}pt</option>
          ))}
        </select>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <button
          onClick={() => selectGroup('')}
          className={`whitespace-nowrap flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !currentGroup && !currentFaction
              ? 'bg-primary text-white border-primary'
              : 'border-bd text-tx-muted hover:border-primary hover:text-primary'
          }`}
        >
          {t('filterAll')}
        </button>
        {GROUPS.map((group) => (
          <button
            key={group}
            onClick={() => selectGroup(currentGroup === group && !currentFaction ? '' : group)}
            className={`whitespace-nowrap flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              currentGroup === group || selectedFactionGroup === group
                ? GROUP_COLORS[group]
                : 'border-bd text-tx-muted hover:border-primary hover:text-primary'
            }`}
          >
            {groupLabel[group]}
          </button>
        ))}
      </div>

      {groupFactions.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {groupFactions.map((f) => (
            <button
              key={f.id}
              onClick={() => selectFaction(currentFaction === f.id ? '' : f.id)}
              className={`whitespace-nowrap flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                currentFaction === f.id
                  ? 'bg-primary text-white border-primary'
                  : 'border-bd text-tx-muted hover:border-primary hover:text-primary'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
