import { redirect } from 'next/navigation';

// ミドルウェアが /{locale}/ にリダイレクトするため、このページは通常レンダリングされない
export default function RootPage() {
  redirect('/en/timeline');
}
