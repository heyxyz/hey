import clsx from 'clsx';
import { ElementType, FC, MouseEvent, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  forceRounded?: boolean;
  fwdRef?: any;
  // eslint-disable-next-line no-unused-vars
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const Card: FC<CardProps> = ({
  children,
  as: Tag = 'div',
  className = '',
  forceRounded = false,
  fwdRef = null,
  onClick
}) => {
  return (
    <Tag
      className={clsx(
        forceRounded ? 'rounded-xl' : 'rounded-none sm:rounded-xl',
        'border dark:border-gray-700/80 bg-white dark:bg-gray-900',
        className
      )}
      ref={fwdRef}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

interface CardBodyProps {
  children?: ReactNode;
  className?: string;
}
export const CardBody: FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};
