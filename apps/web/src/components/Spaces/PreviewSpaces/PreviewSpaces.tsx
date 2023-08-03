import React from 'react';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import SpacesButton from '../Common/SpacesButton';
import PreviewSpacesHeader from './PreviewSpacesHeader';

const PreviewSpaces = () => {
  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-zinc-900/80 text-center">
      <div className="overflow-hidden rounded-lg bg-black">
        <PreviewSpacesHeader />
        <div className=" px-5 py-6 pb-0">
          <AvatarGrid />
        </div>
        <div className="mx-auto py-4 text-center text-sm leading-tight text-neutral-500">
          Your mic will be off at the start
        </div>
        <div className="pb-3">
          <SpacesButton>Start Listening</SpacesButton>
        </div>
      </div>
    </div>
  );
};

export default PreviewSpaces;
