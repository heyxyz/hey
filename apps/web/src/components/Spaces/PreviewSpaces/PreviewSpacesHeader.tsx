import Slug from '@components/Shared/Slug';
import type { Profile } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

import { Icons } from '../Common/assets/Icons';

const PreviewSpacesHeader: FC = () => {
  const setShowSpacesLobby = useSpacesStore(
    (state) => state.setShowSpacesLobby
  );
  const space = useSpacesStore((state) => state.space);

  const { data } = useProfilesQuery({
    variables: {
      request: { ownedBy: [space.host] }
    }
  });

  const hostProfile = data?.profiles?.items?.find(
    (profile) => profile?.ownedBy === space.host
  ) as Profile;

  return (
    <div className="relative border-b border-neutral-300 bg-neutral-100 p-5 py-4 dark:border-neutral-800 dark:bg-zinc-800">
      <div className="mx-auto flex w-fit items-center text-neutral-900 dark:text-neutral-100">
        {hostProfile?.name}
        <span className="pl-2">{Icons.verified}</span>
        <span className="px-2">{Icons.dot}</span>
        <Slug slug={t`@${hostProfile.handle}`} className="text-sm" />
      </div>
      <div className="pt-2 text-base font-normal leading-none text-neutral-500 dark:text-neutral-300">
        {space.title}
      </div>
      <div
        className="absolute right-4 top-4 cursor-pointer"
        onClick={() => setShowSpacesLobby(false)}
      >
        {Icons.cross}
      </div>
    </div>
  );
};

export default PreviewSpacesHeader;
