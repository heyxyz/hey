import type {
  MirrorablePublication,
  Profile,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';
import type { Nft, OptimisticTransaction } from '@hey/types/misc';
import type { ActionData } from 'nft-openaction-kit';
import type { Dispatch, FC } from 'react';
import type { Address } from 'viem';

import {
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  DEFAULT_DECENT_OA_TOKEN,
  MAX_UINT256,
  PERMIT_2_ADDRESS,
  ZERO_ADDRESS
} from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getNftChainId from '@hey/helpers/getNftChainId';
import getNftChainInfo from '@hey/helpers/getNftChainInfo';
import getProfile from '@hey/helpers/getProfile';
import {
  getPermit2Allowance,
  permit2SignatureAmount,
  signPermitSignature,
  updateWrapperParams
} from '@hey/helpers/permit2';
import sanitizeDStorageUrl from '@hey/helpers/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import truncateByWords from '@hey/helpers/truncateByWords';
import { useDefaultProfileQuery } from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Image, Modal } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useNftOaCurrencyStore } from 'src/store/persisted/useNftOaCurrencyStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';
import { parseAbi } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';

import CurrencySelector from './CurrencySelector';
import DecentAction from './DecentAction';
import FeesDisclosure from './FeesDisclosure';
import StepperApprovals from './StepperApprovals';

const generateOptimisticNftMintOA = ({
  txHash
}: {
  txHash?: string;
  txId?: string;
}): OptimisticTransaction => {
  return {
    txHash,
    type: OptmisticPublicationType.NftMintOA
  };
};

interface DecentOpenActionModuleProps {
  actionData?: ActionData;
  loadingCurrency?: boolean;
  module: UnknownOpenActionModuleSettings;
  nft: Nft;
  onClose: () => void;
  publication: MirrorablePublication;
  selectedQuantity: number;
  setSelectedQuantity: Dispatch<number>;
  show: boolean;
}

interface Permit2Data {
  deadline: number;
  nonce: number;
  signature: string;
}

