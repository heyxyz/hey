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
import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useReactionStore } from 'src/store/OptimisticActions/useReactionStore';

interface LikeProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Like: FC<LikeProps> = ({ publication, showCount }) => {
  const { pathname } = useRouter();
  const { getReactionCountByPublicationId, hasReactedByMe, setReactionConfig } =
    useReactionStore();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const hasReacted = hasReactedByMe(targetPublication.id);
  const reactionCount = getReactionCountByPublicationId(targetPublication.id);

  useEffect(() => {
    if (targetPublication.stats.countOpenActions) {
      setReactionConfig(targetPublication.id, {
        countReaction: targetPublication.stats.reactions,
        reacted: targetPublication.operations.hasReacted
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);

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
      setReactionConfig(targetPublication.id, {
        countReaction: reactionCount - 1,
        reacted: !hasReacted
      });
      onError(error);
    }
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => Leafwatch.track(PUBLICATION.UNLIKE, eventProperties),
    onError: (error) => {
      setReactionConfig(targetPublication.id, {
        countReaction: reactionCount + 1,
        reacted: !hasReacted
      });
      onError(error);
    }
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

    if (hasReacted) {
      setReactionConfig(targetPublication.id, {
        countReaction: reactionCount - 1,
        reacted: false
      });
      removeReaction({ variables: { request } });
    } else {
      setReactionConfig(targetPublication.id, {
        countReaction: reactionCount + 1,
        reacted: true
      });
      addReaction({ variables: { request } });
    }
  };

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div
      className={cn(
        hasReacted ? 'text-brand-500' : 'lt-text-gray-500',
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
            hasReacted ? 'hover:bg-brand-300/20' : 'hover:bg-gray-300/20',
            'rounded-full p-1.5'
          )}
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
        </div>
      </motion.button>
      {reactionCount > 0 && !showCount ? (
        <span className="text-[11px] sm:text-xs">
          {nFormatter(reactionCount)}
        </span>
      ) : null}
    </div>
  );
};

export default Like;
