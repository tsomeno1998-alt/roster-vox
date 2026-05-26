'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const COLLAPSE_THRESHOLD = 25;

function extractUnits(text: string): string {
  const unitLines = text.split('\n').filter((line) => {
    if (line.trim() === '') return false;
    if (/^[\s\t]/.test(line)) return false;
    if (/^[・•◦]/.test(line)) return false;
    return true;
  });
  return unitLines.join('\n\n');
}

export default function RosterText({ text }: { text: string }) {
  const t = useTranslations('post');
  const [expanded, setExpanded] = useState(false);
  const [unitsOnly, setUnitsOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyRoster() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredText = unitsOnly ? extractUnits(text) : text;
  const lines = filteredText.split('\n');
  const collapsible = lines.length > COLLAPSE_THRESHOLD;

  const displayText = collapsible && !expanded
    ? lines.slice(0, COLLAPSE_THRESHOLD).join('\n') + '\n…'
    : filteredText;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-tx">{t('roster')}</h3>
          <button
            onClick={copyRoster}
            className="text-xs text-tx-muted hover:text-tx transition-colors"
          >
            {copied ? t('copyRosterDone') : t('copyRoster')}
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-xs text-tx-muted">{t('unitsOnly')}</span>
          <button
            role="switch"
            aria-checked={unitsOnly}
            onClick={() => { setUnitsOnly(!unitsOnly); setExpanded(false); }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              unitsOnly ? 'bg-primary' : 'bg-bd'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              unitsOnly ? 'translate-x-[18px]' : 'translate-x-[3px]'
            }`} />
          </button>
        </label>
      </div>
      <div className="bg-surface-alt rounded-xl p-4">
        <pre className="text-xs text-tx-muted font-mono whitespace-pre-wrap leading-relaxed">
          {displayText}
        </pre>
        {collapsible && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-primary font-medium hover:underline"
          >
            {expanded ? t('collapseRoster') : t('expandRoster', { lines: lines.length })}
          </button>
        )}
      </div>
    </div>
  );
}
