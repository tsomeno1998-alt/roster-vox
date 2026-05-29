'use server';
import { getPosts, getUserFavoritedPostIds } from '@/lib/queries/posts';
import type { PostRow } from '@/lib/queries/posts';

export interface TimelineFilters {
  sort: 'latest' | 'popular';
  factionId?: string;
  points?: number;
  group?: string;
  userId?: string;
  followingOnly: boolean;
  favoritesOnly?: boolean;
}

export async function loadMoreTimelinePosts(
  filters: TimelineFilters,
  offset: number
): Promise<{ posts: PostRow[]; hasMore: boolean; favoritedPostIds: string[] }> {
  const posts = await getPosts({ ...filters, offset, limit: 20 });
  let favoritedPostIds: string[] = [];
  if (filters.userId && posts.length > 0) {
    const set = await getUserFavoritedPostIds(filters.userId, posts.map((p) => p.id));
    favoritedPostIds = [...set];
  }
  return { posts, hasMore: posts.length === 20, favoritedPostIds };
}
