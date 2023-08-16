import { PencilIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import { Button, Image } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface NftPictureProps {
  profile: Profile;
}

const NftPicture: FC<NftPictureProps> = ({ profile }) => {
  const setShowNftAvatarModal = useGlobalModalStateStore(
    (state) => state.setShowNftAvatarModal
  );

  return (
    <div>
      <Image
        src={getAvatar(profile)}
        loading="lazy"
        className={'mb-4 max-w-xs rounded-lg'}
        alt={formatHandle(profile?.handle)}
      />
      <Button
        icon={<PencilIcon className="h-4 w-4" />}
        onClick={() => setShowNftAvatarModal(true)}
      >
        <Trans>Choose NFT Avatar</Trans>
      </Button>
    </div>
  );
};

export default NftPicture;
