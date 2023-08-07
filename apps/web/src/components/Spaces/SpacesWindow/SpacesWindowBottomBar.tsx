import React from 'react';

import Icons from '../Common/assets/Icons';

const SpacesWindowBottomBar = () => {
  return (
    <div className="flex justify-between pt-4">
      <div>{Icons.mic.false}</div>
      <div className="flex gap-2">
        <div>{Icons.music}</div>
        <div>{Icons.reaction}</div>
        <div className="flex h-full items-center gap-2 rounded-lg bg-neutral-800 px-2 font-normal text-neutral-500">
          <span>{Icons.people}</span>
          12
        </div>
      </div>
    </div>
  );
};

export default SpacesWindowBottomBar;
