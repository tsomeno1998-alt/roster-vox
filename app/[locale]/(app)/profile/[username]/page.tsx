import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getCurrentUser, getProfileByUsername, getProfileStats, isFollowing } from '@/lib/queries/profiles';
import { getUserPosts } from '@/lib/queries/posts';
import Avatar from '@/components/ui/Avatar';
import PostCard from '@/components/post/PostCard';
import FollowButton from '@/components/profile/FollowButton';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const [profile, currentUser, t] = await Promise.all([
    getProfileByUsername(username),
    getCurrentUser(),
    getTranslations('profile'),
  ]);

  if (!profile) notFound();

  const isOwnProfile = currentUser?.id === profile.id;

  const [stats, posts, following, locale] = await Promise.all([
    getProfileStats(profile.id),
    getUserPosts(profile.id),
    currentUser && !isOwnProfile
      ? isFollowing(currentUser.id, profile.id)
      : Promise.resolve(false),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/timeline" className="text-tx-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-tx">{profile.display_name}</h1>
      </header>

      <div className="px-4 py-6">
        <div className="flex items-start gap-4 mb-5">
          <Avatar src={profile.avatar_url} username={profile.display_name} size="lg" />
          <div className="flex-1">
            <h2 className="font-bold text-tx text-xl">{profile.display_name}</h2>
            {isOwnProfile && <p className="text-sm text-tx-muted">@{profile.username}</p>}
            {profile.bio && <p className="text-sm text-tx mt-2 leading-relaxed">{profile.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { labelKey: 'posts' as const, value: stats.postCount },
            { labelKey: 'followers' as const, value: stats.followerCount },
            { labelKey: 'following' as const, value: stats.followingCount },
          ].map(({ labelKey, value }) => (
            <div key={labelKey} className="bg-surface rounded-2xl border border-bd p-3 text-center">
              <p className="text-xl font-bold text-tx">{value}</p>
              <p className="text-xs text-tx-muted mt-0.5">{t(labelKey)}</p>
            </div>
          ))}
        </div>

        {!isOwnProfile && currentUser && (
          <FollowButton targetUserId={profile.id} initialFollowing={following} />
        )}

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-tx">{t('theirRosters')}</h3>
          {posts.length === 0 ? (
            <p className="text-sm text-tx-muted text-center py-12">{t('noPosts')}</p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            posts.map((post) => <PostCard key={post.id} post={post as any} locale={locale} />)
          )}
        </div>
      </div>
    </div>
  );
}
