import { getTranslations, getLocale } from 'next-intl/server';
import { version } from '@/package.json';
import { redirect } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { getCurrentUser, getCurrentProfile, getProfileStats } from '@/lib/queries/profiles';
import { getUserPosts } from '@/lib/queries/posts';
import { signOut, deleteAccount } from '@/app/actions/auth';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import PostCard from '@/components/post/PostCard';
import LogoutButton from '@/components/profile/LogoutButton';
import DeleteAccountButton from '@/components/profile/DeleteAccountButton';

export default async function ProfilePage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);
  if (!user || !profile) return await redirect('/login');

  const [stats, posts, t, locale] = await Promise.all([
    getProfileStats(user.id),
    getUserPosts(user.id),
    getTranslations('profile'),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-lg font-bold text-tx">{t('title')}</h1>
        <LogoutButton action={signOut} />
      </header>

      <div className="px-4 py-6">
        <div className="flex items-start gap-4 mb-5">
          <Avatar src={profile.avatar_url} username={profile.display_name} size="lg" />
          <div className="flex-1">
            <h2 className="font-bold text-tx text-xl">{profile.display_name}</h2>
            <p className="text-sm text-tx-muted">@{profile.username}</p>
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

        <Link href="/profile/edit">
          <Button variant="secondary" fullWidth size="md">{t('editProfile')}</Button>
        </Link>

        <nav className="mt-4 rounded-2xl border border-bd overflow-hidden">
          {([
            { href: '/guide', label: t('guide'), icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
            { href: '/contact', label: t('contact'), icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z' },
          ] as const).map(({ href, label, icon }, i) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3.5 bg-surface active:bg-surface-alt transition-colors ${i > 0 ? 'border-t border-bd' : ''}`}
            >
              <span className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b2fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </span>
              <span className="flex-1 text-sm font-medium text-tx">{label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tx-muted">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-tx">{t('myRosters')}</h3>
          {posts.length === 0 ? (
            <p className="text-sm text-tx-muted text-center py-12">{t('noPosts')}</p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            posts.map((post) => <PostCard key={post.id} post={post as any} locale={locale} />)
          )}
        </div>

        <div className="mt-8 mb-2 flex flex-col items-center gap-3">
          <DeleteAccountButton action={deleteAccount} />
          <p className="text-xs text-tx-light">v{version}</p>
        </div>
      </div>
    </div>
  );
}
