'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

interface TabBarProps {
  unreadCount?: number;
}

export default function TabBar({ unreadCount = 0 }: TabBarProps) {
  const t = useTranslations('tabs');
  const pathname = usePathname();

  const tabs = [
    { href: '/timeline' as const, labelKey: 'timeline' as const, icon: HomeIcon },
    { href: '/search' as const, labelKey: 'search' as const, icon: SearchIcon },
    { href: '/post/new' as const, labelKey: 'post' as const, icon: PlusIcon, featured: true },
    { href: '/notifications' as const, labelKey: 'notifications' as const, icon: BellIcon, showBadge: true },
    { href: '/profile' as const, labelKey: 'profile' as const, icon: PersonIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-bd z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ href, labelKey, icon: Icon, featured, showBadge }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
            >
              {featured ? (
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <Icon active={false} featured />
                </span>
              ) : (
                <>
                  <span className="relative">
                    <Icon active={active} />
                    {showBadge && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-tx-muted'}`}
                  >
                    {t(labelKey)}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

interface IconProps {
  active: boolean;
  featured?: boolean;
}

function HomeIcon({ active, featured }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#8b2fc9' : 'none'} stroke={featured ? '#fff' : active ? '#8b2fc9' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b2fc9' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PlusIcon({ featured }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={featured ? '#fff' : '#6B7280'} strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function BellIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#8b2fc9' : 'none'} stroke={active ? '#8b2fc9' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function PersonIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#8b2fc9' : 'none'} stroke={active ? '#8b2fc9' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
