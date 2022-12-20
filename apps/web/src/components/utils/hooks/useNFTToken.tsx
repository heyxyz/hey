import axios from 'axios';
import { ALCHEMY_KEY } from 'data/constants';
import { useEffect, useState } from 'react';

interface Props {
  address: string;
  chainId: number;
  enabled?: boolean;
}

const useNFTToken = ({ address, chainId, enabled }: Props): { data: any; error: any } => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const loadAsyncStuff = async () => {
      try {
        const response = await axios({
          method: 'GET',
          url: `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_KEY}/getContractMetadata`,
          params: { contractAddress: address }
        });
        setData(response.data);
      } catch (error: any) {
        setError(error);
      }
    };

    loadAsyncStuff();
  }, []);

  return { data, error };
};

export default useNFTToken;
