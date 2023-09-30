import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { MISCELLANEOUS } from '@hey/data/tracking';
import type { MembershipNft } from '@hey/types/hey';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useQuery } from 'wagmi';

const HeyMembershipNft: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showMintModal, setShowMintModal] = useState(false);

  const fetchPreferences = async (): Promise<MembershipNft> => {
    const response = await axios.get(
      `${PREFERENCES_WORKER_URL}/getHeyMemberNftStatus/${currentProfile?.id}`
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
            id: currentProfile?.id,
            dismissedOrMinted: true
          },
          {
            headers: {
              'X-Access-Token': localStorage.getItem(Localstorage.AccessToken)
            }
          }
        ),
        {
          loading: 'Updating...',
          success: () => {
            refetch();
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
      className="text-brand dark:bg-brand-10/50 !border-brand-500 !bg-brand-50 mb-4"
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
          Because you're part of the Hey crew. This NFT's for all our awesome
          moments together!
        </div>
        <div className="flex flex-col items-center space-y-1.5">
          <Button
            className="w-full"
            onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_GITCOIN)}
          >
            <Trans>Mint now</Trans>
          </Button>
          <button
            className="text-sm underline"
            onClick={updateHeyMemberNftStatus}
          >
            Dismiss
          </button>
        </div>
      </div>
    </Card>
  );
};

export default HeyMembershipNft;
