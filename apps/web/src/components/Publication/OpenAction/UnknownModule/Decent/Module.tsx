import type {
  MirrorablePublication,
  Profile,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { Nft } from '@hey/types/misc';
import type { ActionData } from 'nft-openaction-kit';
import type { Dispatch, FC } from 'react';

import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  UserIcon
} from '@heroicons/react/24/outline';
import { ZERO_ADDRESS } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { useDefaultProfileQuery } from '@hey/lens';
import getNftChainId from '@hey/lib/getNftChainId';
import getNftChainInfo from '@hey/lib/getNftChainInfo';
import getProfile from '@hey/lib/getProfile';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import {
  getPermit2Allowance,
  permit2SignatureAmount,
  signPermitSignature,
  updateWrapperParams
} from '@hey/lib/permit2';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import truncateByWords from '@hey/lib/truncateByWords';
import { HelpTooltip, Modal } from '@hey/ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN, PERMIT_2_ADDRESS } from 'src/constants';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useTransactionStatus } from 'src/hooks/useIndexStatus';
import { useOaCurrency } from 'src/store/persisted/useOaCurrency';
import { useOaTransactionStore } from 'src/store/persisted/useOaTransactionStore';
import { parseAbi } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';

import CurrencySelector from './CurrencySelector';
import DecentAction from './DecentAction';
import StepperApprovals from './StepperApprovals';

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

const getTokenSymbol = (symbol: string): string => {
  if (symbol === 'WMATIC') {
    return 'MATIC';
  } else if (symbol === 'WETH') {
    return 'ETH';
  } else {
    return symbol;
  }
};

