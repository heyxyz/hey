import React from 'react';

import Avatar from './Avatar';

const AvatarGrid = () => {
  return (
    <div className="">
      <div className="border-b border-neutral-800 pb-6">
        <div className="inline-flex grid grid-cols-5 items-center justify-between gap-5 self-stretch ">
          {Array.from({ length: 10 }).map((_, i) => (
            <Avatar key={i} />
          ))}
        </div>
        <div className="py-4 text-sm font-normal leading-none text-slate-400">
          Listeners - 16
        </div>
        <div className="inline-flex grid grid-cols-5 items-center justify-between gap-5 self-stretch ">
          {Array.from({ length: 10 }).map((_, i) => (
            <Avatar key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarGrid;
