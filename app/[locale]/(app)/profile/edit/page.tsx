import { getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { getCurrentUser, getCurrentProfile } from '@/lib/queries/profiles';
import { updateProfile } from '@/app/actions/profile';
import SubmitButton from '@/components/ui/SubmitButton';
import AvatarUpload from '@/components/profile/AvatarUpload';

export default async function EditProfilePage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);
  if (!user || !profile) return await redirect('/login');
  const t = await getTranslations('profile');

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/profile" className="text-tx-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-tx">{t('editTitle')}</h1>
      </header>

      <div className="px-4 pt-6">
        <AvatarUpload userId={user.id} initialUrl={profile.avatar_url} displayName={profile.display_name} />
      </div>

      <form action={updateProfile} className="px-4 py-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">
            {t('username')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted text-sm">@</span>
            <input
              type="text"
              name="username"
              required
              defaultValue={profile.username}
              className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-tx-muted mt-1">{t('usernameHint')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">
            {t('displayName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="display_name"
            required
            defaultValue={profile.display_name}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-tx mb-1.5">{t('bio')}</label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile.bio ?? ''}
            placeholder={t('bioPlaceholder')}
            className="w-full px-3 py-2.5 rounded-xl border border-bd bg-surface text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <SubmitButton fullWidth size="lg" pendingLabel={t('saving')}>{t('save')}</SubmitButton>
      </form>
    </div>
  );
}
