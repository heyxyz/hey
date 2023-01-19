import type { CSSProperties, FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  classNameChild?: string;
  style?: CSSProperties;
}

export const GridLayout: FC<Props> = ({ children, className = '', classNameChild = '' }) => {
  return (
    <div className={`container mx-auto max-w-screen-xl flex-grow pt-8 pb-2 px-0 sm:px-5 ${className}`}>
      <div className={`grid grid-cols-12 lg:gap-8 ${classNameChild}`}>{children}</div>
    </div>
  );
};

export const GridItemFour: FC<Props> = ({ children, className = '' }) => {
  return <div className={`lg:col-span-4 md:col-span-12 col-span-12 ${className}`}>{children}</div>;
};

export const GridItemEight: FC<Props> = ({ children, className = '', style }) => {
  return (
    <div className={`lg:col-span-8 md:col-span-12 col-span-12 mb-5 ${className}`} style={style}>
      {children}
    </div>
  );
};
