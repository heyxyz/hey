import type {
  MirrorablePublication,
  Profile,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';
import type { Nft } from '@hey/types/misc';
import type { ActionData } from 'nft-openaction-kit';
import type { Address } from 'viem';

import {
  ArrowTopRightOnSquareIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  UserIcon
} from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { TipIcon } from '@hey/icons';
import { useDefaultProfileQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import truncateByWords from '@hey/lib/truncateByWords';
import Link from 'next/link';
import { type FC, useEffect, useState } from 'react';
import { CHAIN } from 'src/constants';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import DecentAction from './DecentAction';

// TODO: Get description from NFT Metadata
const MOCK_DESCRIPTION =
  "I moved to Williamsburg because I needed a place to stay, but I'm staying because it's the web3 hub of NYC.  If you need an activity that isn't drinking or eating in NYC and you're not a tourist, you're probably going to Williamsburg.  I'm a big fan of the area and I'm excited to share my favorite spots with you. I moved to Williamsburg because I needed a place to stay, but I'm staying because it's the web3 hub of NYC.  If you need an activity that isn't drinking or eating in NYC and you're not a tourist, you're probably going to Williamsburg.  I'm a big fan of the area and I'm excited to share my favorite spots with you.";

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

  useEffect(() => {
    getUsdPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const { data: creatorProfileData } = useDefaultProfileQuery({
    skip: !actionData?.uiData.nftCreatorAddress,
    variables: { request: { for: actionData?.uiData.nftCreatorAddress } }
  });

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

  const formattedNftSchema = nft.schema === 'erc1155' ? 'ERC-1155' : 'ERC-721';

  const [showLongDescription, setShowLongDescription] = useState(false);

  // TODO: integrate selected quantity to the action
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  return (
    <>
      <div className="space-y-2 p-5">
        <div>
          <h2 className="text-xl">{actionData?.uiData.nftName}</h2>
          {creatorProfileData ? (
            <p className="text-black/50">
              by {getProfile(creatorProfileData.defaultProfile as Profile).slug}
            </p>
          ) : null}
        </div>
        <div className="pt-2">
          <img
            alt={actionData?.uiData.nftName}
            className="aspect-[1.5] max-h-[350px] w-full rounded-xl object-cover"
            src={sanitizeDStorageUrl(actionData?.uiData.nftUri)}
          />
          <p className="my-5">
            {showLongDescription
              ? MOCK_DESCRIPTION
              : truncateByWords(MOCK_DESCRIPTION, 30)}
            <button
              className="ml-1 text-black/50"
              onClick={() => setShowLongDescription((v) => !v)}
            >
              {showLongDescription ? 'Show less' : 'read more'}
            </button>
          </p>
        </div>
        <div className="flex items-center justify-between !text-base text-gray-500">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="w-5" />
            <p>{formattedNftSchema}</p>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-5" />
            <p>{nft.mintCount} minted</p>
          </div>
          <div className="flex items-center gap-2">
            <ArrowTopRightOnSquareIcon className="w-5" />
            <Link
              href={nft.mintUrl ?? ''}
              rel="noreferrer noopener"
              target="_blank"
            >
              Open in {actionData?.uiData.platformName}
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-y border-zinc-200 px-5 py-4">
        <p className="text-gray-500">Quantity</p>
        <div className="flex items-center gap-4">
          <button
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
            disabled={selectedQuantity === 1}
            onClick={() => setSelectedQuantity((v) => v - 1)}
          >
            <MinusIcon className="w-3 text-gray-600" strokeWidth={3} />
          </button>
          <span className="w-4 text-center">{selectedQuantity}</span>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-40"
            onClick={() => setSelectedQuantity((v) => v + 1)}
          >
            <PlusIcon className="w-3 text-gray-600" strokeWidth={3} />
          </button>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between">
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
            className="w-full justify-center"
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
    </>
  );
};

export default DecentOpenActionModule;
