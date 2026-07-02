import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Armory',
  description: 'AI customization made easy',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
