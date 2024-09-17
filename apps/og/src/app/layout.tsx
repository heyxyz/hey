import type { Metadata } from "next";
import type { ReactNode } from "react";

import defaultMetadata from "src/defaultMetadata";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
