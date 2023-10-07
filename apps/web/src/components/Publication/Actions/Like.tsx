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
import type { ApolloCache } from '@hey/lens/apollo';
import { publicationKeyFields } from '@hey/lens/apollo/lib';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';

interface LikeProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Like: FC<LikeProps> = ({ publication, showCount }) => {
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [liked, setLiked] = useState(targetPublication.operations.hasReacted);
  const [count, setCount] = useState(targetPublication.stats.reactions);

  const onError = (error: any) => {
    errorToast(error);
  };

  const updateCache = (
    cache: ApolloCache<any>,
    type: PublicationReactionType.Upvote | PublicationReactionType.Downvote
  ) => {
    if (showCount) {
      cache.modify({
        id: publicationKeyFields(targetPublication),
        fields: {
          stats: (stats) => ({
            ...stats,
            reactions:
              type === PublicationReactionType.Upvote
                ? stats.reactions + 1
                : stats.reactions - 1
          })
        }
      });
    }
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
      setLiked(!liked);
      setCount(count - 1);
      onError(error);
    },
    update: (cache) => updateCache(cache, PublicationReactionType.Upvote)
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => Leafwatch.track(PUBLICATION.UNLIKE, eventProperties),
    onError: (error) => {
      setLiked(!liked);
      setCount(count + 1);
      onError(error);
    },
    update: (cache) => updateCache(cache, PublicationReactionType.Downvote)
  });

  const createLike = () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    // Variables
    const request: ReactionRequest = {
      reaction: PublicationReactionType.Upvote,
      for: targetPublication.id
    };

    if (liked) {
      setLiked(false);
      setCount(count - 1);
      removeReaction({ variables: { request } });
    } else {
      setLiked(true);
      setCount(count + 1);
      addReaction({ variables: { request } });
    }
  };

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div
      className={cn(
        liked ? 'text-brand-500' : 'lt-text-gray-500',
        'flex items-center space-x-1'
      )}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={createLike}
        aria-label="Like"
      >
        <div
          className={cn(
            liked ? 'hover:bg-brand-300/20' : 'hover:bg-gray-300/20',
            'rounded-full p-1.5'
          )}
        >
          <Tooltip
            placement="top"
            content={liked ? t`Unlike` : t`Like`}
            withDelay
          >
            {liked ? (
              <HeartIconSolid className={iconClassName} />
            ) : (
              <HeartIcon className={iconClassName} />
            )}
          </Tooltip>
        </div>
      </motion.button>
      {count > 0 && !showCount ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      ) : null}
    </div>
  );
};

export default Like;
