import type { ApolloCache } from '@apollo/client';
import type { AnyPublication, ReactionRequest } from '@hey/lens';
import type { FC } from 'react';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import {
  PublicationReactionType,
  useAddReactionMutation,
  useRemoveReactionMutation
} from '@hey/lens';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface LikeProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Like: FC<LikeProps> = ({ publication, showCount }) => {
  const { pathname } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [hasReacted, setHasReacted] = useState(
    targetPublication.operations.hasReacted
  );
  const [reactions, setReactions] = useState(targetPublication.stats.reactions);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasReacted: !hasReacted };
        }
      },
      id: cache.identify(targetPublication)
    });
    cache.modify({
      fields: {
        reactions: () => (hasReacted ? reactions - 1 : reactions + 1)
      },
      id: cache.identify(targetPublication.stats)
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const getLikeSource = () => {
    if (pathname === '/') {
      return 'home_feed';
    }

    if (pathname === '/u/[username]') {
      return 'profile_feed';
    }

    if (pathname === '/explore') {
      return 'explore_feed';
    }

    if (pathname === '/posts/[id]') {
      return 'post_page';
    }

    return;
  };

  const eventProperties = {
    publication_id: publication?.id,
    source: getLikeSource()
  };

  const [addReaction] = useAddReactionMutation({
    onCompleted: () => {
      Leafwatch.track(PUBLICATION.LIKE, eventProperties);
    },
    onError: (error) => {
      setHasReacted(!hasReacted);
      setReactions(reactions - 1);
      onError(error);
    },
    update: updateCache
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => Leafwatch.track(PUBLICATION.UNLIKE, eventProperties),
    onError: (error) => {
      setHasReacted(!hasReacted);
      setReactions(reactions + 1);
      onError(error);
    },
    update: updateCache
  });

  const createLike = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    // Variables
    const request: ReactionRequest = {
      for: targetPublication.id,
      reaction: PublicationReactionType.Upvote
    };

    if (hasReacted) {
      setHasReacted(false);
      setReactions(reactions - 1);
      return await removeReaction({ variables: { request } });
    }

    setHasReacted(true);
    setReactions(reactions + 1);
    return await addReaction({ variables: { request } });
  };

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div
      className={cn(
        hasReacted ? 'text-brand-500' : 'ld-text-gray-500',
        'flex items-center space-x-1'
      )}
    >
      <motion.button
        aria-label="Like"
        className={cn(
          hasReacted
            ? 'hover:bg-brand-300/20 outline-brand-500'
            : 'outline-gray-400 hover:bg-gray-300/20',
          'rounded-full p-1.5 outline-offset-2'
        )}
        onClick={createLike}
        whileTap={{ scale: 0.9 }}
      >
        <Tooltip
          content={hasReacted ? 'Unlike' : 'Like'}
          placement="top"
          withDelay
        >
          {hasReacted ? (
            <HeartIconSolid className={iconClassName} />
          ) : (
            <HeartIcon className={iconClassName} />
          )}
        </Tooltip>
      </motion.button>
      {reactions > 0 && !showCount ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(reactions)}</span>
      ) : null}
    </div>
  );
};

export default Like;
