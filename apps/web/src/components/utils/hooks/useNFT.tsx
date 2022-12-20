import axios from 'axios';
import { ALCHEMY_KEY } from 'data/constants';
import { useEffect, useState } from 'react';

interface Props {
  address: string;
  chainId: number;
  enabled?: boolean;
}

const useNFT = ({ address, chainId, enabled }: Props): { data: any; error: any } => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const getAlchemyChainName = () => {
    switch (chainId) {
      case 1:
        return 'eth-mainnet';
      case 137:
        return 'polygon-mainnet';
      default:
        return 'eth-mainnet';
    }
  };

  const loadContractDetails = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://${getAlchemyChainName()}.g.alchemy.com/nft/v2/${ALCHEMY_KEY}/getContractMetadata`,
        params: { contractAddress: address }
      });
      setData(response.data);
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
  };

  useEffect(() => {
    if (!enabled) {
      return;
    }

    loadContractDetails();
  }, []);

  return { data, error };
};

export default useNFT;
