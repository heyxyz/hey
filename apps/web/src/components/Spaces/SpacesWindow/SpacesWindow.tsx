import React from 'react';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import SpacesWindowBottomBar from './SpacesWindowBottomBar';
import SpaceWindowHeader from './SpaceWindowHeader';

type Props = {};

const SpacesWindow = (props: Props) => {
  return (
    // First 2 divs are for positioning the window based on the winodw size of different devices
    <div className="fixed inset-0 top-auto z-20 mx-auto flex flex h-fit w-full grow">
      <div className="relative mx-auto max-w-screen-xl grow">
        <div className="absolute bottom-0 right-0 ml-auto w-fit rounded-xl rounded-b-none border-[1.5px] border-neutral-700 bg-neutral-900 px-4 pb-4 pt-3">
          <SpaceWindowHeader />
          <div className="pt-4">
            <AvatarGrid />
          </div>
          <SpacesWindowBottomBar />
        </div>
      </div>
    </div>
  );
};

export default SpacesWindow;
