import Mint from '@components/Publication/OpenActions/Nft/ZoraNft/Mint';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { MISCELLANEOUS, PUBLICATION } from '@hey/data/tracking';
import type { MembershipNft } from '@hey/types/hey';
import { Button, Card, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import useZoraNft from 'src/hooks/zora/useZoraNft';
import { useAppStore } from 'src/store/app';
import { useQuery } from 'wagmi';

const HeyMembershipNft: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showMintModal, setShowMintModal] = useState(false);

  const { data: nft, loading } = useZoraNft({
    chain: 'zora',
    address: '0x8fcfdad5ebdd1ce815aa769bbd7499091ac056d1',
    token: ''
  });

  const fetchPreferences = async (): Promise<MembershipNft> => {
    const response = await axios.get(
      `${PREFERENCES_WORKER_URL}/getHeyMemberNftStatus/${currentProfile?.ownedBy}`
    );
    const { data } = response;

    return data.result;
  };

  const { data, isLoading, refetch } = useQuery(
    ['getHeyMemberNftStatus', currentProfile?.id],
    () => fetchPreferences(),
    { enabled: Boolean(currentProfile?.id) }
  );

  if (isLoading) {
    return null;
  }

  const dismissedOrMinted = data?.dismissedOrMinted;

  if (dismissedOrMinted) {
    return null;
  }

  const updateHeyMemberNftStatus = async () => {
    try {
      toast.promise(
        axios.post(
          `${PREFERENCES_WORKER_URL}/updateHeyMemberNftStatus`,
          {
            id: currentProfile?.ownedBy,
            dismissedOrMinted: true
          },
          {
            headers: {
              'X-Access-Token': localStorage.getItem(Localstorage.AccessToken)
            }
          }
        ),
        {
          loading: t`Updating...`,
          success: () => {
            refetch();
            setShowMintModal(false);
            return t`Updated!`;
          },
          error: t`Error updating.`
        }
      );
    } catch {}
  };

  return (
    <Card
      as="aside"
      className="text-brand dark:bg-brand-10/50 !border-brand-500 !bg-brand-50 mb-4"
    >
      <img
        src="https://ipfs.decentralized-content.com/ipfs/bafybeib6infyovvtawokys4ejjr4r3qk4soy7jqriejp2wbmttedupsy64"
        alt="Gitcoin emoji"
        className="h-48 w-full rounded-t-xl object-cover"
      />
      <div className="p-5">
        <div className="mb-1 font-bold">
          <Trans>Hey Buddy! Grab your special Hey NFT Here.</Trans>
        </div>
        <div className="text-brand-400 mb-4">
          <Trans>
            New or OG, this NFT's for our epic times together. Let's keep the
            vibe alive!
          </Trans>
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
            <Trans>Mint now</Trans>
          </Button>
          <Modal
            title={t`Mint`}
            show={showMintModal}
            icon={<CursorArrowRaysIcon className="text-brand h-5 w-5" />}
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
