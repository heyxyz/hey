import type {
  MirrorablePublication,
  PeerToPeerRecommendRequest
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import type { FC } from 'react';

import { MenuItem } from '@headlessui/react';
import errorToast from '@helpers/errorToast';
import { Leafwatch } from '@helpers/leafwatch';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import {
  usePeerToPeerRecommendMutation,
  usePeerToPeerUnrecommendMutation
} from '@hey/lens';
import cn from '@hey/ui/cn';
import { toast } from 'react-hot-toast';

interface NotInterestedProps {
  publication: MirrorablePublication;
}

const Recommend: FC<NotInterestedProps> = ({ publication }) => {
  const recommended = publication.by.peerToPeerRecommendedByMe;

  const request: PeerToPeerRecommendRequest = {
    profileId: publication.by.id
  };

  const updateCache = (cache: ApolloCache<any>, recommended: boolean) => {
    cache.modify({
      fields: { peerToPeerRecommendedByMe: () => recommended },
      id: cache.identify(publication.by)
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [recommend] = usePeerToPeerRecommendMutation({
    onCompleted: () => {
      toast.success('Recommended by you successfully!');
      Leafwatch.track(PROFILE.RECOMMENDED, { profile_id: publication.by.id });
    },
    onError,
    update: (cache) => updateCache(cache, true),
    variables: { request }
  });

  const [unrecommend] = usePeerToPeerUnrecommendMutation({
    onCompleted: () => {
      toast.success('Un-recommended by you successfully!');
      Leafwatch.track(PROFILE.UNRECOMENDED, { profile_id: publication.by.id });
    },
    onError,
    update: (cache) => updateCache(cache, false),
    variables: { request }
  });

  const togglePublicationProfileRecommend = async () => {
    if (recommended) {
      return await unrecommend();
    }

    return await recommend();
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { 'dropdown-active': focus },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        togglePublicationProfileRecommend();
      }}
    >
      <div className="flex items-center space-x-2">
        {recommended ? (
          <>
            <SparklesIcon className="size-4" />
            <div>Un-recommend</div>
          </>
        ) : (
          <>
            <SparklesIcon className="size-4" />
            <div>Recommend</div>
          </>
        )}
      </div>
    </MenuItem>
  );
};

export default Recommend;
