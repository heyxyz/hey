import Slug from '@components/Shared/Slug';
import React from 'react';

import Icons from '../Common/assets/Icons';

const PreviewSpacesHeader = () => {
  return (
    <div className="relative bg-neutral-800 p-5 py-4">
      <div className="mx-auto flex w-fit items-center">
        johndoe
        <span className="pl-2">{Icons.verified}</span>
        <span className="px-2">{Icons.dot}</span>
        <Slug slug="@johndoe" className="text-sm" />
      </div>
      <div className="pt-2 text-base font-normal leading-none text-neutral-300">
        My first spaces on Lenster
      </div>
      <div className="absolute right-4 top-4 cursor-pointer">{Icons.cross}</div>
    </div>
  );
};

export default PreviewSpacesHeader;
