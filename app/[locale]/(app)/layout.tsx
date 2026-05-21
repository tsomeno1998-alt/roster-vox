import TabBar from '@/components/layout/TabBar';
import { getCurrentUser } from '@/lib/queries/profiles';
import { createClient } from '@/lib/supabase/server';

async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (supabase as any)
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);
  return (count as number) ?? 0;
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const unreadCount = user ? await getUnreadCount(user.id) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-surface-alt">
      <main className="flex-1 pb-16 max-w-lg mx-auto w-full">
        {children}
      </main>
      <TabBar unreadCount={unreadCount} />
    </div>
  );
}
