import type { FC, ReactNode } from 'react';

import React, { forwardRef } from 'react';

import cn from '../cn';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export const H1: FC<TypographyProps> = forwardRef<
  HTMLHeadingElement,
  TypographyProps
>(({ children, className = '' }, ref) => (
  <h1 className={cn('text-4xl font-bold', className)} ref={ref}>
    {children}
  </h1>
));

export const H2: FC<TypographyProps> = forwardRef<
  HTMLHeadingElement,
  TypographyProps
>(({ children, className = '' }, ref) => (
  <h2 className={cn('text-3xl font-bold', className)} ref={ref}>
    {children}
  </h2>
));

export const H3: FC<TypographyProps> = forwardRef<
  HTMLHeadingElement,
  TypographyProps
>(({ children, className = '' }, ref) => (
  <h3 className={cn('text-2xl font-bold', className)} ref={ref}>
    {children}
  </h3>
));

export const H4: FC<TypographyProps> = forwardRef<
  HTMLHeadingElement,
  TypographyProps
>(({ children, className = '' }, ref) => (
  <h4 className={cn('text-xl font-bold', className)} ref={ref}>
    {children}
  </h4>
));

export const H5: FC<TypographyProps> = forwardRef<
  HTMLHeadingElement,
  TypographyProps
>(({ children, className = '' }, ref) => (
  <h5 className={cn('text-lg font-bold', className)} ref={ref}>
    {children}
  </h5>
));

export const H6: FC<TypographyProps> = forwardRef<
  HTMLHeadingElement,
  TypographyProps
>(({ children, className = '' }, ref) => (
  <h6 className={cn('text-sm font-bold', className)} ref={ref}>
    {children}
  </h6>
));
