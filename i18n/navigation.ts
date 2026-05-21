import { createNavigation } from 'next-intl/navigation';
import { getLocale } from 'next-intl/server';
import type { RedirectType } from 'next/dist/client/components/redirect-error';
import { routing } from './routing';

const nav = createNavigation(routing);

export const { Link, usePathname, useRouter } = nav;

export async function redirect(href: string, type?: RedirectType): Promise<never> {
  const locale = await getLocale();
  return nav.redirect({ href, locale }, type);
}
