'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const COLLAPSE_THRESHOLD = 25;

export default function RosterText({ text }: { text: string }) {
  const t = useTranslations('post');
  const lines = text.split('\n');
  const collapsible = lines.length > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(false);

  const displayText = collapsible && !expanded
    ? lines.slice(0, COLLAPSE_THRESHOLD).join('\n') + '\n…'
    : text;

  return (
    <div>
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
  );
}
