import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getPost, getComments, getUsedReports } from '@/lib/queries/posts';
import { getCurrentUser, getFactions, isFollowing } from '@/lib/queries/profiles';
import { updateRecord } from '@/app/actions/posts';
import { createClient } from '@/lib/supabase/server';
import Avatar from '@/components/ui/Avatar';
import FactionBadge from '@/components/post/FactionBadge';
import LikeButton from '@/components/post/LikeButton';
import FollowButton from '@/components/profile/FollowButton';
import RecordEditModal from '@/components/post/RecordEditModal';
import CommentForm from '@/components/post/CommentForm';
import UsedReportForm from '@/components/post/UsedReportForm';
import RosterText from '@/components/post/RosterText';
import { timeAgo } from '@/lib/timeAgo';
import type { FactionGroup } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

async function getLikeAndProfile(postId: string, userId: string) {
  const supabase = await createClient();
  const [likeRes, profileRes] = await Promise.all([
    supabase.from('likes').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('profiles').select('avatar_url, username').eq('id', userId).single(),
  ]);
  return {
    isLiked: !!likeRes.data,
    currentProfile: profileRes.data as { avatar_url: string | null; username: string } | null,
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [post, comments, usedReports, factions, t, tResult, locale, userExtras] = await Promise.all([
    getPost(id),
    getComments(id),
    getUsedReports(id),
    getFactions(),
    getTranslations('post'),
    getTranslations('result'),
    getLocale(),
    user ? getLikeAndProfile(id, user.id) : Promise.resolve({ isLiked: false, currentProfile: null }),
  ]);

  if (!post) notFound();

  const { isLiked, currentProfile } = userExtras;
  const isOwner = user?.id === post.user_id;
  const profile = post.profiles as { id: string; username: string; display_name: string; avatar_url: string | null };
  const faction = post.factions as { id: string; name: string; group: string };

  const initialFollowing = !isOwner && user
    ? await isFollowing(user.id, profile.id)
    : false;

  const total = post.win + post.loss + post.draw;
  const winRate = total > 0 ? Math.round((post.win / total) * 100) : null;
  const updateRecordWithId = updateRecord.bind(null, id);

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/timeline" className="text-tx-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-tx flex-1">{t('detailTitle')}</h1>
        {isOwner && (
          <Link href={`/posts/${id}/edit`} className="text-xs text-primary font-medium">{t('editLink')}</Link>
        )}
      </header>

      <div className="px-4 py-4 space-y-5">
        <div className="flex items-center gap-3">
          <Avatar src={profile.avatar_url} username={profile.display_name} size="md" />
          <div className="flex-1">
            <Link href={`/profile/${profile.username}`}>
              <p className="font-semibold text-tx hover:text-primary transition-colors">{profile.display_name}</p>
            </Link>
            <p className="text-xs text-tx-muted">{timeAgo(post.created_at, locale)}</p>
          </div>
          <FactionBadge name={faction.name} group={faction.group as FactionGroup} />
        </div>
        {!isOwner && user && (
          <FollowButton targetUserId={profile.id} initialFollowing={initialFollowing} />
        )}

        <div>
          <h2 className="text-xl font-bold text-tx mb-2">{post.title}</h2>
          {post.concept && (
            <p className="text-sm text-tx-muted leading-relaxed">{post.concept}</p>
          )}
        </div>

        {post.photo_url && (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-surface-alt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.photo_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-primary bg-primary-light px-3 py-1 rounded-full">
            {post.points}pt
          </span>
        </div>

        <div className="bg-surface-alt rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-tx">{t('recordTitle')}</h3>
            {isOwner && (
              <RecordEditModal win={post.win} loss={post.loss} draw={post.draw} action={updateRecordWithId} />
            )}
          </div>
          {total > 0 ? (
            <div className="flex items-baseline gap-3">
              <p className="text-base font-bold text-tx">
                {t('recordStats', { total, win: post.win, loss: post.loss, draw: post.draw })}
              </p>
              <p className="text-sm font-medium text-primary">{t('recordWinRate', { rate: winRate ?? 0 })}</p>
            </div>
          ) : (
            <p className="text-sm text-tx-muted">{t('recordNone')}</p>
          )}
        </div>

        <div className="flex gap-3 py-3 border-y border-bd">
          <LikeButton postId={id} initialCount={post.likes_count ?? 0} initialLiked={isLiked} />
          <button className="flex-1 flex flex-col items-center gap-1 text-xs text-tx-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{t('commentCount', { count: comments.length })}</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1 text-xs text-tx-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{t('usedCount', { count: usedReports.length })}</span>
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-tx mb-2">{t('roster')}</h3>
          <div className="bg-surface-alt rounded-xl p-4">
            <RosterText text={post.roster_text} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-tx mb-3">{t('comments')} ({comments.length})</h3>
          {currentProfile && (
            <div className="mb-4">
              <CommentForm postId={id} avatarUrl={currentProfile.avatar_url} username={currentProfile.username} />
            </div>
          )}
          {comments.length === 0 ? (
            <p className="text-sm text-tx-muted text-center py-6">{t('noComments')}</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => {
                const cp = c.profiles as { username: string; display_name: string; avatar_url: string | null } | null;
                return (
                  <div key={c.id} className="flex gap-3">
                    <Avatar src={cp?.avatar_url} username={cp?.display_name} size="sm" />
                    <div className="flex-1 bg-surface-alt rounded-xl p-3">
                      <p className="text-xs font-semibold text-tx mb-1">{cp?.display_name}</p>
                      <p className="text-sm text-tx">{c.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pb-6">
          <h3 className="font-semibold text-tx mb-3">{t('usedReports')} ({usedReports.length})</h3>
          {usedReports.length > 0 && (
            <div className="space-y-3 mb-4">
              {usedReports.map((r) => {
                const rp = r.profiles as { username: string; display_name: string; avatar_url: string | null } | null;
                const rf = r.factions as { name: string } | null;
                const resultLabel =
                  r.result === 'win' ? tResult('win') :
                  r.result === 'loss' ? tResult('loss') :
                  r.result === 'draw' ? tResult('draw') : null;
                return (
                  <div key={r.id} className="bg-surface-alt rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar src={rp?.avatar_url} username={rp?.display_name} size="xs" />
                      <span className="text-xs font-semibold text-tx">{rp?.display_name}</span>
                      {resultLabel && <span className="ml-auto text-xs">{resultLabel}</span>}
                    </div>
                    {rf && <p className="text-xs text-tx-muted mb-1">vs {rf.name}</p>}
                    {r.body && <p className="text-sm text-tx">{r.body}</p>}
                  </div>
                );
              })}
            </div>
          )}
          {currentProfile && <UsedReportForm postId={id} factions={factions} />}
        </div>
      </div>
    </div>
  );
}