const DecentOpenActionModule: FC<DecentOpenActionModuleProps> = ({
  actionData,
  loadingCurrency,
  module,
  nft,
  onClose,
  publication,
  selectedQuantity,
  setSelectedQuantity,
  show
}) => {
  const { selectedCurrency, setSelectedCurrency } = useOaCurrency();
  const [usdPrice, setUsdPrice] = useState(0);
  const [maticUsdPrice, setMaticUsdPrice] = useState(0);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();

  const getUsdPrice = async () => {
    const usdPrice = await getRedstonePrice(
      getTokenSymbol(selectedCurrency.symbol)
    );
    setUsdPrice(usdPrice);
  };

  const getMaticUsdPrice = async () => {
    const maticPrice = await getRedstonePrice('MATIC');
    setMaticUsdPrice(maticPrice);
  };

  useEffect(() => {
    getUsdPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  useEffect(() => {
    getMaticUsdPrice();
  }, []);

  const { actOnUnknownOpenAction, isLoading, relayStatus, txHash } =
    useActOnUnknownOpenAction({
      signlessApproved: module.signlessApproved,
      successToast: 'Initiated transaction'
    });

  const { data: transactionStatusData } = useTransactionStatus({
    txId: relayStatus
  });

  useEffect(() => {
    if (
      relayStatus &&
      !relayStatus.startsWith('0x') &&
      transactionStatusData &&
      transactionStatusData.lensTransactionStatus &&
      transactionStatusData.lensTransactionStatus.txHash
    ) {
      const txHashFromStatus =
        transactionStatusData.lensTransactionStatus.txHash;
      useOaTransactionStore.getState().addTransaction({
        platformName: actionData?.uiData.platformName,
        status: 'pending',
        txHash: txHashFromStatus
      });
    }
  }, [transactionStatusData]);

  const { data: creatorProfileData } = useDefaultProfileQuery({
    skip: !actionData?.uiData.nftCreatorAddress,
    variables: { request: { for: actionData?.uiData.nftCreatorAddress } }
  });

  const creatorProfileExists =
    !!creatorProfileData && !!creatorProfileData.defaultProfile;
  const creatorAddress = actionData?.uiData.nftCreatorAddress ?? ZERO_ADDRESS;

  const totalAmount = actionData
    ? BigInt(actionData.actArgumentsFormatted.paymentToken.amount) *
      BigInt(selectedQuantity)
    : BigInt(0);

  // Convert totalAmount to a number with decimals
  const { decimals } = selectedCurrency;
  const formattedTotalAmount = Number(totalAmount) / Math.pow(10, decimals);

  const bridgeFee = actionData
    ? (actionData.actArgumentsFormatted.bridgeFeeNative * maticUsdPrice) /
      usdPrice
    : 0;

  const formattedTotalFees = bridgeFee + formattedTotalAmount * 0.05;

  const formattedNftSchema = nft.schema === 'erc1155' ? 'ERC-1155' : 'ERC-721';

  const nftChainInfo = actionData?.uiData.dstChainId
    ? {
        logo: getNftChainInfo(
          getNftChainId(actionData.uiData.dstChainId.toString())
        ).logo,
        name: getNftChainInfo(
          getNftChainId(actionData.uiData.dstChainId.toString())
        ).name
      }
    : null;

  const [showLongDescription, setShowLongDescription] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  const [isModalCollapsed, setIsModalCollapsed] = useState(false);

  const [permit2Allowed, setPermit2Allowed] = useState(false);
  const [permit2Data, setPermit2Data] = useState<Permit2Data | undefined>();

  const amount = formattedTotalAmount || 0;
  const assetAddress = selectedCurrency.contractAddress;

  const [isPermit2Loading, setIsPermit2Loading] = useState(false);

  const approvePermit2 = async () => {
    if (!!walletClient) {
      setIsPermit2Loading(true);
      try {
        await handleWrongNetwork();
        await walletClient.writeContract({
          abi: parseAbi(['function approve(address, uint256) returns (bool)']),
          address: assetAddress as `0x${string}`,
          args: [
            PERMIT_2_ADDRESS,
            57896044618658097711785492504343953926634992332820282019728792003956564819967n
          ],
          functionName: 'approve'
        });
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
        setIsPermit2Loading(false);
      } catch (error) {
        toast.error('Failed to approve Permit2');
        setIsPermit2Loading(false);
      }
    }
  };

  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const approveOA = async () => {
    if (!!walletClient && !!actionData) {
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
        toast.error('Failed to approve module');
        setIsApprovalLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!!relayStatus) {
      localStorage.setItem(`pendingTx`, relayStatus);
    }
  }, [relayStatus]);

  const act = async () => {
    if (actionData && !!publication && !!permit2Data) {
      try {
        const updatedCalldata = await updateWrapperParams({
          chainId: actionData.uiData.dstChainId,
          data: actionData.actArguments.actionModuleData,
          deadline: BigInt(permit2Data.deadline),
          nonce: BigInt(permit2Data.nonce),
          signature: permit2Data.signature as `0x${string}`
        });
        await actOnUnknownOpenAction({
          address: VerifiedOpenActionModules.DecentNFT as `0x${string}`,
          data: updatedCalldata,
          publicationId: publication.id,
          referrers: actionData.actArguments.referrerProfileIds.map((id) => ({
            profileId: '0x' + id.toString(16).padStart(2, '0')
          }))
        });
      } catch (error) {
        toast.error('Failed to mint NFT');
      }
    }
  };

  useEffect(() => {
    const fetchPermit2Allowance = async () => {
      if (address && !!assetAddress) {
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

  return (
    <Modal
      icon={
        showCurrencySelector ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCurrencySelector(false);
            }}
          >
            <ChevronLeftIcon className="mt-[2px] w-4" strokeWidth={3} />
          </button>
        ) : isModalCollapsed ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalCollapsed(false);
            }}
          >
            <ChevronLeftIcon className="mt-[2px] w-4" strokeWidth={3} />
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
            setSelectedCurrency(currency);
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
            name: actionData?.uiData.nftName ?? '',
            price: formattedTotalAmount.toFixed(4) + selectedCurrency.symbol,
            schema: formattedNftSchema,
            uri: sanitizeDStorageUrl(actionData?.uiData.nftUri)
          }}
          selectedCurrencySymbol={selectedCurrency.symbol}
          step={!permit2Allowed ? 'Permit2' : 'Allowance'}
        />
      ) : (
        <>
          <div className="space-y-2 p-5">
            <div>
              <h2 className="text-xl">{actionData?.uiData.nftName}</h2>
              {creatorProfileData ? (
                <p className="opacity-50">
                  by{' '}
                  {creatorProfileExists
                    ? getProfile(creatorProfileData.defaultProfile as Profile)
                        .slug
                    : `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`}
                </p>
              ) : null}
            </div>
            <div className="pt-2">
              <img
                alt={actionData?.uiData.nftName}
                className="aspect-[1.5] max-h-[350px] w-full rounded-xl object-contain"
                src={sanitizeDStorageUrl(actionData?.uiData.nftUri)}
              />
              {nft.description && (
                <p className="my-5">
                  {showLongDescription
                    ? nft.description
                    : truncateByWords(nft.description, 30)}
                  {nft.description.trim().split(/\s+/).length > 30 ? (
                    <button
                      className="ml-1 opacity-50"
                      onClick={() => setShowLongDescription((v) => !v)}
                    >
                      {showLongDescription ? 'Show less' : 'read more'}
                    </button>
                  ) : null}
                </p>
              )}
            </div>
            <div className="ld-text-gray-500 flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Squares2X2Icon className="w-5" />
                <p>{formattedNftSchema}</p>
              </div>
              {nft.mintCount && (
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5" />
                  <p>{nft.mintCount} minted</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ArrowTopRightOnSquareIcon className="w-5" />
                <Link
                  href={nft.mintUrl ?? nft.sourceUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Open in {actionData?.uiData.platformName}
                </Link>
              </div>
            </div>
            {nftChainInfo ? (
              <div className="ld-text-gray-500 flex items-center justify-start gap-1 text-base">
                <img
                  alt={nftChainInfo.name}
                  className="h-4 w-4 rounded-full"
                  src={nftChainInfo.logo}
                />
                <p>Minted on {nftChainInfo.name}</p>
              </div>
            ) : null}
          </div>
          {nft.schema === 'erc1155' ? (
            <div className="flex items-center justify-between border-y border-zinc-200 px-5 py-4">
              <p className="ld-text-gray-500">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
                  disabled={selectedQuantity === 1}
                  onClick={() => setSelectedQuantity(selectedQuantity - 1)}
                >
                  <MinusIcon className="w-3 text-gray-600" strokeWidth={3} />
                </button>
                <span className="w-4 text-center">{selectedQuantity}</span>
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-40"
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                >
                  <PlusIcon className="w-3 text-gray-600" strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : null}
          <div className="space-y-5 p-5 pt-0">
            <div>
              <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
                <span className="space-x-1">Price</span>
                <div>
                  {loadingCurrency
                    ? '--'
                    : (formattedTotalAmount - formattedTotalFees).toFixed(
                        4
                      )}{' '}
                  {selectedCurrency?.symbol}
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
                  {loadingCurrency ? '--' : formattedTotalFees.toFixed(4)}{' '}
                  {selectedCurrency?.symbol}
                </div>
              </div>
              {showFees ? (
                <>
                  <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
                    <span className="space-x-1">
                      {actionData?.actArgumentsFormatted.dstChainId === 137
                        ? 'Transaction Fee'
                        : 'Bridge Fee'}
                    </span>
                    <div>
                      {bridgeFee.toFixed(4)} {selectedCurrency?.symbol}
                    </div>
                  </div>
                  <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
                    <span className="inline-flex items-center gap-1 space-x-1">
                      Lens Creator Fee{'  '}
                      <HelpTooltip>
                        <div className="w-[210px] px-2 py-3 leading-tight">
                          Lens creator fee is distributed between publication
                          creator, application, Lens treasury, and mirror (if
                          applicable)
                        </div>
                      </HelpTooltip>
                    </span>
                    <div>
                      {loadingCurrency
                        ? '--'
                        : (formattedTotalAmount * 0.05).toFixed(4)}{' '}
                      {selectedCurrency?.symbol}
                    </div>
                  </div>
                </>
              ) : null}
              <div className="mt-4 flex items-start justify-between space-y-0.5 text-xl text-gray-600 dark:text-gray-100">
                <span className="flex items-baseline justify-start gap-1 space-x-1">
                  Total
                </span>
                <div className="flex flex-col items-end">
                  <p>
                    {loadingCurrency ? '--' : formattedTotalAmount.toFixed(4)}{' '}
                    {selectedCurrency?.symbol}
                  </p>
                  <div className="ld-text-gray-500 text-sm">
                    ~$
                    {loadingCurrency
                      ? '--'
                      : (formattedTotalAmount * usdPrice).toFixed(4)}{' '}
                  </div>
                </div>
              </div>
            </div>
            {selectedCurrency ? (
              <DecentAction
                act={
                  permit2Allowed && !!permit2Data
                    ? act
                    : () => setIsModalCollapsed(!isModalCollapsed)
                }
                className="w-full justify-center"
                isLoading={isLoading || loadingCurrency}
                isReadyToMint={isApproved && permit2Allowed}
                loadingCurrency={loadingCurrency}
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
                  value: formattedTotalAmount.toFixed(4)
                }}
                txHash={txHash}
              />
            ) : null}
            <div className="flex w-full items-center justify-center text-center text-sm">
              <button
                className="lg-text-gray-500 flex items-baseline justify-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCurrencySelector(true);
                }}
              >
                Select another token{' '}
                <ChevronRightIcon className="w-2" strokeWidth={3} />
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DecentOpenActionModule;
