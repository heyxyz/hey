import { useAppUtils } from '@huddle01/react/app-utils';
import { useAcl, useEventListener, useHuddle01 } from '@huddle01/react/hooks';
import getAvatar from '@lenster/lib/getAvatar';
import React, { useEffect } from 'react';
import { useAppStore } from 'src/store/app';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import SpacesWindowBottomBar from './SpacesWindowBottomBar';
import SpaceWindowHeader from './SpaceWindowHeader';

type Props = {};

const SpacesWindow = (props: Props) => {
  const { setDisplayName, changeAvatarUrl } = useAppUtils();
  const { changePeerRole } = useAcl();
  const { me } = useHuddle01();

  const currentProfile = useAppStore((state) => state.currentProfile);

  useEventListener('room:peer-joined', ({ peerId, role }) => {
    if (role === 'peer' && me.role === 'host') {
      changePeerRole(peerId, 'listener');
    }
  });

  useEffect(() => {
    if (changeAvatarUrl.isCallable) {
      changeAvatarUrl(getAvatar(currentProfile));
    }
  }, [changeAvatarUrl.isCallable]);

  useEffect(() => {
    if (setDisplayName.isCallable) {
      setDisplayName(currentProfile?.handle);
    }
  }, [setDisplayName.isCallable]);

  return (
    // First 2 divs are for positioning the window based on the winodw size of different devices
    <div className="fixed inset-0 top-auto z-20 mx-auto flex flex w-full grow">
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
