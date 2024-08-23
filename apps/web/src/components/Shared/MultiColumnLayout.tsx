import type { FC, ReactNode } from 'react';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import Link from 'next/link';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

interface MultiColumnLayoutProps {
  center: ReactNode;
  right: ReactNode;
}

const MultiColumnLayout: FC<MultiColumnLayoutProps> = ({ center, right }) => {
  const { appIcon } = usePreferencesStore();

  return (
    <div className="mx-auto flex w-full max-w-[85rem] items-start gap-x-7 py-8">
      <aside className="sticky top-8 hidden w-8 shrink-0 flex-col items-center gap-y-8 lg:flex">
        <Link
          className="hidden rounded-full outline-offset-8 md:block"
          href="/"
        >
          <img
            alt="Logo"
            className="size-8"
            height={32}
            src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
            width={32}
          />
        </Link>
        <div>gm</div>
        <div>gm</div>
        <div>gm</div>
        <div>gm</div>
      </aside>
      <main className="flex-1">{center}</main>
      <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
        {right}
      </aside>
    </div>
  );
};

export default MultiColumnLayout;
