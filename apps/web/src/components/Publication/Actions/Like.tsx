import type { ApolloCache } from '@apollo/client';
import { Tooltip } from '@components/UI/Tooltip';
import { HeartIcon, SunIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid, SunIcon as SunIconSolid } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import hasGm from '@lib/hasGm';
import { publicationKeyFields } from '@lib/keyFields';
import nFormatter from '@lib/nFormatter';
import onError from '@lib/onError';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { SIGN_WALLET } from 'data/constants';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import { ReactionTypes, useAddReactionMutation, useRemoveReactionMutation } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: Publication;
  showCount: boolean;
}

const Like: FC<Props> = ({ publication, showCount }) => {
  const { pathname } = useRouter();
  const isMirror = publication.__typename === 'Mirror';
  const currentProfile = useAppStore((state) => state.currentProfile);
  const hideLikesCount = usePreferencesStore((state) => state.hideLikesCount);
  const [liked, setLiked] = useState(
    (isMirror ? publication?.mirrorOf?.reaction : publication?.reaction) === 'UPVOTE'
  );
  const [count, setCount] = useState(
    isMirror ? publication?.mirrorOf?.stats?.totalUpvotes : publication?.stats?.totalUpvotes
  );

  const updateCache = (cache: ApolloCache<any>, type: ReactionTypes.Upvote | ReactionTypes.Downvote) => {
    if (showCount || hideLikesCount) {
      cache.modify({
        id: publicationKeyFields(isMirror ? publication?.mirrorOf : publication),
        fields: {
          stats: (stats) => ({
            ...stats,
            totalUpvotes: type === ReactionTypes.Upvote ? stats.totalUpvotes + 1 : stats.totalUpvotes - 1
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

  const getEventProperties = (type: 'like' | 'dislike') => {
    return {
      [`${type}_by`]: currentProfile?.id,
      [`${type}_publication`]: publication?.id,
      [`${type}_source`]: getLikeSource()
    };
  };

  const [addReaction] = useAddReactionMutation({
    onCompleted: () => {
      Analytics.track(PUBLICATION.LIKE, getEventProperties('like'));
    },
    onError: (error) => {
      setLiked(!liked);
      setCount(count - 1);
      onError(error);
    },
    update: (cache) => updateCache(cache, ReactionTypes.Upvote)
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => {
      Analytics.track(PUBLICATION.DISLIKE, getEventProperties('dislike'));
    },
    onError: (error) => {
      setLiked(!liked);
      setCount(count + 1);
      onError(error);
    },
    update: (cache) => updateCache(cache, ReactionTypes.Downvote)
  });

  const createLike = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    const variable = {
      variables: {
        request: {
          profileId: currentProfile?.id,
          reaction: ReactionTypes.Upvote,
          publicationId: publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id
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

  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';
  const { content } = publication.metadata;
  const isGM = hasGm(content);

  return (
    <div className={clsx(isGM ? 'text-yellow-600' : 'text-pink-500', 'flex items-center space-x-1')}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isGM && liked ? 90 : 0
        }}
        onClick={createLike}
        aria-label="Like"
      >
        <div
          className={clsx(
            isGM ? 'hover:bg-yellow-400' : 'hover:bg-pink-300',
            'rounded-full p-1.5 hover:bg-opacity-20'
          )}
        >
          <Tooltip placement="top" content={liked ? t`Dislike` : t`Like`} withDelay>
            {liked ? (
              isGM ? (
                <SunIconSolid className={iconClassName} />
              ) : (
                <HeartIconSolid className={iconClassName} />
              )
            ) : isGM ? (
              <SunIcon className={iconClassName} />
            ) : (
              <HeartIcon className={iconClassName} />
            )}
          </Tooltip>
        </div>
      </motion.button>
      {count > 0 && !showCount && !hideLikesCount && (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      )}
    </div>
  );
};

export default Like;
