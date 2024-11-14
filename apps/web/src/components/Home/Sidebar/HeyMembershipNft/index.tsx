import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME, HEY_API_URL } from "@hey/data/constants";
import { MISCELLANEOUS, POST } from "@hey/data/tracking";
import { Button, Card, H5, Modal } from "@hey/ui";
import axios from "axios";
import type { FC } from "react";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import Mint from "./Mint";

const HeyMembershipNft: FC = () => {
  const {
    hasDismissedOrMintedMembershipNft,
    setHasDismissedOrMintedMembershipNft
  } = usePreferencesStore();
  const [showMintModal, setShowMintModal] = useState(false);

  if (hasDismissedOrMintedMembershipNft) {
    return null;
  }

  const handleUpdateHeyMemberNftStatus = () => {
    toast.promise(
      axios.post(`${HEY_API_URL}/preferences/updateNftStatus`, undefined, {
        headers: getAuthApiHeaders()
      }),
      {
        error: "Error updating.",
        loading: "Updating...",
        success: () => {
          setHasDismissedOrMintedMembershipNft(true);
          setShowMintModal(false);
          return "Updated!";
        }
      }
    );
  };

  return (
    <Card as="aside" className="ld-text-gray-500 mb-4">
      <img
        alt="Hey NFT"
        className="h-48 w-full rounded-t-xl object-cover"
        src="https://ipfs.decentralized-content.com/ipfs/bafybeib6infyovvtawokys4ejjr4r3qk4soy7jqriejp2wbmttedupsy64"
      />
      <div className="p-5">
        <H5 className="mb-1">Hey! Grab your special {APP_NAME} NFT here.</H5>
        <p className="mb-4">
          New or OG, this NFT's for our epic times together. Let's keep the vibe
          alive!
        </p>
        <div className="flex flex-col items-center space-y-1.5">
          <Button
            className="w-full"
            onClick={() => {
              setShowMintModal(true);
              Leafwatch.track(POST.COLLECT_MODULE.OPEN_COLLECT, {
                from: "mint_membership_nft"
              });
            }}
            outline
          >
            Mint now
          </Button>
          <Modal
            onClose={() => setShowMintModal(false)}
            show={showMintModal}
            title={`Special ${APP_NAME} NFT`}
          >
            <Mint onCollectSuccess={handleUpdateHeyMemberNftStatus} />
          </Modal>
          <button
            className="text-sm underline"
            onClick={() => {
              handleUpdateHeyMemberNftStatus();
              Leafwatch.track(MISCELLANEOUS.DISMISSED_MEMBERSHIP_NFT_BANNER);
            }}
            type="button"
          >
            Dismiss
          </button>
        </div>
      </div>
    </Card>
  );
};

export default memo(HeyMembershipNft);
