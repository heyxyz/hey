import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import React from 'react';

type SpacesButtonProps = {} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const SpacesButton: FC<SpacesButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="rounded-lg bg-violet-500 px-8 py-2 text-sm text-white"
      {...props}
    >
      {children}
    </button>
  );
};

export default SpacesButton;
