import '../styles.css';

import Providers from '@components/Common/Providers';
import heyFont from '@lib/heyFont';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Prefetch and Preconnect */}
        <link
          rel="preconnect"
          href="https://pub-9f260f61e62242be9fdb651e940c9138.r2.dev"
        />
        <link
          rel="dns-prefetch"
          href="https://pub-9f260f61e62242be9fdb651e940c9138.r2.dev"
        />

        {/* Misc */}
        <meta name="application-name" content="Hey" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hey" />

        {/* Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* PWA config */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hey" />
        <link rel="icon" href="/images/icons/iconmain-512x512.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={heyFont.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
