import '../styles.css';

import PageHead from '@components/Common/Head';
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
        <PageHead />
      </head>
      <body className={heyFont.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
