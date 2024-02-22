import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';
import type { Nft } from '@hey/types/misc';
import type { ActionData } from 'nft-openaction-kit';
import type { Address } from 'viem';

import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { TipIcon } from '@hey/icons';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import Link from 'next/link';
import { type FC, useState } from 'react';
import { CHAIN } from 'src/constants';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { useUpdateEffect } from 'usehooks-ts';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import DecentAction from './DecentAction';

interface DecentOpenActionModuleProps {
  actionData?: ActionData;
  module: UnknownOpenActionModuleSettings;
  nft: Nft;
  publication: MirrorablePublication;
}

const DecentOpenActionModule: FC<DecentOpenActionModuleProps> = ({
  actionData,
  module,
  nft,
  publication
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken>({
    contractAddress: DEFAULT_COLLECT_TOKEN,
    decimals: 18,
    id: 'WMATIC',
    name: 'Wrapped MATIC',
    symbol: 'WMATIC'
  });
  const [usdPrice, setUsdPrice] = useState(0);

  const { address } = useAccount();

  const getUsdPrice = async () => {
    const usdPrice = await getRedstonePrice('MATIC');
    setUsdPrice(usdPrice);
  };

  useUpdateEffect(() => {
    getUsdPrice();
  }, [selectedCurrency]);

  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: selectedCurrency?.contractAddress as Address
  });

  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    signlessApproved: false, // TODO: module.signlessApproved
    successToast: 'Initiated cross-chain NFT mint!'
  });

  const act = async () => {
    if (actionData && publication) {
      return await actOnUnknownOpenAction({
        address: VerifiedOpenActionModules.DecentNFT as `0x${string}`,
        data: actionData.actArguments.actionModuleData,
        publicationId: publication.id
      });
    }
  };

  const balance = balanceData
    ? parseFloat(
        formatUnits(balanceData.value, selectedCurrency?.decimals as number)
      ).toFixed(2)
    : 0;

  /* 
  if (loadingAllowedTokens) {
    return (
      <div className="m-5">
        <Loader message="Loading..." />
      </div>
    );
  } */

  const formattedPrice = actionData
    ? (
        actionData.actArgumentsFormatted.paymentToken.amount /
        BigInt(10 ** selectedCurrency.decimals)
      ).toString()
    : '0';

  return (
    <div className="space-y-3 p-5">
      <div className="space-y-2 pb-4">
        <div className="text-sm font-bold">{actionData?.uiData.nftName}</div>
        {/*         {actionData?.uiData.nftCreatorAddress ? (
          <MintedBy
            address={actionData?.uiData.nftCreatorAddress as `0x${string}`}
          />
        ) : null} */}
        <img
          alt={actionData?.uiData.nftName}
          className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
          src={sanitizeDStorageUrl(actionData?.uiData.nftUri)}
        />
        <Link href={nft.sourceUrl} rel="noopener noreferrer" target="_blank">
          <div>View on Pods</div>
        </Link>
      </div>
      <div className="flex items-center justify-between pb-4">
        <div className="space-y-0.5">
          <span className="space-x-1 text-2xl">Price</span>
          <div className="ld-text-gray-500 text-sm">
            $
            {(Number(formattedPrice) * usdPrice).toFixed(
              selectedCurrency?.symbol === 'WETH' ? 4 : 2
            )}{' '}
          </div>
        </div>
        <div className="flex w-5/12 flex-col items-end space-y-1">
          {formattedPrice} {selectedCurrency?.symbol}
          {/*          <Select
            defaultValue={DEFAULT_COLLECT_TOKEN}
            onChange={(e) => {
              setSelectedCurrency(
                allowedTokens?.find(
                  (token) => token.contractAddress === e.target.value
                ) as AllowedToken
              );
            }}
            options={allowedTokens?.map((token) => ({
              label: token.name,
              value: token.contractAddress
            }))}
          /> */}
          <div className="ld-text-gray-500 text-sm">Balance: {balance}</div>
        </div>
      </div>
      {selectedCurrency ? (
        <DecentAction
          act={act}
          className="mt-5 w-full justify-center"
          icon={<TipIcon className="size-4" />}
          isLoading={isLoading}
          module={module}
          moduleAmount={{
            asset: {
              contract: {
                address: selectedCurrency.contractAddress,
                chainId: CHAIN.id
              },
              decimals: selectedCurrency.decimals,
              name: selectedCurrency.name,
              symbol: selectedCurrency.symbol
            },
            value: formattedPrice
          }}
          title="Mint NFT"
        />
      ) : null}
    </div>
  );
};

export default DecentOpenActionModule;
