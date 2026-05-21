import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Roster Vox',
  description: 'Warhammer 40k Roster Sharing Community',
  manifest: '/manifest.json',
  icons: { icon: '/logo.svg', apple: '/logo.svg' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Roster Vox' },
};

export const viewport: Viewport = {
  themeColor: '#8b2fc9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${geist.variable} h-full`}>
      <body className="h-full antialiased">
        {children}
      </body>
    </html>
  );
}
