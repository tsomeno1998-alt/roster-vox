import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const JA = {
  title: 'プライバシーポリシー',
  back: '← ログインに戻る',
  effective: '最終更新日：2026年5月29日',
  sections: [
    {
      heading: '1. 収集する情報',
      items: [
        'アカウント情報：メールアドレス、表示名（Google / Discord / Apple ログインの場合はプロフィール情報）',
        '投稿データ：ロスターテキスト、タイトル、コメント、写真',
        '利用データ：いいね、お気に入り登録、フォロー関係、通報履歴',
        'デバイス情報：プッシュ通知の配信に使用するデバイストークン',
      ],
    },
    {
      heading: '2. 利用目的',
      body: '収集した情報はサービスの提供・改善のみに使用します。第三者への販売・提供は行いません。',
    },
    {
      heading: '3. 使用している外部サービス',
      items: [
        'Supabase（データベース・認証）',
        'Vercel（ホスティング）',
        'Google / Discord / Apple（OAuth ログイン）',
        'Expo（プッシュ通知の配信）',
      ],
    },
    {
      heading: '4. データの保管',
      body: 'データは Supabase のサーバーに保管されます。',
    },
    {
      heading: '5. EUユーザーの権利（GDPR）',
      body: 'EU在住のユーザーは以下の権利を有します。これらの権利を行使する場合はお問い合わせページよりご連絡ください。',
      items: [
        'アクセス権：保有する個人データの開示を請求できます。',
        '削除権：個人データの削除を請求できます。',
        '訂正権：不正確なデータの訂正を請求できます。',
        'ポータビリティ権：個人データを機械可読形式で受け取ることができます。',
      ],
    },
    {
      heading: '6. データの削除',
      body: 'アカウント削除により、投稿・コメント・いいね・お気に入りを含むすべてのデータが完全に削除されます。',
    },
    {
      heading: '7. お問い合わせ',
      body: 'プライバシーに関するご質問はお問い合わせページよりご連絡ください。',
    },
  ],
};

const EN = {
  title: 'Privacy Policy',
  back: '← Back to Login',
  effective: 'Last updated: May 29, 2026',
  sections: [
    {
      heading: '1. Information We Collect',
      items: [
        'Account information: email address and display name (or profile data from Google / Discord / Apple OAuth)',
        'Post data: roster text, titles, comments, and photos',
        'Activity data: likes, favorites, follows, and content reports',
        'Device information: push notification tokens used to deliver notifications to your device',
      ],
    },
    {
      heading: '2. How We Use Your Information',
      body: 'Your information is used solely to provide and improve the service. We do not sell or share your data with third parties.',
    },
    {
      heading: '3. Third-Party Services',
      items: [
        'Supabase (database and authentication)',
        'Vercel (hosting)',
        'Google / Discord / Apple (OAuth login)',
        'Expo (push notification delivery)',
      ],
    },
    {
      heading: '4. Data Storage',
      body: 'Your data is stored on Supabase servers.',
    },
    {
      heading: '5. Your Rights (GDPR)',
      body: 'If you are located in the European Union, you have the following rights. To exercise any of these rights, please contact us via the Contact page.',
      items: [
        'Right of Access: Request a copy of the personal data we hold about you.',
        'Right to Erasure: Request deletion of your personal data.',
        'Right to Rectification: Request correction of inaccurate data.',
        'Right to Data Portability: Receive your data in a machine-readable format.',
      ],
    },
    {
      heading: '6. Account Deletion',
      body: 'When you delete your account, all associated data — including posts, comments, likes, and favorites — is permanently removed.',
    },
    {
      heading: '7. Contact',
      body: 'For privacy-related questions, please reach out via the Contact page.',
    },
  ],
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const c = locale === 'ja' ? JA : EN;

  return (
    <div className="min-h-screen bg-surface px-4 py-10 max-w-lg mx-auto">
      <Link href="/login" className="text-sm text-tx-muted hover:text-primary mb-6 inline-block">
        {c.back}
      </Link>
      <h1 className="text-xl font-bold text-tx mb-6">{c.title}</h1>

      <div className="space-y-6">
        {c.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-sm font-semibold text-tx mb-2">{s.heading}</h2>
            {'body' in s && s.body && (
              <p className="text-sm text-tx-muted leading-relaxed mb-2">{s.body}</p>
            )}
            {'items' in s && s.items && (
              <ul className="space-y-1">
                {s.items.map((item) => (
                  <li key={item} className="text-sm text-tx-muted flex gap-2">
                    <span className="shrink-0">・</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-tx-light">{c.effective}</p>
    </div>
  );
}
