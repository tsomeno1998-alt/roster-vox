'use client';

import { useTranslations } from 'next-intl';

export interface QAValues {
  qa_infiltrators?: number | null;
  qa_deep_strike?: number | null;
  qa_scout?: number | null;
  qa_lone_operative?: number | null;
  qa_fights_first?: number | null;
  qa_advance_charge?: boolean | null;
  qa_surge_move?: boolean | null;
  qa_reactive_move?: boolean | null;
  qa_reserves?: boolean | null;
  qa_feel_no_pain?: boolean | null;
  qa_damage_reduction?: boolean | null;
  qa_oc_modifier?: boolean | null;
  qa_battleshock?: boolean | null;
  qa_fight_on_death?: boolean | null;
}

interface Props {
  defaultValues?: QAValues;
}

function IntField({ name, label, defaultValue }: { name: string; label: string; defaultValue?: number | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={name} className="text-xs text-tx-muted flex-1">{label}</label>
      <input
        id={name}
        type="number"
        name={name}
        min={0}
        max={99}
        defaultValue={defaultValue ?? ''}
        className="w-16 px-2 py-1.5 rounded-lg border border-bd bg-surface text-sm text-tx text-center focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function BoolField({ name, label, defaultValue, yes, no }: {
  name: string;
  label: string;
  defaultValue?: boolean | null;
  yes: string;
  no: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-tx-muted flex-1">{label}</p>
      <div className="flex gap-1 shrink-0">
        {(['', 'true', 'false'] as const).map((v) => {
          const checked = v === '' ? defaultValue == null : String(defaultValue) === v;
          return (
            <label key={v} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={v}
                defaultChecked={checked}
                className="sr-only peer"
              />
              <span className="block px-2.5 py-1 rounded-lg border border-bd text-xs text-tx-muted peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary transition-colors select-none">
                {v === '' ? '—' : v === 'true' ? yes : no}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function QAForm({ defaultValues }: Props) {
  const t = useTranslations('qa');

  return (
    <div className="bg-surface-alt rounded-xl p-4 space-y-1">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-tx">{t('title')}</h3>
        <span className="text-xs text-tx-muted">({t('optional')})</span>
      </div>

      <div className="space-y-3">
        <IntField name="qa_infiltrators" label={t('labelInfiltrators')} defaultValue={defaultValues?.qa_infiltrators} />
        <IntField name="qa_deep_strike"  label={t('labelDeepStrike')}   defaultValue={defaultValues?.qa_deep_strike} />
        <IntField name="qa_scout"        label={t('labelScout')}        defaultValue={defaultValues?.qa_scout} />
        <IntField name="qa_lone_operative" label={t('labelLoneOperative')} defaultValue={defaultValues?.qa_lone_operative} />
        <IntField name="qa_fights_first"   label={t('labelFightsFirst')}   defaultValue={defaultValues?.qa_fights_first} />

        <div className="border-t border-bd pt-3 space-y-3">
          <BoolField name="qa_advance_charge"   label={t('labelAdvanceCharge')}   defaultValue={defaultValues?.qa_advance_charge}   yes={t('yes')} no={t('no')} />
          <BoolField name="qa_surge_move"       label={t('labelSurgeMove')}       defaultValue={defaultValues?.qa_surge_move}       yes={t('yes')} no={t('no')} />
          <BoolField name="qa_reactive_move"    label={t('labelReactiveMove')}    defaultValue={defaultValues?.qa_reactive_move}    yes={t('yes')} no={t('no')} />
          <BoolField name="qa_reserves"         label={t('labelReserves')}        defaultValue={defaultValues?.qa_reserves}         yes={t('yes')} no={t('no')} />
          <BoolField name="qa_feel_no_pain"     label={t('labelFeelNoPain')}      defaultValue={defaultValues?.qa_feel_no_pain}     yes={t('yes')} no={t('no')} />
          <BoolField name="qa_damage_reduction" label={t('labelDamageReduction')} defaultValue={defaultValues?.qa_damage_reduction} yes={t('yes')} no={t('no')} />
          <BoolField name="qa_oc_modifier"      label={t('labelOcModifier')}      defaultValue={defaultValues?.qa_oc_modifier}      yes={t('yes')} no={t('no')} />
          <BoolField name="qa_battleshock"      label={t('labelBattleshock')}     defaultValue={defaultValues?.qa_battleshock}      yes={t('yes')} no={t('no')} />
          <BoolField name="qa_fight_on_death"   label={t('labelFightOnDeath')}    defaultValue={defaultValues?.qa_fight_on_death}    yes={t('yes')} no={t('no')} />
        </div>
      </div>
    </div>
  );
}
