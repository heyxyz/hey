import type { FC, ReactNode } from 'react';

import React from 'react';

interface TypographyProps {
  children: ReactNode;
}

export const H1: FC<TypographyProps> = ({ children }) => (
  <h1 className="text-[48px] font-bold">{children}</h1>
);

export const H2: FC<TypographyProps> = ({ children }) => (
  <h2 className="text-[40px] font-bold">{children}</h2>
);

export const H3: FC<TypographyProps> = ({ children }) => (
  <h3 className="text-[32px] font-bold">{children}</h3>
);

export const H4: FC<TypographyProps> = ({ children }) => (
  <h4 className="text-[24px] font-bold">{children}</h4>
);

export const H5: FC<TypographyProps> = ({ children }) => (
  <h5 className="text-[16px] font-bold">{children}</h5>
);

export const H6: FC<TypographyProps> = ({ children }) => (
  <h6 className="text-[14px] font-bold">{children}</h6>
);

export const P: FC<TypographyProps> = ({ children }) => (
  <p className="text-[15px]">{children}</p>
);
