import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const JA = {
  title: '利用規約',
  back: '← ログインに戻る',
  effective: '制定日：2026年5月20日',
  sections: [
    {
      heading: '第1条（サービスについて）',
      body: 'Roster Vox はロスターを共有するコミュニティサービスです。',
    },
    {
      heading: '第2条（アカウント）',
      items: [
        '正確な情報でアカウントを登録してください。',
        'アカウントの安全管理はご自身の責任です。',
        '13歳未満の方はご利用いただけません。',
      ],
    },
    {
      heading: '第3条（禁止事項）',
      items: [
        '他のユーザーへの誹謗中傷・ハラスメント',
        '著作権を侵害するコンテンツの投稿',
        'スパム・商業宣伝',
        '不正アクセスや妨害行為',
      ],
    },
    {
      heading: '第4条（コンテンツ）',
      body: '投稿コンテンツの著作権はユーザーに帰属します。ただし本サービス上での表示・共有を許可するライセンスを付与するものとします。',
    },
    {
      heading: '第5条（免責事項）',
      body: '本サービスは現状のまま提供されます。サービスの中断・データの損失等について責任を負いません。',
    },
    {
      heading: '第6条（サービスの変更・終了）',
      body: '予告なくサービス内容の変更・終了を行う場合があります。',
    },
    {
      heading: '第7条（準拠法・管轄）',
      body: '本規約は日本法に準拠します。紛争が生じた場合はまず誠実な協議による解決を試みるものとします。協議が困難な場合、日本の裁判所を専属的合意管轄とします。ただし、お客様の居住国の強行規定が適用される場合はその規定が優先されます。',
    },
  ],
};

const EN = {
  title: 'Terms of Service',
  back: '← Back to Login',
  effective: 'Effective Date: May 20, 2026',
  sections: [
    {
      heading: 'Article 1 — About This Service',
      body: 'Roster Vox is a community service for sharing rosters.',
    },
    {
      heading: 'Article 2 — Accounts',
      items: [
        'Please register with accurate information.',
        'You are responsible for the security of your account.',
        'This service is not available to users under the age of 13.',
      ],
    },
    {
      heading: 'Article 3 — Prohibited Activities',
      items: [
        'Defamation, harassment, or abuse of other users',
        'Posting content that infringes on copyright',
        'Spam or commercial advertising',
        'Unauthorized access or interference with the service',
      ],
    },
    {
      heading: 'Article 4 — Content',
      body: 'You retain ownership of any content you post. By posting, you grant Roster Vox a license to display and share that content within the service.',
    },
    {
      heading: 'Article 5 — Disclaimer',
      body: 'This service is provided "as is." We are not liable for any service interruptions, data loss, or other damages arising from your use of the service.',
    },
    {
      heading: 'Article 6 — Changes and Termination',
      body: 'We may modify or discontinue the service at any time without prior notice.',
    },
    {
      heading: 'Article 7 — Governing Law and Dispute Resolution',
      body: 'These Terms are governed by the laws of Japan. In the event of a dispute, the parties shall first attempt to resolve it through good-faith negotiation. If resolution is not possible, the courts of Japan shall have exclusive jurisdiction. Mandatory consumer protection laws of your country of residence shall take precedence where applicable.',
    },
  ],
};

export default async function TermsPage() {
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
            {'items' in s && s.items ? (
              <ul className="space-y-1">
                {s.items.map((item) => (
                  <li key={item} className="text-sm text-tx-muted flex gap-2">
                    <span className="shrink-0">・</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-tx-muted leading-relaxed">{'body' in s ? s.body : ''}</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-tx-light">{c.effective}</p>
    </div>
  );
}
