import { redirect } from '@/i18n/navigation';

export default async function LocaleRootPage() {
  await redirect('/timeline');
}
