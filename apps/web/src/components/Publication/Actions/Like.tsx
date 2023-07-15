import { HeartIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { Errors } from '@lenster/data/errors';
import { PUBLICATION } from '@lenster/data/tracking';
import type { Publication } from '@lenster/lens';
import {
  ReactionTypes,
  useAddReactionMutation,
  useRemoveReactionMutation
} from '@lenster/lens';
import type { ApolloCache } from '@lenster/lens/apollo';
import { publicationKeyFields } from '@lenster/lens/apollo/lib';
import nFormatter from '@lenster/lib/nFormatter';
import { Tooltip } from '@lenster/ui';
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
  publication: Publication;
  showCount: boolean;
}

const Like: FC<LikeProps> = ({ publication, showCount }) => {
  const { pathname } = useRouter();
  const isMirror = publication.__typename === 'Mirror';
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [liked, setLiked] = useState(
    (isMirror ? publication?.mirrorOf?.reaction : publication?.reaction) ===
      'UPVOTE'
  );
  const [count, setCount] = useState(
    isMirror
      ? publication?.mirrorOf?.stats?.totalUpvotes
      : publication?.stats?.totalUpvotes
  );

  const onError = (error: any) => {
    errorToast(error);
  };

  const updateCache = (
    cache: ApolloCache<any>,
    type: ReactionTypes.Upvote | ReactionTypes.Downvote
  ) => {
    if (showCount) {
      cache.modify({
        id: publicationKeyFields(
          isMirror ? publication?.mirrorOf : publication
        ),
        fields: {
          stats: (stats) => ({
            ...stats,
            totalUpvotes:
              type === ReactionTypes.Upvote
                ? stats.totalUpvotes + 1
                : stats.totalUpvotes - 1
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
    update: (cache) => updateCache(cache, ReactionTypes.Upvote)
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => Leafwatch.track(PUBLICATION.UNLIKE, eventProperties),
    onError: (error) => {
      setLiked(!liked);
      setCount(count + 1);
      onError(error);
    },
    update: (cache) => updateCache(cache, ReactionTypes.Downvote)
  });

  const createLike = () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    const variable = {
      variables: {
        request: {
          profileId: currentProfile?.id,
          reaction: ReactionTypes.Upvote,
          publicationId:
            publication.__typename === 'Mirror'
              ? publication?.mirrorOf?.id
              : publication?.id
        }
      }
    };

    if (liked) {
      setLiked(false);
      setCount(count - 1);
      removeReaction(variable);
    } else {
      setLiked(true);
      setCount(count + 1);
      addReaction(variable);
    }
  };

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1 text-pink-500">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={createLike}
        aria-label="Like"
      >
        <div className="rounded-full p-1.5 hover:bg-pink-300/20">
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
      {count > 0 && !showCount && (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      )}
    </div>
  );
};

export default Like;
