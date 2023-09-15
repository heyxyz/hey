import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { ClockIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { getLensAccessToken, getLensMessage } from '@huddle01/auth';
import type { Profile, Publication } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import getPublicationAttribute from '@lenster/lib/getPublicationAttribute';
import type { SpaceMetadata } from '@lenster/types/spaces';
import { Button, Spinner } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { t, Trans } from '@lingui/macro';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useAccount, useSignMessage } from 'wagmi';

import Wrapper from '../Wrapper';

interface SpaceProps {
  publication: Publication;
}

const Space: FC<SpaceProps> = ({ publication }) => {
  const {
    setShowSpacesLobby,
    setLensAccessToken,
    lensAccessToken,
    setSpace,
    setSpacesPublicationId
  } = useSpacesStore();

  const { address } = useAccount();
  const { metadata } = publication;

  const space: SpaceMetadata = JSON.parse(
    getPublicationAttribute(metadata.attributes, 'audioSpace')
  );

  const { signMessage, isLoading: signing } = useSignMessage({
    onSuccess: async (data) => {
      const token = await getLensAccessToken(data, address as string);
      if (token.accessToken) {
        setShowSpacesLobby(true);
        setSpacesPublicationId(publication.id);
        setLensAccessToken(token.accessToken);
        setSpace({
          ...space,
          title: metadata.content
        });
      }
    }
  });

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

  const calculateRemainingTime = () => {
    const now = dayjs();
    const targetTime = dayjs(space.startTime);
    const timeDifference = targetTime.diff(now);

    if (timeDifference <= 0) {
      return t`Start Listening`;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    let result = t`Starts in`;
    result += ' ';

    if (days > 0) {
      result += t`${days} day`;
      if (days > 1) {
        result += 's'; // Pluralize "day" when there are more than one day.
      }
      result += ' ';
    }

    if (hours > 0) {
      result += t`${hours} hour`;
      if (hours > 1) {
        result += 's'; // Pluralize "hour" when there are more than one hour.
      }
      result += ' ';
    }

    if (minutes > 0) {
      result += t`${minutes} minute`;
      if (minutes > 1) {
        result += 's'; // Pluralize "minute" when there are more than one minute.
      }
    }

    if (days === 0 && hours === 0 && minutes === 0) {
      result = t`Start Listening`;
    }

    return result;
  };

  return (
    <Wrapper className="!bg-brand-500/30 border-brand-400 mt-0 !p-3">
      <SmallUserProfile profile={hostProfile} smallAvatar />
      <div className="mt-2 space-y-3">
        <b className="text-lg">{metadata.content}</b>
        <Button
          className={cn(
            '!md:pointer-events-none !mt-4 flex w-full justify-center',
            calculateRemainingTime() !== 'Start Listening'
              ? 'pointer-events-none'
              : 'pointer-events-auto'
          )}
          disabled={signing}
          icon={
            signing ? (
              <Spinner size="xs" className="p-1" />
            ) : calculateRemainingTime() !== 'Start Listening' ? (
              <ClockIcon className="h-5 w-5" />
            ) : (
              <MicrophoneIcon className="h-5 w-5" />
            )
          }
          onClick={async () => {
            if (lensAccessToken) {
              setShowSpacesLobby(true);
              setSpace({
                ...space,
                title: metadata.content
              });
              return;
            }
            const msg = await getLensMessage(address as string);
            signMessage({ message: msg.message });
          }}
        >
          <div className="hidden md:block">{calculateRemainingTime()}</div>
          <div className="md:hidden">
            <Trans>Spaces will open in desktop only</Trans>
          </div>
        </Button>
      </div>
    </Wrapper>
  );
};

export default Space;
