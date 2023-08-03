import React from 'react';

type Props = {} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const SpacesButton = ({ children }: Props) => {
  return (
    <button className="rounded-lg bg-violet-500 px-8 py-2 text-sm text-white">
      {children}
    </button>
  );
};

export default SpacesButton;
