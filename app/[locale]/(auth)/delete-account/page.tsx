import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const JA = {
  title: 'アカウントと関連データの削除',
  back: '← ログインに戻る',
  effective: '最終更新日：2026年6月4日',
  intro: 'Roster Vox のアカウントおよびすべての関連データを削除するには、以下の手順に従ってください。',
  sections: [
    {
      heading: 'アプリからの削除手順',
      steps: [
        'アプリを起動し、ログインしてください。',
        '画面下部のナビゲーションバーから「プロフィール」タブを開きます。',
        '画面を下にスクロールし、「アカウントを削除」ボタンをタップします。',
        '確認ダイアログが表示されるので「削除」を選択します。',
        'アカウントとすべての関連データが即座に削除されます。',
      ],
    },
    {
      heading: '削除されるデータ',
      items: [
        'アカウント情報（メールアドレス・表示名・プロフィール）',
        '投稿データ（ロスターテキスト・タイトル・コメント・写真）',
        '利用データ（いいね・お気に入り・フォロー関係・フィールドレポート）',
        'デバイストークン（プッシュ通知用）',
      ],
    },
    {
      heading: 'アプリにアクセスできない場合',
      body: 'アプリにアクセスできない場合は、お問い合わせページよりアカウント削除をリクエストしてください。件名に「アカウント削除希望」と記載の上、登録時のメールアドレスをお知らせください。リクエスト受領後、30日以内に対応いたします。',
    },
  ],
  contactLink: 'お問い合わせページへ',
};

const EN = {
  title: 'Account & Data Deletion',
  back: '← Back to Login',
  effective: 'Last updated: June 4, 2026',
  intro: 'To delete your Roster Vox account and all associated data, follow the steps below.',
  sections: [
    {
      heading: 'How to Delete Your Account',
      steps: [
        'Open the app and log in.',
        'Tap the "Profile" tab in the bottom navigation bar.',
        'Scroll down and tap "Delete Account".',
        'Confirm the deletion in the dialog that appears.',
        'Your account and all associated data will be permanently deleted immediately.',
      ],
    },
    {
      heading: 'Data That Will Be Deleted',
      items: [
        'Account information (email, display name, profile)',
        'Post data (roster text, titles, comments, photos)',
        'Activity data (likes, favorites, follows, field reports)',
        'Device tokens (used for push notifications)',
      ],
    },
    {
      heading: 'If You Cannot Access the App',
      body: 'If you are unable to access the app, you can request account deletion via the Contact page. Please include "Account Deletion Request" in the subject and provide the email address associated with your account. We will process your request within 30 days.',
    },
  ],
  contactLink: 'Go to Contact Page',
};

export default async function DeleteAccountPage() {
  const locale = await getLocale();
  const c = locale === 'ja' ? JA : EN;

  return (
    <div className="min-h-screen bg-surface px-4 py-10 max-w-lg mx-auto">
      <Link href="/login" className="text-sm text-tx-muted hover:text-primary mb-6 inline-block">
        {c.back}
      </Link>
      <h1 className="text-xl font-bold text-tx mb-4">{c.title}</h1>
      <p className="text-sm text-tx-muted leading-relaxed mb-8">{c.intro}</p>

      <div className="space-y-8">
        {c.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-sm font-semibold text-tx mb-3">{s.heading}</h2>
            {'steps' in s && s.steps && (
              <ol className="space-y-2">
                {s.steps.map((step, i) => (
                  <li key={i} className="text-sm text-tx-muted flex gap-3">
                    <span className="shrink-0 font-semibold text-primary">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
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
            {'body' in s && s.body && (
              <p className="text-sm text-tx-muted leading-relaxed">{s.body}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-border">
        <Link href="/contact" className="text-sm text-primary hover:underline">
          {c.contactLink} →
        </Link>
      </div>

      <p className="mt-6 text-xs text-tx-light">{c.effective}</p>
    </div>
  );
}
