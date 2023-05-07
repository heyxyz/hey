'use client';
import '../styles.css';

import Providers from '@components/Common/Providers';
import circluarStd from '@lib/lensterFont';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body className={circluarStd.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
