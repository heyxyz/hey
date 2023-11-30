import Mint from '@components/Publication/HeyOpenActions/Nft/ZoraNft/Mint';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { MISCELLANEOUS, PUBLICATION } from '@hey/data/tracking';
import { Button, Card, Modal } from '@hey/ui';
import useZoraNft from '@hooks/zora/useZoraNft';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'wagmi';
import useZoraNft from '@hooks/zora/useZoraNft';
import useProfileStore from '@persisted/useProfileStore';

const HeyMembershipNft: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [showMintModal, setShowMintModal] = useState(false);

  const { data: nft, loading } = useZoraNft({
    chain: 'zora',
    address: '0x8fcfdad5ebdd1ce815aa769bbd7499091ac056d1',
    token: ''
  });

  const getHeyMemberNftStatus = async (): Promise<boolean> => {
    const response = await axios.get(
      `${HEY_API_URL}/preference/getHeyMemberNftStatus`,
      { params: { id: currentProfile?.id } }
    );
    const { data } = response;

    return data.result.dismissedOrMinted;
  };

  const {
    data: dismissedOrMinted,
    isLoading,
    refetch
  } = useQuery(['getHeyMemberNftStatus', currentProfile?.id], () =>
    getHeyMemberNftStatus()
  );

  if (isLoading || dismissedOrMinted) {
    return null;
  }

  const updateHeyMemberNftStatus = async () => {
    try {
      toast.promise(
        axios.post(
          `${HEY_API_URL}/preference/updateHeyMemberNftStatus`,
          undefined,
          { headers: getAuthWorkerHeaders() }
        ),
        {
          loading: 'Updating...',
          success: () => {
            setShowMintModal(false);
            refetch();
            location.reload();
            return 'Updated!';
          },
          error: 'Error updating.'
        }
      );
    } catch {}
  };

  return (
    <Card
      as="aside"
      className="text-brand-500 dark:bg-brand-10/50 !border-brand-500 !bg-brand-50 mb-4"
    >
      <img
        src="https://ipfs.decentralized-content.com/ipfs/bafybeib6infyovvtawokys4ejjr4r3qk4soy7jqriejp2wbmttedupsy64"
        alt="Gitcoin emoji"
        className="h-48 w-full rounded-t-xl object-cover"
      />
      <div className="p-5">
        <div className="mb-1 font-bold">
          Hey Buddy! Grab your special Hey NFT Here.
        </div>
        <div className="text-brand-400 mb-4">
          New or OG, this NFT's for our epic times together. Let's keep the vibe
          alive!
        </div>
        <div className="flex flex-col items-center space-y-1.5">
          <Button
            className="w-full"
            onClick={() => {
              setShowMintModal(true);
              Leafwatch.track(PUBLICATION.OPEN_ACTIONS.ZORA_NFT.OPEN_MINT, {
                from: 'mint_membership_nft'
              });
            }}
            disabled={loading}
          >
            Mint now
          </Button>
          <Modal
            title="Mint"
            show={showMintModal}
            icon={<CursorArrowRaysIcon className="text-brand-500 h-5 w-5" />}
            onClose={() => setShowMintModal(false)}
          >
            <Mint
              nft={nft}
              zoraLink="https://zora.co/collect/zora:0x8fcfdad5ebdd1ce815aa769bbd7499091ac056d1"
              onCompleted={updateHeyMemberNftStatus}
            />
          </Modal>
          <button
            className="text-sm underline"
            onClick={() => {
              Leafwatch.track(MISCELLANEOUS.DISMISSED_MEMBERSHIP_NFT_BANNER);
              updateHeyMemberNftStatus();
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </Card>
  );
};

export default HeyMembershipNft;
