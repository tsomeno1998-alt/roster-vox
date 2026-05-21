import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const SECTIONS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

const ICONS: Record<typeof SECTIONS[number], string> = {
  s1: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  s2: 'M4 6h16M4 12h16M4 18h7',
  s3: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
  s4: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  s5: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  s6: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 0l-3 3-1.5-1.5',
};

export default async function GuidePage() {
  const t = await getTranslations('guide');
  const tp = await getTranslations('profile');

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/profile" className="text-tx-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-tx">{t('title')}</h1>
      </header>

      <div className="px-4 py-6 space-y-4 pb-24">
        {SECTIONS.map((key, i) => (
          <div key={key} className="bg-surface rounded-2xl border border-bd p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b2fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS[key]} />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                  <h2 className="font-semibold text-tx text-sm">{t(`${key}Title`)}</h2>
                </div>
                <p className="text-sm text-tx-muted leading-relaxed">{t(`${key}Body`)}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2 text-center">
          <Link href="/contact" className="text-sm text-primary hover:underline">
            {tp('contact')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
