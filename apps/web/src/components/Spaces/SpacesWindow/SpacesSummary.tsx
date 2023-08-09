import { useHuddle01, usePeers } from '@huddle01/react/hooks';
import type { Profile } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import getAvatar from '@lenster/lib/getAvatar';
import { Image } from '@lenster/ui';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

import { Icons } from '../Common/assets/Icons';

type Props = {};

const SpacesSummary = (props: Props) => {
  const space = useSpacesStore((state) => state.space);
  const { peers } = usePeers();
  const { me } = useHuddle01();

  const { data } = useProfilesQuery({
    variables: {
      request: { ownedBy: [space.host] }
    }
  });

  const hostProfile = data?.profiles?.items?.find(
    (profile) => profile?.ownedBy === space.host
  ) as Profile;

  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex items-center gap-2">
        {Icons.speaking}
        <Image
          src={getAvatar(hostProfile)}
          className="aspect-square h-4 w-4 rounded-full bg-blue-500"
        />
        <div className="text-sm font-normal leading-none text-neutral-200">
          {hostProfile.handle}
        </div>
      </div>
      <div className="flex items-center text-xs font-normal leading-none text-white text-opacity-60">
        <div className="flex">
          <div className="aspect-square h-3 w-3 rounded-full bg-red-500" />
          <div className="aspect-square h-3 w-3 -translate-x-1/2 rounded-full bg-yellow-500" />
          <div className="aspect-square h-3 w-3 -translate-x-full rounded-full bg-blue-500 " />
        </div>
        <div>
          {Object.keys(peers).filter((peerId) => peerId !== me.meId).length + 1}
          +
        </div>
      </div>
    </div>
  );
};

export default SpacesSummary;
