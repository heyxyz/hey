import { HEY_API_URL, IS_MAINNET } from "@hey/data/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import HeyAccount from "./HeyAccount";
import HeyNft from "./HeyNft";

const GET_IS_HEY_ACCOUNT_QUERY_KEY = "getIsHeyAccount";
const GET_HAS_HEY_NFT_QUERY_KEY = "getHasHeyNft";

interface BadgesProps {
  id: string;
}

const Badges: FC<BadgesProps> = ({ id }) => {
  // Begin: Get isHeyAccount
  const getIsHeyAccount = async (): Promise<boolean> => {
    const { data } = await axios.get(`${HEY_API_URL}/badges/isHeyAccount`, {
      params: { id }
    });

    return data?.isHeyAccount || false;
  };

  const { data: isHeyAccount } = useQuery({
    queryFn: getIsHeyAccount,
    queryKey: [GET_IS_HEY_ACCOUNT_QUERY_KEY, id]
  });
  // End: Get isHeyAccount

  // Begin: Check has Hey NFT
  const getHasHeyNft = async (): Promise<boolean> => {
    const { data } = await axios.get(`${HEY_API_URL}/badges/hasHeyNft`, {
      params: { id }
    });

    return data?.hasHeyNft || false;
  };

  const { data: hasHeyNft } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getHasHeyNft,
    queryKey: [GET_HAS_HEY_NFT_QUERY_KEY, id]
  });
  // End: Check has Hey NFT

  const hasBadges = isHeyAccount || hasHeyNft;

  if (!hasBadges) {
    return null;
  }

  return (
    <>
      <div className="divider w-full" />
      <div className="flex flex-wrap gap-3">
        {isHeyAccount && <HeyAccount />}
        {hasHeyNft && <HeyNft />}
      </div>
    </>
  );
};

export default Badges;
