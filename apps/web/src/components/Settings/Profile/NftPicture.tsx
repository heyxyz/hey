import { PhotoIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import getAvatar from '@hey/lib/getAvatar';
import { Button, Image } from '@hey/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';

import NftAvatarModal from './NftAvatarModal';

interface NftPictureProps {
  profile: Profile;
}

const NftPicture: FC<NftPictureProps> = ({ profile }) => {
  const [showNftAvatarModal, setShowNftAvatarModal] = useState<boolean>(false);

  return (
    <div className="space-y-3">
      <Image
        src={getAvatar(profile)}
        loading="lazy"
        className={'max-w-xs rounded-lg'}
        alt={formatHandle(profile?.handle)}
      />
      <Button
        icon={<PhotoIcon className="h-4 w-4" />}
        onClick={() => setShowNftAvatarModal(true)}
      >
        <Trans>Choose NFT avatar</Trans>
      </Button>
      <NftAvatarModal
        showNftAvatarModal={showNftAvatarModal}
        setShowNftAvatarModal={setShowNftAvatarModal}
      />
    </div>
  );
};

export default NftPicture;
