import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { MicrophoneIcon } from '@heroicons/react/outline';
import type { Profile, Publication } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import getPublicationAttribute from '@lenster/lib/getPublicationAttribute';
import { Button, Modal } from '@lenster/ui';
import type { FC } from 'react';
import { useState } from 'react';
import type { SpaceMetadata } from 'src/types';

import Wrapper from '../Wrapper';
import SpacePlayer from './SpacePlayer';

interface SpaceProps {
  publication: Publication;
}

const Space: FC<SpaceProps> = ({ publication }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const { metadata } = publication;
  const space: SpaceMetadata = JSON.parse(
    getPublicationAttribute(metadata.attributes, 'audioSpace')
  );

  const { data, loading } = useProfilesQuery({
    variables: {
      request: { ownedBy: [space.host] }
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const hostProfile = data?.profiles?.items?.find(
    (profile) => profile?.ownedBy === space.host && profile?.isDefault
  ) as Profile;

  return (
    <Wrapper className="!bg-brand-500/30 border-brand-400 mt-0 !p-3">
      <SmallUserProfile profile={hostProfile} smallAvatar />
      <div className="mt-2 space-y-3">
        <b className="text-lg">{metadata.content}</b>
        <Button
          className="!mt-4 flex w-full justify-center"
          icon={<MicrophoneIcon className="h-5 w-5" />}
          onClick={() => setShowPlayer(true)}
        >
          Open Space
        </Button>
      </div>
      <Modal
        show={showPlayer}
        onClose={() => setShowPlayer(false)}
        size="md"
        title="Space"
        icon={<MicrophoneIcon className="text-brand h-5 w-5" />}
      >
        <SpacePlayer
          publication={publication}
          space={{
            id: space.id,
            host: hostProfile
          }}
        />
      </Modal>
    </Wrapper>
  );
};

export default Space;
