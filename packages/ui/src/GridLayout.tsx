import type { FC, ReactNode } from 'react';

import cn from '../cn';

interface GridProps {
  children: ReactNode;
  className?: string;
  classNameChild?: string;
}

export const GridLayout: FC<GridProps> = ({
  children,
  className = '',
  classNameChild = ''
}) => {
  return (
    <div
      className={cn(
        'container mx-auto max-w-screen-xl grow px-0 pb-2 pt-8 sm:px-5',
        className
      )}
    >
      <div className={cn('grid grid-cols-12 lg:gap-8', classNameChild)}>
        {children}
      </div>
    </div>
  );
};

export const GridItemFour: FC<GridProps> = ({ children, className = '' }) => {
  return (
    <div className={cn('col-span-12 md:col-span-12 lg:col-span-4', className)}>
      {children}
    </div>
  );
};

export const GridItemEight: FC<GridProps> = ({ children, className = '' }) => {
  return (
    <div
      className={cn('col-span-12 mb-5 md:col-span-12 lg:col-span-8', className)}
    >
      {children}
    </div>
  );
};
