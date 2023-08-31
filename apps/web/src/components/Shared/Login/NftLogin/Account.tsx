import { TokenboundClient } from '@tokenbound/sdk';
import { type FC, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useEffectOnce } from 'usehooks-ts';
import { useWalletClient } from 'wagmi';

interface TbaAccountProps {
  nft: any;
}

const TbaAccount: FC<TbaAccountProps> = ({ nft }) => {
  const [hasDeployed, setHasDeployed] = useState(false);
  const { data: walletClient } = useWalletClient({ chainId: CHAIN_ID });

  const tokenboundClient = new TokenboundClient({
    signer: walletClient,
    chainId: CHAIN_ID
  });

  useEffectOnce(() => {
    tokenboundClient
      .checkAccountDeployment({
        accountAddress: tokenboundClient.getAccount({
          tokenContract: nft.contract as `0x${string}`,
          tokenId: nft.tokenId
        })
      })
      .then((res) => setHasDeployed(res));
  });

  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col">
        <div className="text-sm font-bold">NFT #{nft.tokenId}</div>
        <div className="text-xs text-gray-500">{nft.contract}</div>
        {JSON.stringify(hasDeployed)}
      </div>
    </div>
  );
};

export default TbaAccount;
