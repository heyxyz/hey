import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { ZoraERC721Drop } from '@lenster/abis';
import { ADMIN_ADDRESS } from '@lenster/data/constants';
import type { ZoraNft } from '@lenster/types/zora-nft';
import { Button } from '@lenster/ui';
import { type FC } from 'react';
import { useAppStore } from 'src/store/app';
import { type BaseError, parseEther } from 'viem';
import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';

interface MintProps {
  nft: ZoraNft;
}

const Mint: FC<MintProps> = ({ nft }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const chain = useChainId();

  const erc721Address = nft.address;
  const recipient = currentProfile?.ownedBy;
  const quantity = 3n;
  const comment = 'Minted via Lenster';
  const mintReferral = ADMIN_ADDRESS;
  const mintFee = parseEther('0.000777');

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    chainId: nft.chainId,
    abi: ZoraERC721Drop,
    address: erc721Address,
    functionName: 'mintWithRewards',
    args: [recipient, quantity, comment, mintReferral],
    value: mintFee * quantity
  });
  const { write, data, error, isLoading, isError } = useContractWrite(config);
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess
  } = useWaitForTransaction({ chainId: nft.chainId, hash: data?.hash });

  return (
    <div className="space-y-3 p-5">
      {chain !== nft.chainId ? (
        <SwitchNetwork toChainId={nft.chainId} />
      ) : (
        <Button disabled={!write} onClick={() => write?.()}>
          Mint
        </Button>
      )}
      <div className="text-sm text-red-500">
        {isPrepareError && <div>{prepareError?.message}</div>}
        {isLoading && <div>Check wallet...</div>}
        {isPending && <div>Transaction pending...</div>}
        {isSuccess && (
          <>
            <div>Transaction Hash: {data?.hash}</div>
            <div>
              Transaction Receipt: <pre>{JSON.stringify(receipt)}</pre>
            </div>
          </>
        )}
        {isError && <div>{(error as BaseError)?.shortMessage}</div>}
      </div>
    </div>
  );
};

export default Mint;
