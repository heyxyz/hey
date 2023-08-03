import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  className?: string;
  classNameChild?: string;
  hideDivider?: boolean;
}

export const GridItemThree: FC<GridProps> = ({
  children,
  hideDivider = false,
  className = ''
}) => {
  return (
    <div
      className={clsx(
        { 'border-r': !hideDivider },
        'col-span-12 md:col-span-12 lg:col-span-3',
        className
      )}
    >
      {children}
    </div>
  );
};

export const GridItemSix: FC<GridProps> = ({
  children,
  hideDivider = false,
  className = ''
}) => {
  return (
    <div
      className={clsx(
        { 'border-r': !hideDivider },
        'col-span-12 md:col-span-12 lg:col-span-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export const GridLayout: FC<GridProps> = ({
  children,
  className = '',
  classNameChild = ''
}) => {
  return (
    <div className={clsx('container mx-auto max-w-screen-xl grow', className)}>
      <div className={clsx('grid grid-cols-12', classNameChild)}>
        <GridItemThree>
          <aside className="!sticky !top-8 overflow-y-auto">
            <div className="py-5">gm</div>
          </aside>
        </GridItemThree>
        {children}
      </div>
    </div>
  );
};
