import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { getPosts } from '@/lib/queries/posts';
import { getFactions, getCurrentUser } from '@/lib/queries/profiles';
import TimelineFilters from '@/components/timeline/TimelineFilters';
import PostList from '@/components/timeline/PostList';
import type { TimelineFilters as TFilters } from '@/app/actions/timeline';

const LIMIT = 20;

interface Props {
  searchParams: Promise<{ sort?: string; faction?: string; points?: string; group?: string; feed?: string }>;
}

export default async function TimelinePage({ searchParams }: Props) {
  const { sort, faction, points, group, feed } = await searchParams;
  const followingOnly = feed === 'following';

  const [user, factions, t, locale] = await Promise.all([
    getCurrentUser(),
    getFactions(),
    getTranslations('timeline'),
    getLocale(),
  ]);

  const filters: TFilters = {
    sort: sort === 'popular' ? 'popular' : 'latest',
    factionId: faction,
    points: points ? parseInt(points) : undefined,
    group,
    userId: user?.id,
    followingOnly,
  };

  const posts = await getPosts({ ...filters, limit: LIMIT, offset: 0 });
  const hasMore = posts.length === LIMIT;
  const listKey = [sort, faction, points, group, feed].join('-');

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

      <div className="flex-1 px-3 py-3">
        {posts.length === 0 ? (
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
          <PostList
            key={listKey}
            initialPosts={posts}
            initialHasMore={hasMore}
            filters={filters}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}
