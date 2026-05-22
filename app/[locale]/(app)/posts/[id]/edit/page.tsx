import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { redirect } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { getPost } from '@/lib/queries/posts';
import { getCurrentUser, getFactions, type FactionRow } from '@/lib/queries/profiles';
import { updatePost, deletePost } from '@/app/actions/posts';
import DeletePostButton from '@/components/post/DeletePostButton';
import PostFormFooter from '@/components/post/PostFormFooter';
import QAForm from '@/components/post/QAForm';
import { POINT_OPTIONS } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [post, user, factions, tp, tf] = await Promise.all([
    getPost(id),
    getCurrentUser(),
    getFactions(),
    getTranslations('post'),
    getTranslations('factions'),
  ]);

  if (!post) notFound();
  if (!user || user.id !== post.user_id) return await redirect('/timeline');

  const faction = post.factions as { id: string; group: string } | null;
  const imperium: FactionRow[] = factions.filter((f: FactionRow) => f.group === 'Imperium');
  const chaos: FactionRow[] = factions.filter((f: FactionRow) => f.group === 'Chaos');
  const xenos: FactionRow[] = factions.filter((f: FactionRow) => f.group === 'Xenos');

  const updatePostWithId = updatePost.bind(null, id);
  const deletePostWithId = deletePost.bind(null, id);

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
        <Link href={`/posts/${id}`} className="text-tx-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-tx">{tp('editTitle')}</h1>
      </header>

      <form action={updatePostWithId} className="flex-1 px-4 py-4 space-y-5">
        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('army')}</label>
          <select
            name="faction_id"
            defaultValue={faction?.id ?? ''}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:border-primary"
          >
            <optgroup label={tf('imperium')}>
              {imperium.map((f: FactionRow) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </optgroup>
            <optgroup label={tf('chaos')}>
              {chaos.map((f: FactionRow) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </optgroup>
            <optgroup label={tf('xenos')}>
              {xenos.map((f: FactionRow) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('points')}</label>
          <div className="flex gap-2 flex-wrap">
            {POINT_OPTIONS.map((pt) => (
              <label key={pt} className="cursor-pointer">
                <input type="radio" name="points" value={pt} defaultChecked={post.points === pt} className="sr-only peer" />
                <span className="block px-4 py-2 rounded-xl border border-bd text-sm text-tx-muted peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary transition-colors">
                  {pt}pt
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('titleLabel')}</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={post.title}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('photoLabel')}</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('roster')}</label>
          <textarea
            name="roster_text"
            rows={10}
            defaultValue={post.roster_text}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:border-primary resize-none font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('record')}</label>
          <div className="flex gap-3">
            {([
              ['win', tp('winLabel'), post.win],
              ['loss', tp('lossLabel'), post.loss],
              ['draw', tp('drawLabel'), post.draw],
            ] as const).map(([name, label, val]) => (
              <div key={name} className="flex-1">
                <label className="block text-xs text-tx-muted mb-1 text-center">{label}</label>
                <input
                  type="number"
                  name={name}
                  min={0}
                  defaultValue={val}
                  className="w-full px-2 py-2 rounded-xl border border-bd bg-surface text-sm text-tx text-center focus:outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>

        <QAForm defaultValues={post} />

        <PostFormFooter
          userId={user.id}
          initialPhotoUrl={post.photo_url}
          photoLabel={tp('photoPickerLabel')}
          photoHint={tp('photoPickerHint')}
          submitLabel={tp('save')}
          pendingLabel={tp('saving')}
        />
      </form>

      <div className="px-4 pb-8">
        <DeletePostButton action={deletePostWithId} />
      </div>
    </div>
  );
}
