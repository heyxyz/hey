import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  classNameChild?: string;
}

export const GridLayout: FC<Props> = ({ children, className = '', classNameChild = '' }) => {
  return (
    <div className={`container mx-auto max-w-screen-xl flex-grow px-0 pt-8 pb-2 sm:px-5 ${className}`}>
      <div className={`grid grid-cols-12 lg:gap-8 ${classNameChild}`}>{children}</div>
    </div>
  );
};

export const GridItemFour: FC<Props> = ({ children, className = '' }) => {
  return <div className={`col-span-12 md:col-span-12 lg:col-span-4 ${className}`}>{children}</div>;
};

export const GridItemEight: FC<Props> = ({ children, className = '' }) => {
  return <div className={`col-span-12 mb-5 md:col-span-12 lg:col-span-8 ${className}`}>{children}</div>;
};
