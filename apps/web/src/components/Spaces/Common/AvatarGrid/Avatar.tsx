import React from 'react';

type Props = {};

const Avatar = (props: Props) => {
  return (
    <div className="inline-flex w-16 flex-col items-center justify-start gap-1">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-500" />
      <div className="flex flex-col items-center justify-start gap-0.5">
        <div className="text-xs font-normal leading-none text-neutral-300">
          deepso.eth
        </div>
      </div>
      <div className="text-xs font-normal leading-none text-slate-400">
        Host
      </div>
    </div>
  );
};

export default Avatar;
