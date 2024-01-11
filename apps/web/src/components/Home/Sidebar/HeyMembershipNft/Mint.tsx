import type { Post } from '@hey/lens';
import type { FC } from 'react';

import CollectAction from '@components/Publication/LensOpenActions/CollectModule/CollectAction';
import Loader from '@components/Shared/Loader';
import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import { usePublicationQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

interface MintProps {
  setShowMintModal: (show: boolean) => void;
}

const Mint: FC<MintProps> = ({ setShowMintModal }) => {
  const setHasDismissedOrMintedMembershipNft = usePreferencesStore(
    (state) => state.setHasDismissedOrMintedMembershipNft
  );

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

  const updateHeyMemberNftStatus = async () => {
    try {
      toast.promise(
        axios.post(`${HEY_API_URL}/preferences/updateNftStatus`, undefined, {
          headers: getAuthApiHeaders()
        }),
        {
          error: 'Error updating.',
          loading: 'Updating...',
          success: () => {
            setHasDismissedOrMintedMembershipNft(true);
            setShowMintModal(false);
            return 'Updated!';
          }
        }
      );
    } catch {}
  };

  return (
    <div className="p-5">
      <CollectAction
        countOpenActions={0}
        forceShowCollect
        onCollectSuccess={updateHeyMemberNftStatus}
        openAction={openAction}
        publication={publication}
      />
    </div>
  );
};

export default Mint;
