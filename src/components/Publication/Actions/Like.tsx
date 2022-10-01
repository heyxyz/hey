import { ApolloCache, useMutation } from '@apollo/client';
import { Tooltip } from '@components/UI/Tooltip';
import { LensterPublication } from '@generated/lenstertypes';
import { AddReactionDocument, Mutation, ReactionTypes, RemoveReactionDocument } from '@generated/types';
import { HeartIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { publicationKeyFields } from '@lib/keyFields';
import { Mixpanel } from '@lib/mixpanel';
import nFormatter from '@lib/nFormatter';
import onError from '@lib/onError';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: LensterPublication;
  isFullPublication: boolean;
}

const Like: FC<Props> = ({ publication, isFullPublication }) => {
  const isMirror = publication.__typename === 'Mirror';
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [liked, setLiked] = useState(
    (isMirror ? publication?.mirrorOf?.reaction : publication?.reaction) === 'UPVOTE'
  );
  const [count, setCount] = useState(
    isMirror ? publication?.mirrorOf?.stats?.totalUpvotes : publication?.stats?.totalUpvotes
  );

  const updateCache = (cache: ApolloCache<any>, type: ReactionTypes.Upvote | ReactionTypes.Downvote) => {
    cache.modify({
      id: publicationKeyFields(isMirror ? publication?.mirrorOf : publication),
      fields: {
        reaction: () => type,
        stats: (stats) => ({
          ...stats,
          totalUpvotes: type === ReactionTypes.Upvote ? stats.totalUpvotes + 1 : stats.totalUpvotes - 1
        })
      }
    });
  };

  const [addReaction] = useMutation<Mutation>(AddReactionDocument, {
    onCompleted: () => {
      Mixpanel.track(PUBLICATION.LIKE);
    },
    onError: (error) => {
      setLiked(!liked);
      setCount(count - 1);
      onError(error);
    },
    update: (cache) => updateCache(cache, ReactionTypes.Upvote)
  });

  const [removeReaction] = useMutation<Mutation>(RemoveReactionDocument, {
    onCompleted: () => {
      Mixpanel.track(PUBLICATION.DISLIKE);
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
          reaction: 'UPVOTE',
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

  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={createLike} aria-label="Like">
      <div className="flex items-center space-x-1 text-pink-500">
        <div className="p-1.5 rounded-full hover:bg-pink-300 hover:bg-opacity-20">
          <Tooltip placement="top" content={liked ? 'Unlike' : 'Like'} withDelay>
            {liked ? <HeartIconSolid className={iconClassName} /> : <HeartIcon className={iconClassName} />}
          </Tooltip>
        </div>
        {count > 0 && !isFullPublication && <div className="text-[11px] sm:text-xs">{nFormatter(count)}</div>}
      </div>
    </motion.button>
  );
};

export default Like;
