import type { FC, ReactNode } from 'react';

interface MultiColumnLayoutProps {
  center: ReactNode;
  left: ReactNode;
  right: ReactNode;
}

const MultiColumnLayout: FC<MultiColumnLayoutProps> = ({
  center,
  left,
  right
}) => {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
      <aside className="sticky top-8 hidden w-44 shrink-0 lg:block">
        {left}
      </aside>
      <main className="flex-1">{center}</main>
      <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
        {right}
      </aside>
    </div>
  );
};

export default MultiColumnLayout;
