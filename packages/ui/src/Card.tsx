import clsx from 'clsx';
import type { ElementType, FC, MouseEvent, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  forceRounded?: boolean;
  dataTestId?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const Card: FC<CardProps> = ({
  children,
  as: Tag = 'div',
  className = '',
  forceRounded = false,
  dataTestId = '',
  onClick
}) => {
  return (
    <Tag
      className={clsx(
        forceRounded ? 'rounded-none' : 'rounded-none sm:rounded-[2px]',
        'border bg-white dark:border-gray-700 dark:bg-black',
        className
      )}
      data-testid={dataTestId}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
