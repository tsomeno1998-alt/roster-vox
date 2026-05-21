import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { getCurrentUser, getNotifications, type NotificationWithActor } from '@/lib/queries/profiles';
import { createClient } from '@/lib/supabase/server';
import Avatar from '@/components/ui/Avatar';
import { timeAgo } from '@/lib/timeAgo';

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return await redirect('/login');

  const [notifications, t, locale] = await Promise.all([
    getNotifications(user.id),
    getTranslations('notifications'),
    getLocale(),
  ]);

  if ((notifications as NotificationWithActor[]).some((n) => !n.read)) {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
  }

  const typeKey = {
    like: 'liked',
    comment: 'commented',
    follow: 'followed',
  } as const;

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-tx">{t('title')}</h1>
      </header>

      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b2fc9" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <p className="font-semibold text-tx mb-1">{t('empty')}</p>
          <p className="text-sm text-tx-muted">{t('emptyHint')}</p>
        </div>
      ) : (
        <div className="divide-y divide-bd">
          {(notifications as NotificationWithActor[]).map((n) => {
            const actor = n.actor;
            const href = n.post_id
              ? `/posts/${n.post_id}` as const
              : actor
              ? `/profile/${actor.username}` as const
              : null;
            const label = t(typeKey[n.type as keyof typeof typeKey] ?? 'liked');
            const inner = (
              <>
                <Avatar src={actor?.avatar_url} username={actor?.display_name} size="sm" />
                <p className="flex-1 text-sm text-tx">
                  <span className="font-semibold">{actor?.display_name}</span>
                  {label}
                </p>
                <span className="text-xs text-tx-light whitespace-nowrap">{timeAgo(n.created_at, locale)}</span>
              </>
            );
            const cls = `flex items-center gap-3 px-4 py-3 active:bg-surface-alt transition-colors ${!n.read ? 'bg-primary-light/30' : ''}`;
            return href ? (
              <Link key={n.id} href={href} className={cls}>{inner}</Link>
            ) : (
              <div key={n.id} className={cls}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
