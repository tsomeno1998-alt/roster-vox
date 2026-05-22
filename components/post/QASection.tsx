'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PostRow } from '@/lib/queries/posts';

interface Props {
  post: PostRow;
}

function QARow({ label, answer }: { label: string; answer: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-bd last:border-0">
      <span className="text-sm text-tx-muted flex-1 leading-snug">{label}</span>
      <span className="text-sm font-medium text-tx shrink-0">{answer}</span>
    </div>
  );
}

export default function QASection({ post }: Props) {
  const t = useTranslations('qa');
  const [open, setOpen] = useState(false);

  const hasQA = [
    post.qa_infiltrators, post.qa_deep_strike, post.qa_scout, post.qa_lone_operative,
    post.qa_fights_first,
    post.qa_advance_charge, post.qa_surge_move, post.qa_reactive_move, post.qa_reserves,
    post.qa_feel_no_pain, post.qa_damage_reduction, post.qa_oc_modifier, post.qa_battleshock,
    post.qa_fight_on_death,
  ].some((v) => v !== null);

  if (!hasQA) return null;

  const yn = (v: boolean) => v ? t('yes') : t('no');

  return (
    <div className="bg-surface-alt rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm text-tx">{t('title')}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-tx-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-3 border-t border-bd">
          {post.qa_infiltrators !== null && (
            <QARow label={t('labelInfiltrators')} answer={String(post.qa_infiltrators)} />
          )}
          {post.qa_deep_strike !== null && (
            <QARow label={t('labelDeepStrike')} answer={String(post.qa_deep_strike)} />
          )}
          {post.qa_scout !== null && (
            <QARow label={t('labelScout')} answer={String(post.qa_scout)} />
          )}
          {post.qa_lone_operative !== null && (
            <QARow label={t('labelLoneOperative')} answer={String(post.qa_lone_operative)} />
          )}
          {post.qa_fights_first !== null && (
            <QARow label={t('labelFightsFirst')} answer={String(post.qa_fights_first)} />
          )}
          {post.qa_advance_charge !== null && (
            <QARow label={t('labelAdvanceCharge')} answer={yn(post.qa_advance_charge)} />
          )}
          {post.qa_surge_move !== null && (
            <QARow label={t('labelSurgeMove')} answer={yn(post.qa_surge_move)} />
          )}
          {post.qa_reactive_move !== null && (
            <QARow label={t('labelReactiveMove')} answer={yn(post.qa_reactive_move)} />
          )}
          {post.qa_reserves !== null && (
            <QARow label={t('labelReserves')} answer={yn(post.qa_reserves)} />
          )}
          {post.qa_feel_no_pain !== null && (
            <QARow label={t('labelFeelNoPain')} answer={yn(post.qa_feel_no_pain)} />
          )}
          {post.qa_damage_reduction !== null && (
            <QARow label={t('labelDamageReduction')} answer={yn(post.qa_damage_reduction)} />
          )}
          {post.qa_oc_modifier !== null && (
            <QARow label={t('labelOcModifier')} answer={yn(post.qa_oc_modifier)} />
          )}
          {post.qa_battleshock !== null && (
            <QARow label={t('labelBattleshock')} answer={yn(post.qa_battleshock)} />
          )}
          {post.qa_fight_on_death !== null && (
            <QARow label={t('labelFightOnDeath')} answer={yn(post.qa_fight_on_death)} />
          )}
        </div>
      )}
    </div>
  );
}
