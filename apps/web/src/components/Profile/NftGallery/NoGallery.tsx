import { Button } from '@components/UI/Button';
import { Trans } from '@lingui/macro';
import type { Profile } from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useAppStore } from 'src/store/app';

import Create from './Create';

interface Props {
  profile: Profile;
}

const NoGallery: FC<Props> = ({ profile }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const isOwner = profile.id === currentProfile?.id;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10">
      <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />
      <div className="grid w-full max-w-sm grid-cols-3 gap-4">
        <div className="bg-brand-100 col-span-2 flex h-[250px] items-center justify-center rounded-xl">
          <img
            width={100}
            height={100}
            className="h-20 w-20"
            src="https://i.imgur.com/OAauOym.png"
            alt="No gallery found"
            draggable={false}
          />
        </div>
        <div className="space-y-2">
          <div className="bg-brand-100 flex h-[120px] items-center justify-center rounded-xl">
            <img
              width={50}
              height={50}
              className="h-1w-14 w-14"
              src="https://i.imgur.com/GdIxlDY.png"
              alt=""
              draggable={false}
            />
          </div>
          <div className="bg-brand-100 flex h-[120px] items-center justify-center rounded-xl">
            <img
              width={50}
              height={50}
              className="h-14 w-14"
              src="https://i.imgur.com/w3DaYru.png"
              alt=""
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        {!isOwner ? (
          <>
            <h5 className="mb-2 text-xl">{profile.name ?? profile.handle} hasn't setup gallery yet!</h5>
            <p className="text-sm opacity-60">Check again later</p>
          </>
        ) : (
          <>
            <h5 className="mb-2 text-xl">
              <Trans>Welcome to your gallery</Trans>
            </h5>
            <p className="text-sm opacity-60">
              <Trans>Create a curated space for your digital collectibles</Trans>
            </p>
          </>
        )}
      </div>
      {isOwner && (
        <Button onClick={() => setShowCreateModal(true)}>
          <Trans>Let's do it!</Trans>
        </Button>
      )}
    </div>
  );
};

export default NoGallery;
