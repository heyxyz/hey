import type { ApolloCache } from '@apollo/client';
import type { PeerToPeerRecommendRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon
} from '@heroicons/react/24/outline';
import { Errors } from '@hey/data/errors';
import { GARDENER } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import {
  usePeerToPeerRecommendMutation,
  usePeerToPeerUnrecommendMutation
} from '@hey/lens';
import { Button } from '@hey/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import errorToast from 'src/helpers/errorToast';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface P2PRecommendationProps {
  profile: Profile;
}

const P2PRecommendation: FC<P2PRecommendationProps> = ({ profile }) => {
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileRestriction();

  const [hasRecommended, setHasRecommended] = useState(
    profile.peerToPeerRecommendedByMe
  );

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return {
            ...existingValue,
            peerToPeerRecommendedByMe: hasRecommended
          };
        }
      },
      id: cache.identify(profile)
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [p2pRecommend] = usePeerToPeerRecommendMutation({
    onCompleted: () => {
      Leafwatch.track(GARDENER.PROFILE.P2P_RECOMMEND, { profile: profile.id });
      toast.success('Profile recommended');
    },
    onError: (error) => {
      setHasRecommended(!hasRecommended);
      onError(error);
    },
    update: updateCache
  });

  const [p2pUnRecommend] = usePeerToPeerUnrecommendMutation({
    onCompleted: () => {
      Leafwatch.track(GARDENER.PROFILE.P2P_UNRECOMMEND, {
        profile: profile.id
      });
      toast.success('Profile unrecommended');
    },
    onError: (error) => {
      setHasRecommended(!hasRecommended);
      onError(error);
    },
    update: updateCache
  });

  const updateRecommendation = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    // Variables
    const request: PeerToPeerRecommendRequest = {
      profileId: profile.id
    };

    if (hasRecommended) {
      setHasRecommended(false);
      return await p2pUnRecommend({ variables: { request } });
    }

    setHasRecommended(true);
    return await p2pRecommend({ variables: { request } });
  };

  return (
    <Button
      icon={
        hasRecommended ? (
          <ArrowDownCircleIcon className="size-4" />
        ) : (
          <ArrowUpCircleIcon className="size-4" />
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        updateRecommendation();
      }}
      outline={!hasRecommended}
      size="sm"
    >
      {hasRecommended ? 'Unrecommend' : 'Recommend'}
    </Button>
  );
};

export default P2PRecommendation;
