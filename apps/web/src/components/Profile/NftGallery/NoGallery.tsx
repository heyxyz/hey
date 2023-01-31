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
    <div className="py-10 flex space-y-4 flex-col items-center justify-center">
      <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />
      <div className="grid grid-cols-3 w-full max-w-sm gap-4">
        <div className="col-span-2 flex h-[250px] justify-center items-center bg-brand-100 rounded-xl">
          <img
            width={100}
            height={100}
            className="w-20 h-20"
            src="https://i.imgur.com/OAauOym.png"
            alt="No gallery found"
            draggable={false}
          />
        </div>
        <div className="space-y-2">
          <div className="bg-brand-100 h-[120px] flex justify-center items-center rounded-xl">
            <img
              width={50}
              height={50}
              className="w-14 h-1w-14"
              src="https://i.imgur.com/GdIxlDY.png"
              alt=""
              draggable={false}
            />
          </div>
          <div className="bg-brand-100 h-[120px] flex justify-center items-center rounded-xl">
            <img
              width={50}
              height={50}
              className="w-14 h-14"
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
            <h5 className="text-xl mb-2">{profile.name ?? profile.handle} hasn't setup gallery yet!</h5>
            <p className="opacity-60 text-sm">Check again later</p>
          </>
        ) : (
          <>
            <h5 className="text-xl mb-2">
              <Trans>Welcome to your gallery</Trans>
            </h5>
            <p className="opacity-60 text-sm">
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
