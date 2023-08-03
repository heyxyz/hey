import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { MicrophoneIcon } from '@heroicons/react/outline';
import { getLensAccessToken, getLensMessage } from '@huddle01/auth';
import type { Profile, Publication } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import getPublicationAttribute from '@lenster/lib/getPublicationAttribute';
import type { SpaceMetadata } from '@lenster/types/spaces';
import { Button, Spinner } from '@lenster/ui';
import type { FC } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import Wrapper from '../Wrapper';

interface SpaceProps {
  publication: Publication;
}

const Space: FC<SpaceProps> = ({ publication }) => {
  const { address } = useAccount();
  const { metadata } = publication;

  const { signMessage, isLoading: signing } = useSignMessage({
    onSuccess: async (data) => {
      const token = await getLensAccessToken(data, address as string);
    }
  });

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
    (profile) => profile?.ownedBy === space.host
  ) as Profile;

  return (
    <Wrapper className="!bg-brand-500/30 border-brand-400 mt-0 !p-3">
      <SmallUserProfile profile={hostProfile} smallAvatar />
      <div className="mt-2 space-y-3">
        <b className="text-lg">{metadata.content}</b>
        <Button
          className="!mt-4 flex w-full justify-center"
          disabled={signing}
          icon={
            signing ? (
              <Spinner size="xs" className="mr-1" />
            ) : (
              <MicrophoneIcon className="h-5 w-5" />
            )
          }
          onClick={async () => {
            const msg = await getLensMessage(address as string);
            signMessage({ message: msg.message });
          }}
        >
          Open Space
        </Button>
      </div>
    </Wrapper>
  );
};

export default Space;
