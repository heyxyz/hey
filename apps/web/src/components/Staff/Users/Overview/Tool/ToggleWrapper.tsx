import type { FC, ReactNode } from 'react';

interface ToggleWrapperProps {
  children: ReactNode;
  title: ReactNode;
}

const ToggleWrapper: FC<ToggleWrapperProps> = ({ children, title }) => (
  <span className="flex items-center space-x-2 text-sm">
    <span>{children}</span>
    <span>{title}</span>
  </span>
);

export default ToggleWrapper;
