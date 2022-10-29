import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const GridLayout: FC<Props> = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto max-w-screen-xl flex-grow py-8 px-0 sm:px-5 ${className}`}>
      <div className="grid grid-cols-12 lg:gap-8">{children}</div>
    </div>
  );
};

export const GridItemFour: FC<Props> = ({ children, className = '' }) => {
  return <div className={`lg:col-span-4 md:col-span-12 col-span-12 ${className}`}>{children}</div>;
};

export const GridItemEight: FC<Props> = ({ children, className = '' }) => {
  return <div className={`lg:col-span-8 md:col-span-12 col-span-12 mb-5 ${className}`}>{children}</div>;
};
