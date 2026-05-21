import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { redirect } from '@/i18n/navigation';
import { getFactions, getCurrentUser } from '@/lib/queries/profiles';
import { createPost } from '@/app/actions/posts';
import SubmitButton from '@/components/ui/SubmitButton';
import PhotoPicker from '@/components/ui/PhotoPicker';
import { POINT_OPTIONS } from '@/lib/types';

export default async function NewPostPage() {
  const [user, factions, tp, tf] = await Promise.all([
    getCurrentUser(),
    getFactions(),
    getTranslations('post'),
    getTranslations('factions'),
  ]);

  if (!user) return await redirect('/login');

  const imperium = factions.filter((f) => f.group === 'Imperium');
  const chaos = factions.filter((f) => f.group === 'Chaos');
  const xenos = factions.filter((f) => f.group === 'Xenos');

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/timeline" className="text-tx-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-tx">{tp('newTitle')}</h1>
      </header>

      <form action={createPost} className="flex-1 px-4 py-4 space-y-5">
        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">
            {tp('army')} <span className="text-red-500">*</span>
          </label>
          <select
            name="faction_id"
            required
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:border-primary"
          >
            <option value="">{tp('armyPlaceholder')}</option>
            <optgroup label={tf('imperium')}>
              {imperium.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </optgroup>
            <optgroup label={tf('chaos')}>
              {chaos.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </optgroup>
            <optgroup label={tf('xenos')}>
              {xenos.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">
            {tp('points')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {POINT_OPTIONS.map((pt) => (
              <label key={pt} className="cursor-pointer">
                <input type="radio" name="points" value={pt} required className="sr-only peer" />
                <span className="block px-4 py-2 rounded-xl border border-bd text-sm text-tx-muted peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary transition-colors">
                  {pt}pt
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">
            {tp('titleLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder={tp('titlePlaceholder')}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('concept')}</label>
          <textarea
            name="concept"
            rows={4}
            placeholder={tp('conceptPlaceholder')}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{tp('photoLabel')}</label>
          <PhotoPicker userId={user.id} label={tp('photoPickerLabel')} hint={tp('photoPickerHint')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">
            {tp('roster')} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="roster_text"
            rows={10}
            required
            placeholder={tp('rosterPlaceholder')}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary resize-none font-mono text-xs"
          />
        </div>

        <div className="pb-6">
          <SubmitButton fullWidth size="lg" pendingLabel={tp('posting')}>{tp('submit')}</SubmitButton>
        </div>
      </form>
    </div>
  );
}
