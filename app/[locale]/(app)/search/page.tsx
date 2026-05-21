import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { searchPosts } from '@/lib/queries/posts';
import { getFactions } from '@/lib/queries/profiles';
import PostCard from '@/components/post/PostCard';
import SearchForm from '@/components/search/SearchForm';

interface Props {
  searchParams: Promise<{ q?: string; faction?: string; points?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, faction, points } = await searchParams;

  const [factions, results, t, locale] = await Promise.all([
    getFactions(),
    q ? searchPosts(q) : Promise.resolve([]),
    getTranslations('search'),
    getLocale(),
  ]);

  const filtered = results.filter((p) => {
    if (faction && (p.factions as { id: string } | null)?.id !== faction) return false;
    if (points && p.points !== parseInt(points)) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-tx mb-3">{t('title')}</h1>
        <Suspense fallback={null}>
          <SearchForm factions={factions} />
        </Suspense>
      </header>

      <div className="flex-1 px-3 py-3">
        {!q ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="mb-3 text-tx-light" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-sm text-tx-muted">{t('enterKeyword')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-semibold text-tx mb-1">{t('noResults', { q })}</p>
            <p className="text-sm text-tx-muted">{t('noResultsHint')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-tx-muted">{t('resultsCount', { count: filtered.length })}</p>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filtered.map((post) => <PostCard key={post.id} post={post as any} locale={locale} />)}
          </div>
        )}
      </div>
    </div>
  );
}
