import type { Post } from '@hey/lens';
import type { FC } from 'react';

import CollectAction from '@components/Publication/LensOpenActions/CollectModule/CollectAction';
import Loader from '@components/Shared/Loader';
import { Errors } from '@hey/data';
import { usePublicationQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';

interface MintProps {
  onCollectSuccess: () => void;
}

const Mint: FC<MintProps> = ({ onCollectSuccess }) => {
  const { data, error, loading } = usePublicationQuery({
    variables: { request: { forId: '0x06-0x05' } }
  });

  if (loading) {
    return (
      <div className="m-5">
        <Loader message="Loading NFT" />
      </div>
    );
  }

  if (!data?.publication || error) {
    return (
      <ErrorMessage
        className="m-5"
        error={
          error || {
            message: Errors.SomethingWentWrong,
            name: 'Failed to load NFT'
          }
        }
        title="Failed to load NFT"
      />
    );
  }

  const publication = data?.publication as Post;
  const openAction = publication.openActionModules[0];

  return (
    <div className="p-5">
      <img
        className="mb-4 h-[350px] max-h-[350px] w-full rounded-xl border object-cover dark:border-gray-700"
        src="https://ipfs.decentralized-content.com/ipfs/bafybeib6infyovvtawokys4ejjr4r3qk4soy7jqriejp2wbmttedupsy64"
      />
      <div className="mt-5">
        <CollectAction
          className="!mt-0 w-full justify-center"
          countOpenActions={0}
          forceShowCollect
          onCollectSuccess={onCollectSuccess}
          openAction={openAction}
          publication={publication}
        />
      </div>
    </div>
  );
};

export default Mint;
