'use server';
import { getPosts } from '@/lib/queries/posts';
import type { PostRow } from '@/lib/queries/posts';

export interface TimelineFilters {
  sort: 'latest' | 'popular';
  factionId?: string;
  points?: number;
  group?: string;
  userId?: string;
  followingOnly: boolean;
}

export async function loadMoreTimelinePosts(
  filters: TimelineFilters,
  offset: number
): Promise<{ posts: PostRow[]; hasMore: boolean }> {
  const posts = await getPosts({ ...filters, offset, limit: 20 });
  return { posts, hasMore: posts.length === 20 };
}
