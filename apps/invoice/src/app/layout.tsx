import type { ReactNode } from "react";

import { heyFont } from "src/fonts";

import "../globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={heyFont.className} lang="en">
      <body>{children}</body>
    </html>
  );
}
