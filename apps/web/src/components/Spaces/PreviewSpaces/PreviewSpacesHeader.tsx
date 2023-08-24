import Slug from '@components/Shared/Slug';
import { XIcon } from '@heroicons/react/outline';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import type { Profile } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import isVerified from '@lib/isVerified';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

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
      <div className="mx-auto flex w-fit items-center gap-2 text-neutral-900 dark:text-neutral-100">
        {hostProfile?.name}
        {isVerified(hostProfile.id) && (
          <BadgeCheckIcon className="text-brand h-4 w-4" />
        )}
        <span className="items-center justify-center text-sm"> | </span>
        <Slug slug={t`@${hostProfile.handle}`} className="text-sm" />
      </div>
      <div className="pt-2 text-base font-normal leading-none text-neutral-500 dark:text-neutral-300">
        {space.title}
      </div>
      <XIcon
        className="absolute right-4 top-4 h-5 w-5 cursor-pointer"
        onClick={() => setShowSpacesLobby(false)}
      />
    </div>
  );
};

export default PreviewSpacesHeader;
