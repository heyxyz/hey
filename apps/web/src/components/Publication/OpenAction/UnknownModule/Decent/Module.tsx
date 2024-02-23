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
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  UserIcon
} from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { useDefaultProfileQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import truncateByWords from '@hey/lib/truncateByWords';
import { HelpTooltip } from '@hey/ui';
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

const TOOLTIP_PRICE_HELP =
  'You don’t have enough native Zora ETH so we switched you to the next token with the lowest gas that you have enough of (lol)';
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

  const formattedPrice = (
    actionData
      ? actionData.actArgumentsFormatted.paymentToken.amount /
        BigInt(10 ** selectedCurrency.decimals)
      : BigInt(0)
  ).toString();
  const formattedTotalFees = (
    actionData
      ? actionData.actArgumentsFormatted.bridgeFee.amount /
        BigInt(10 ** selectedCurrency.decimals)
      : BigInt(0)
  ).toString();

  const formattedTotalPrice = (
    BigInt(formattedPrice) + BigInt(formattedTotalFees)
  ).toString();

  const formattedNftSchema = nft.schema === 'erc1155' ? 'ERC-1155' : 'ERC-721';

  const [showLongDescription, setShowLongDescription] = useState(false);
  const [showFees, setShowFees] = useState(false);

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
        <div className="ld-text-gray-500 flex items-center justify-between text-base">
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
        <p className="ld-text-gray-500">Quantity</p>
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
        <div>
          <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
            <span className="space-x-1">Price</span>
            <div>
              {formattedPrice} {selectedCurrency?.symbol}
            </div>
          </div>
          <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
            <button
              className="flex items-baseline gap-1 space-x-1"
              onClick={() => setShowFees((v) => !v)}
            >
              Fees <ChevronDownIcon className="w-2" strokeWidth={3} />
            </button>
            <div>
              {formattedTotalFees} {selectedCurrency?.symbol}
            </div>
          </div>
          {showFees ? (
            <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
              <span className="space-x-1">Mint Fee</span>
              <div>
                {0.01} {selectedCurrency?.symbol}
              </div>
            </div>
          ) : null}
          {showFees ? (
            <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
              <span className="space-x-1">Platform Fee</span>
              <div>
                {0.002} {selectedCurrency?.symbol}
              </div>
            </div>
          ) : null}
          <div className="mt-4 flex items-start justify-between space-y-0.5 text-xl text-gray-600">
            <span className="flex items-baseline justify-start gap-1 space-x-1">
              Total{' '}
              <HelpTooltip>
                <div className="w-[210px] px-2 py-3 leading-tight">
                  {TOOLTIP_PRICE_HELP}
                </div>
              </HelpTooltip>
            </span>
            <div className="flex flex-col items-end">
              <p>
                {formattedTotalPrice} {selectedCurrency?.symbol}
              </p>
              <div className="ld-text-gray-500 text-sm">
                ~$
                {(Number(formattedPrice) * usdPrice).toFixed(
                  selectedCurrency?.symbol === 'WETH' ? 4 : 2
                )}{' '}
              </div>
            </div>
          </div>
        </div>
        {selectedCurrency ? (
          <DecentAction
            act={act}
            className="w-full justify-center"
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
            title={`Pay with ${formattedPrice} ${selectedCurrency.symbol}`}
          />
        ) : null}
      </div>
    </>
  );
};

export default DecentOpenActionModule;
