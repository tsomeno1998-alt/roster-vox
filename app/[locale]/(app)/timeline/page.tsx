import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { getPosts } from '@/lib/queries/posts';
import { getFactions, getCurrentUser } from '@/lib/queries/profiles';
import PostCard from '@/components/post/PostCard';
import TimelineFilters from '@/components/timeline/TimelineFilters';

interface Props {
  searchParams: Promise<{ sort?: string; faction?: string; points?: string; group?: string; feed?: string; winRate?: string }>;
}

export default async function TimelinePage({ searchParams }: Props) {
  const { sort, faction, points, group, feed, winRate } = await searchParams;
  const followingOnly = feed === 'following';

  const [user, factions, t, locale] = await Promise.all([
    getCurrentUser(),
    getFactions(),
    getTranslations('timeline'),
    getLocale(),
  ]);

  const posts = await getPosts({
    sort: sort === 'popular' ? 'popular' : 'latest',
    factionId: faction,
    points: points ? parseInt(points) : undefined,
    userId: user?.id,
    followingOnly,
  });

  const filteredPosts = posts.filter((p) => {
    if (group && !faction && (p.factions as { group: string } | null)?.group !== group) return false;
    if (winRate) {
      const total = p.win + p.loss + p.draw;
      if (total === 0) return false;
      if (winRate !== 'recorded') {
        const rate = (p.win / total) * 100;
        if (rate < parseInt(winRate)) return false;
      }
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="w-7 h-7" />
          <span className="text-lg font-bold text-tx">Roster Vox</span>
        </div>
        <Suspense fallback={null}>
          <TimelineFilters factions={factions} isLoggedIn={!!user} />
        </Suspense>
      </header>

      <div className="flex-1 px-3 py-3 space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b2fc9" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="font-semibold text-tx mb-1">{followingOnly ? t('emptyFollowing') : t('empty')}</p>
            <p className="text-sm text-tx-muted">{followingOnly ? t('emptyFollowingHint') : t('emptyHint')}</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              post={post as any}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
}
