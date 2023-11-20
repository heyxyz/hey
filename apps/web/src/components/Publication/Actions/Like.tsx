'use client';

import type { ApolloCache } from '@apollo/client';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import type { AnyPublication, ReactionRequest } from '@hey/lens';
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
import { usePathname } from 'next/navigation';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import useProfilePersistStore from 'src/store/useProfilePersistStore';

interface LikeProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Like: FC<LikeProps> = ({ publication, showCount }) => {
  const pathname = usePathname();
  const currentProfile = useProfilePersistStore(
    (state) => state.currentProfile
  );

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [hasReacted, setHasReacted] = useState(
    targetPublication.operations.hasReacted
  );
  const [reactions, setReactions] = useState(targetPublication.stats.reactions);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: cache.identify(targetPublication),
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasReacted: !hasReacted };
        }
      }
    });
    cache.modify({
      id: cache.identify(targetPublication.stats),
      fields: {
        reactions: () => (hasReacted ? reactions - 1 : reactions + 1)
      }
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const getLikeSource = () => {
    if (pathname === '/') {
      return 'home_feed';
    } else if (pathname === '/u/[username]') {
      return 'profile_feed';
    } else if (pathname === '/explore') {
      return 'explore_feed';
    } else if (pathname === '/posts/[id]') {
      return 'post_page';
    } else {
      return;
    }
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
      reaction: PublicationReactionType.Upvote,
      for: targetPublication.id
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
        className={cn(
          hasReacted
            ? 'hover:bg-brand-300/20 outline-brand-500'
            : 'outline-gray-400 hover:bg-gray-300/20',
          'rounded-full p-1.5 outline-offset-2'
        )}
        whileTap={{ scale: 0.9 }}
        onClick={createLike}
        aria-label="Like"
      >
        <Tooltip
          placement="top"
          content={hasReacted ? 'Unlike' : 'Like'}
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
