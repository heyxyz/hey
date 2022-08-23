import { gql, useMutation } from '@apollo/client';
import { Tooltip } from '@components/UI/Tooltip';
import { LensterPublication } from '@generated/lenstertypes';
import { Mutation } from '@generated/types';
import { HeartIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import humanize from '@lib/humanize';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import { motion } from 'framer-motion';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SIGN_WALLET } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';

const ADD_REACTION_MUTATION = gql`
  mutation AddReaction($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`;

const REMOVE_REACTION_MUTATION = gql`
  mutation RemoveReaction($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`;

interface Props {
  publication: LensterPublication;
}

const Like: FC<Props> = ({ publication }) => {
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (publication?.mirrorOf?.stats?.totalUpvotes || publication?.stats?.totalUpvotes) {
      const reactionCount =
        publication.__typename === 'Mirror'
          ? publication?.mirrorOf?.stats?.totalUpvotes
          : publication?.stats?.totalUpvotes;
      const reaction =
        publication.__typename === 'Mirror' ? publication?.mirrorOf?.reaction : publication?.reaction;

      setCount(reactionCount);
      setLiked(reaction === 'UPVOTE');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [addReaction] = useMutation<Mutation>(ADD_REACTION_MUTATION, {
    onCompleted: () => {
      Mixpanel.track(PUBLICATION.LIKE);
    },
    onError: (error) => {
      setLiked(!liked);
      setCount(count - 1);
      onError(error);
    }
  });

  const [removeReaction] = useMutation<Mutation>(REMOVE_REACTION_MUTATION, {
    onCompleted: () => {
      Mixpanel.track(PUBLICATION.DISLIKE);
    },
    onError: (error) => {
      setLiked(!liked);
      setCount(count + 1);
      onError(error);
    }
  });

  const createLike = () => {
    if (!isAuthenticated) {
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

  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={createLike} aria-label="Like">
      <div className="flex items-center space-x-1 text-pink-500">
        <div className="p-1.5 rounded-full hover:bg-pink-300 hover:bg-opacity-20">
          <Tooltip placement="top" content={liked ? 'Unlike' : 'Like'} withDelay>
            {liked ? (
              <HeartIconSolid className="w-[15px] sm:w-[18px]" />
            ) : (
              <HeartIcon className="w-[15px] sm:w-[18px]" />
            )}
          </Tooltip>
        </div>
        {count > 0 && <div className="text-[11px] sm:text-xs">{humanize(count)}</div>}
      </div>
    </motion.button>
  );
};

export default Like;
