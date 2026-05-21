import { Link } from '@/i18n/navigation';
import Avatar from '@/components/ui/Avatar';
import FactionBadge from '@/components/post/FactionBadge';
import { timeAgo } from '@/lib/timeAgo';
import type { Post } from '@/lib/types';

interface PostCardProps {
  post: Post & {
    profiles: NonNullable<Post['profiles']>;
    factions: NonNullable<Post['factions']>;
  };
  locale: string;
}

export default function PostCard({ post, locale }: PostCardProps) {
  const { profiles: author, factions: faction } = post;
  const record = locale === 'ja'
    ? `${post.win}勝 ${post.loss}敗 ${post.draw}分`
    : `${post.win}W ${post.loss}L ${post.draw}D`;

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="bg-surface rounded-2xl shadow-sm border border-bd p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Avatar src={author.avatar_url} username={author.display_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-tx truncate">{author.display_name}</p>
            <p className="text-xs text-tx-light">@{author.username}</p>
          </div>
          <FactionBadge name={faction.name} group={faction.group} />
          <span className="text-xs text-tx-light whitespace-nowrap">
            {timeAgo(post.created_at, locale)}
          </span>
        </div>

        <h3 className="font-semibold text-tx mb-1 line-clamp-1">{post.title}</h3>
        {post.concept && (
          <p className="text-sm text-tx-muted line-clamp-2 mb-3">{post.concept}</p>
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">
            {post.points}pt
          </span>
          {(post.win > 0 || post.loss > 0 || post.draw > 0) && (
            <span className="text-xs text-tx-muted">{record}</span>
          )}
          <div className="ml-auto flex items-center gap-3 text-xs text-tx-muted">
            <span className="flex items-center gap-1">
              <HeartIcon />
              {post.likes_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <ChatIcon />
              {post.comments_count ?? 0}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