const DecentOpenActionModule: FC<DecentOpenActionModuleProps> = ({
  actionData,
  loadingCurrency,
  nft,
  onClose,
  publication,
  selectedQuantity,
  setSelectedQuantity,
  show
}) => {
  const { selectedNftOaCurrency, setSelectedNftOaCurrency } =
    useNftOaCurrencyStore();
  const { addTransaction } = useTransactionStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { fiatRates } = useRatesStore();

  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [loadingCurrencyDetails, setLoadingCurrencyDetails] = useState(
    loadingCurrency || !allowedTokens || !allowedTokens.length
  );
  const [showLongDescription, setShowLongDescription] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [isModalCollapsed, setIsModalCollapsed] = useState(false);
  const [permit2Allowed, setPermit2Allowed] = useState(false);
  const [permit2Data, setPermit2Data] = useState<Permit2Data | undefined>();
  const [isPermit2Loading, setIsPermit2Loading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [prevImageUrl, setPrevImageUrl] = useState('');
  const [isImageLoading, setImageLoading] = useState(false);
  const [nftChainInfo, setNftChainInfo] = useState<{
    logo: string;
    name: string;
  } | null>(null);
  const [platformName, setPlatformName] = useState('');

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();

  const { actOnUnknownOpenAction, isLoading, relayStatus } =
    useActOnUnknownOpenAction({
      onSuccess: onClose,
      signlessApproved: true,
      successToast: 'NFT has been minted!'
    });

  const { data: creatorProfileData } = useDefaultProfileQuery({
    skip: !actionData?.uiData.nftCreatorAddress,
    variables: { request: { for: actionData?.uiData.nftCreatorAddress } }
  });

  useEffect(() => {
    if (allowedTokens && allowedTokens.length && !loadingCurrency) {
      return setLoadingCurrencyDetails(false);
    }

    return setLoadingCurrencyDetails(true);
  }, [allowedTokens, loadingCurrency]);

  useEffect(() => {
    if (relayStatus) {
      if (!relayStatus.startsWith('0x')) {
        addTransaction(generateOptimisticNftMintOA({ txId: relayStatus }));
      }
      localStorage.setItem(`pendingTx`, relayStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relayStatus]);

  useEffect(() => {
    if (nft?.mediaUrl) {
      const newImageUrl = sanitizeDStorageUrl(nft.mediaUrl);
      if (newImageUrl !== currentImageUrl) {
        setImageLoading(true);
        setPrevImageUrl(currentImageUrl);
        setCurrentImageUrl(newImageUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nft]);

  const usdPrice =
    fiatRates.find(
      (rate) => rate.address === selectedNftOaCurrency?.toLowerCase()
    )?.fiat || 0;

  // fees are always priced in MATIC
  const maticUsdPrice =
    fiatRates.find((rate) => rate.symbol === 'WMATIC')?.fiat || 0;

  const creatorProfileExists =
    creatorProfileData && creatorProfileData.defaultProfile;
  const creatorAddress = actionData?.uiData.nftCreatorAddress || ZERO_ADDRESS;

  const totalAmount = actionData
    ? BigInt(actionData.actArgumentsFormatted.paymentToken.amount) *
      BigInt(selectedQuantity)
    : BigInt(0);

  // Convert totalAmount to a number with decimals
  const getTokenDetails = (currencyAddress: Address) => {
    return (
      allowedTokens?.find((t) => t.contractAddress === currencyAddress) ||
      (DEFAULT_DECENT_OA_TOKEN as AllowedToken)
    );
  };
  const { decimals } = getTokenDetails(selectedNftOaCurrency);
  const formattedTotalAmount = Number(totalAmount) / Math.pow(10, decimals);

  const bridgeFee = actionData
    ? (actionData.actArgumentsFormatted.bridgeFeeNative * maticUsdPrice) /
      usdPrice
    : 0;

  const formattedTotalFees = bridgeFee + formattedTotalAmount * 0.05;
  const formattedNftSchema = nft.schema === 'erc1155' ? 'ERC-1155' : 'ERC-721';

  const amount = formattedTotalAmount || 0;
  const assetAddress = selectedNftOaCurrency;

  useEffect(() => {
    if (actionData?.uiData.dstChainId && nftChainInfo === null) {
      const chainIdStr = actionData.uiData.dstChainId.toString();
      const chainInfo = getNftChainInfo(getNftChainId(chainIdStr));
      setNftChainInfo({
        logo: chainInfo.logo,
        name: chainInfo.name
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData?.uiData.dstChainId]);

  useEffect(() => {
    if (actionData?.uiData.platformName && !platformName.length) {
      setPlatformName(actionData?.uiData.platformName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData?.uiData.dstChainId]);

  useEffect(() => {
    const fetchPermit2Allowance = async () => {
      setPermit2Data(undefined);
      if (address && Boolean(assetAddress)) {
        const allowanceData = await getPermit2Allowance({
          owner: address as `0x${string}`,
          spender: PERMIT_2_ADDRESS,
          token: assetAddress as `0x${string}`
        });
        const approvedAmount = allowanceData;
        if (Number(approvedAmount) > amount) {
          setPermit2Allowed(true);
        } else {
          setPermit2Allowed(false);
        }
      }
    };

    fetchPermit2Allowance();
  }, [amount, assetAddress, address]);

  const approvePermit2 = async () => {
    if (walletClient) {
      setIsPermit2Loading(true);
      try {
        await handleWrongNetwork();
        const hash = await walletClient.writeContract({
          abi: parseAbi(['function approve(address, uint256) returns (bool)']),
          address: assetAddress as `0x${string}`,
          args: [PERMIT_2_ADDRESS, MAX_UINT256],
          functionName: 'approve'
        });
        const allowanceData = await getPermit2Allowance({
          hash,
          owner: address as `0x${string}`,
          spender: PERMIT_2_ADDRESS,
          token: assetAddress as `0x${string}`
        });
        const approvedAmount = allowanceData;
        if (Number(approvedAmount) > amount) {
          setPermit2Allowed(true);
        } else {
          setPermit2Allowed(false);
        }
        setIsPermit2Loading(false);
      } catch (error) {
        setIsPermit2Loading(false);
        return toast.error('Failed to approve Permit2');
      }
    }
  };

  const approveOA = async () => {
    if (walletClient && actionData) {
      setIsApprovalLoading(true);
      try {
        const signatureAmount = permit2SignatureAmount({
          chainId: actionData.uiData.dstChainId,
          data: actionData.actArguments.actionModuleData
        });
        await handleWrongNetwork();
        const permit2Signature = await signPermitSignature(
          walletClient,
          signatureAmount,
          assetAddress as `0x${string}`
        );
        setPermit2Data({
          deadline: permit2Signature.deadline,
          nonce: permit2Signature.nonce,
          signature: permit2Signature.signature
        });
        setIsModalCollapsed(false);
        setIsApprovalLoading(false);
        setIsApproved(true);
      } catch (error) {
        setIsApprovalLoading(false);
        return toast.error('Failed to approve module');
      }
    }
  };

  const act = async () => {
    if (actionData && permit2Data) {
      try {
        const updatedCalldata = await updateWrapperParams({
          chainId: actionData.uiData.dstChainId,
          data: actionData.actArguments.actionModuleData,
          deadline: BigInt(permit2Data.deadline),
          nonce: BigInt(permit2Data.nonce),
          signature: permit2Data.signature as `0x${string}`
        });

        return await actOnUnknownOpenAction({
          address: VerifiedOpenActionModules.DecentNFT as `0x${string}`,
          data: updatedCalldata,
          publicationId: publication.id,
          referrers: actionData.actArguments.referrerProfileIds.map((id) => ({
            profileId: '0x' + id.toString(16).padStart(2, '0')
          }))
        });
      } catch (error) {
        return toast.error('Failed to mint NFT');
      }
    }
  };

  const handleImageLoaded = () => {
    setImageLoading(false);
    setPrevImageUrl('');
  };

  return (
    <Modal
      icon={
        showCurrencySelector ? (
          <button
            onClick={(e) => {
              stopEventPropagation(e);
              setShowCurrencySelector(false);
            }}
          >
            <ChevronLeftIcon className="mt-0.5 size-4 stroke-black" />
          </button>
        ) : isModalCollapsed ? (
          <button
            onClick={(e) => {
              stopEventPropagation(e);
              setIsModalCollapsed(false);
            }}
          >
            <ChevronLeftIcon className="mt-0.5 size-4 stroke-black" />
          </button>
        ) : null
      }
      onClose={() => {
        setIsModalCollapsed(false);
        onClose();
      }}
      show={show}
      title={
        showCurrencySelector
          ? 'Select token'
          : actionData?.uiData.platformName
            ? `Mint on ${actionData?.uiData.platformName}`
            : 'Mint NFT'
      }
    >
      {showCurrencySelector ? (
        <CurrencySelector
          onSelectCurrency={(currency) => {
            setSelectedNftOaCurrency(currency);
            setShowCurrencySelector(false);
          }}
        />
      ) : isModalCollapsed ? (
        <StepperApprovals
          approveOA={() => approveOA()}
          approvePermit2={() => approvePermit2()}
          isApprovalLoading={isApprovalLoading}
          isPermit2Loading={isPermit2Loading}
          nftDetails={{
            creator: getProfile(creatorProfileData?.defaultProfile as Profile)
              .slug,
            name: actionData?.uiData.nftName || '',
            price: formattedTotalAmount.toFixed(4),
            schema: formattedNftSchema,
            uri: sanitizeDStorageUrl(actionData?.uiData.nftUri)
          }}
          selectedCurrencySymbol={getTokenDetails(selectedNftOaCurrency).symbol}
          step={!permit2Allowed ? 'Permit2' : 'Allowance'}
        />
      ) : (
        <>
          <div className="space-y-2 p-5">
            <div>
              <b className="text-xl">{actionData?.uiData.nftName}</b>
              {creatorProfileData ? (
                <p className="ld-text-gray-500">
                  by{' '}
                  {creatorProfileExists
                    ? getProfile(creatorProfileData.defaultProfile as Profile)
                        .slug
                    : `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`}
                </p>
              ) : null}
            </div>
            <div className="pt-2">
              <div className="relative">
                {isImageLoading && prevImageUrl && (
                  <Image
                    alt="Loading..."
                    className="absolute aspect-[1.5] max-h-[350px] w-full rounded-xl object-contain"
                    src={prevImageUrl}
                  />
                )}
                <div className="relative h-[350px] max-h-[350px] w-full overflow-hidden rounded-xl">
                  <Image
                    alt={`Blurred background for ${nft.collectionName}`}
                    className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg filter"
                    src={currentImageUrl}
                  />
                  <Image
                    alt={nft.collectionName}
                    className={cn(
                      'relative aspect-[1.5] h-full w-full object-contain transition-opacity duration-500',
                      isImageLoading
                        ? 'invisible opacity-0'
                        : 'visible opacity-100'
                    )}
                    onLoad={handleImageLoaded}
                    src={currentImageUrl}
                  />
                </div>
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="spinner">Loading...</div>{' '}
                  </div>
                )}
              </div>
              {nft.description && (
                <p className="my-5">
                  {showLongDescription
                    ? nft.description
                    : truncateByWords(nft.description, 30)}
                  {nft.description.trim().split(/\s+/).length > 30 ? (
                    <button
                      className="ld-text-gray-500 ml-1"
                      onClick={(e) => {
                        stopEventPropagation(e);
                        setShowLongDescription((v) => !v);
                      }}
                    >
                      {showLongDescription ? 'Show less' : 'read more'}
                    </button>
                  ) : null}
                </p>
              )}
            </div>
            <div className="ld-text-gray-500 flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">
                <Squares2X2Icon className="size-4" />
                <p className="text-sm">{formattedNftSchema}</p>
              </div>
              {nft.mintCount && (
                <div className="flex items-center space-x-2">
                  <UserIcon className="size-5" />
                  <p>{nft.mintCount} minted</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <ArrowTopRightOnSquareIcon className="size-4" />
                <Link
                  className="text-sm"
                  href={nft.mintUrl || nft.sourceUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Open in {platformName}
                </Link>
              </div>
            </div>
            {nftChainInfo ? (
              <div className="flex items-center justify-start space-x-2">
                <img
                  alt={nftChainInfo?.name || 'NFT Chain'}
                  className="size-4 rounded-full"
                  height={16}
                  src={nftChainInfo?.logo}
                  width={16}
                />
                <p className="ld-text-gray-500 text-sm">{nftChainInfo?.name}</p>
              </div>
            ) : null}
          </div>
          {nft.schema === 'erc1155' ? (
            <div className="flex items-center justify-between border-y border-zinc-200 px-5 py-4">
              <p className="ld-text-gray-500">Quantity</p>
              <div className="flex items-center space-x-4">
                <button
                  className="flex size-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
                  disabled={selectedQuantity === 1}
                  onClick={(e) => {
                    stopEventPropagation(e);
                    setSelectedQuantity(selectedQuantity - 1);
                  }}
                >
                  <MinusIcon className="size-3 text-gray-600" strokeWidth={3} />
                </button>
                <span className="size-6 text-center">{selectedQuantity}</span>
                <button
                  className="flex size-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-40"
                  onClick={(e) => {
                    stopEventPropagation(e);
                    setSelectedQuantity(selectedQuantity + 1);
                  }}
                >
                  <PlusIcon className="size-3 text-gray-600" strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : null}
          <div className="space-y-5 p-5 pt-2">
            <div>
              <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
                <span className="space-x-1">Price</span>
                {loadingCurrencyDetails ? (
                  <span className="shimmer h-6 w-24 rounded-lg bg-gray-200" />
                ) : (
                  <div>
                    {(formattedTotalAmount - formattedTotalFees).toFixed(4)}{' '}
                    {getTokenDetails(selectedNftOaCurrency).symbol}
                  </div>
                )}
              </div>
              <FeesDisclosure
                actionData={actionData}
                bridgeFee={bridgeFee}
                formattedTotalAmount={formattedTotalAmount}
                formattedTotalFees={formattedTotalFees}
                loadingCurrencyDetails={loadingCurrencyDetails}
                tokenSymbol={getTokenDetails(selectedNftOaCurrency).symbol}
              />
              <div className="mt-4 flex items-start justify-between space-y-0.5 text-xl text-gray-600 dark:text-gray-100">
                <span className="flex items-baseline justify-start space-x-1">
                  Total
                </span>
                <div className="flex flex-col items-end">
                  {loadingCurrencyDetails ? (
                    <span className="shimmer h-7 w-36 rounded-lg bg-gray-200" />
                  ) : (
                    <p>
                      {formattedTotalAmount.toFixed(4)}{' '}
                      {getTokenDetails(selectedNftOaCurrency).symbol}
                    </p>
                  )}
                  {loadingCurrencyDetails ? (
                    <div className="shimmer mt-1 h-5 w-16 rounded-lg bg-gray-200" />
                  ) : (
                    <div className="ld-text-gray-500 mt-1 text-sm">
                      ~$
                      {(formattedTotalAmount * usdPrice).toFixed(4)}{' '}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {selectedNftOaCurrency ? (
              <DecentAction
                act={
                  permit2Allowed && Boolean(permit2Data)
                    ? act
                    : () => setIsModalCollapsed(!isModalCollapsed)
                }
                className="w-full justify-center"
                isLoading={isLoading || loadingCurrencyDetails}
                isReadyToMint={isApproved && permit2Allowed}
                loadingCurrency={loadingCurrencyDetails}
                moduleAmount={{
                  asset: {
                    contract: {
                      address: selectedNftOaCurrency,
                      chainId: CHAIN.id
                    },
                    decimals: getTokenDetails(selectedNftOaCurrency).decimals,
                    name: getTokenDetails(selectedNftOaCurrency).name,
                    symbol: getTokenDetails(selectedNftOaCurrency).symbol
                  },
                  value: formattedTotalAmount.toFixed(4)
                }}
                uiData={actionData?.uiData}
              />
            ) : null}
            <div className="flex w-full items-center justify-center text-center text-sm">
              <button
                className="flex items-baseline justify-center gap-1 opacity-70"
                onClick={(e) => {
                  stopEventPropagation(e);
                  setShowCurrencySelector(true);
                }}
              >
                Select another token{' '}
                <ChevronRightIcon className="size-2 stroke-black" />
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DecentOpenActionModule;
