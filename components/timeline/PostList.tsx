'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import PostCard from '@/components/post/PostCard';
import { loadMoreTimelinePosts } from '@/app/actions/timeline';
import type { TimelineFilters } from '@/app/actions/timeline';
import type { PostRow } from '@/lib/queries/posts';
import { useTranslations } from 'next-intl';

interface Props {
  initialPosts: PostRow[];
  initialHasMore: boolean;
  filters: TimelineFilters;
  locale: string;
  initialFavoritedPostIds?: string[];
  isLoggedIn?: boolean;
}

export default function PostList({
  initialPosts,
  initialHasMore,
  filters,
  locale,
  initialFavoritedPostIds = [],
  isLoggedIn = false,
}: Props) {
  const t = useTranslations('timeline');
  const [posts, setPosts] = useState<PostRow[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set(initialFavoritedPostIds));
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(initialPosts.length);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          startTransition(async () => {
            const { posts: more, hasMore: moreAvailable, favoritedPostIds: newFavIds } =
              await loadMoreTimelinePosts(filters, offsetRef.current);
            setPosts((prev) => [...prev, ...more]);
            setHasMore(moreAvailable);
            setFavoritedIds((prev) => {
              const next = new Set(prev);
              newFavIds.forEach((id) => next.add(id));
              return next;
            });
            offsetRef.current += more.length;
            loadingRef.current = false;
          });
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, filters]);

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          post={post as any}
          locale={locale}
          isFavorited={favoritedIds.has(post.id)}
          isLoggedIn={isLoggedIn}
        />
      ))}
      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {isPending && (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      ) : posts.length > 0 ? (
        <p className="text-center text-xs text-tx-muted py-6">{t('allLoaded')}</p>
      ) : null}
    </div>
  );
}
