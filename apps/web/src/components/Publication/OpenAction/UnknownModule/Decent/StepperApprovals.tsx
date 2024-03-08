import type { Dispatch, FC, SetStateAction } from 'react';

import { SETTINGS } from '@hey/data/tracking';
import {
  type ApprovedAllowanceAmountResult,
  type ApprovedModuleAllowanceAmountQuery,
  OpenActionModuleType,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from '@hey/lens';
import { Button, Spinner, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getAllowanceModule from '@lib/getAllowanceModule';
import { Leafwatch } from '@lib/leafwatch';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

// TODO: change copy
const permit2Copy = (selectedCurrencySymbol: string) =>
  `You'll be doing a tx to enable the Permit2 contract for the ${selectedCurrencySymbol} token.`;

// TODO: change copy
const approveTokenCopy = (selectedCurrencySymbol: string) =>
  `You'll be approving the token allowance for the ${selectedCurrencySymbol} token with a signature.`;

type StepperApprovalsProps = {
  allowanceData?: ApprovedModuleAllowanceAmountQuery;
  approvePermit2: () => void;
  nftDetails: {
    creator: string;
    name: string;
    price: string;
    schema: 'ERC-1155' | 'ERC-721';
    uri: string;
  };
  selectedCurrencySymbol: string;
  setAllowed: Dispatch<SetStateAction<boolean>>;
  step: 'Allowance' | 'Permit2';
};

const StepperApprovals: FC<StepperApprovalsProps> = ({
  allowanceData,
  approvePermit2,
  nftDetails,
  selectedCurrencySymbol,
  setAllowed,
  step = 'Permit2'
}) => {
  const module = allowanceData
    ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult;

  const [generateModuleCurrencyApprovalData, { loading: queryLoading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery();
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = (error: any) => {
    errorToast(error);
  };

  const {
    data: txHash,
    isPending: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    mutation: { onError }
  });

  const {
    error,
    isLoading: waitLoading,
    isSuccess
  } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Module enabled successfully!');
      setAllowed(true);
      Leafwatch.track(SETTINGS.ALLOWANCE.TOGGLE, {
        allowed: true,
        currency: module.allowance.asset.symbol,
        module: module.moduleName
      });
    }

    if (error) {
      onError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  const handleAllowance = async (
    contract: string,
    value: string,
    selectedModule: string
  ) => {
    try {
      const isUnknownModule =
        module.moduleName === OpenActionModuleType.UnknownOpenActionModule;

      const { data } = await generateModuleCurrencyApprovalData({
        variables: {
          request: {
            allowance: { currency: contract, value: value },
            module: {
              [isUnknownModule
                ? 'unknownOpenActionModule'
                : getAllowanceModule(module.moduleName).field]: isUnknownModule
                ? module.moduleContract.address
                : selectedModule
            }
          }
        }
      });
      await handleWrongNetwork();

      return sendTransaction?.({
        account: data?.generateModuleCurrencyApprovalData.from,
        data: data?.generateModuleCurrencyApprovalData.data,
        to: data?.generateModuleCurrencyApprovalData.to
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center justify-start gap-4">
          <img
            alt={nftDetails.name}
            className="aspect-[1.5] max-h-[50px] w-auto rounded-xl object-cover"
            src={nftDetails.uri}
          />
          <div className="flex flex-col items-start justify-center">
            <p className="text-lg font-bold">{nftDetails.name}</p>
            <p className="text-sm">{nftDetails.creator}</p>
          </div>
        </div>
        <div className="text-gray-600">{nftDetails.price}</div>
      </div>
      <WarningMessage
        message={
          <div>
            <div className="leading-6">
              {step === 'Permit2'
                ? permit2Copy(selectedCurrencySymbol)
                : approveTokenCopy(selectedCurrencySymbol)}
            </div>
            {step === 'Permit2' ? (
              <a
                className="underline"
                href="https://docs.uniswap.org/contracts/permit2/overview"
                rel="noreferrer"
                target="_blank"
              >
                See documentation
              </a>
            ) : null}
          </div>
        }
        title={
          step === 'Permit2'
            ? 'Allowing the Permit2 contract'
            : 'Approving token allowance'
        }
      />

      {step === 'Allowance' ? (
        <Button
          className="w-full justify-center"
          disabled={queryLoading || transactionLoading || waitLoading}
          icon={
            queryLoading || transactionLoading || waitLoading ? (
              <Spinner size="xs" />
            ) : null
          }
          onClick={() =>
            handleAllowance(
              module.allowance.asset.contract.address,
              Number.MAX_SAFE_INTEGER.toString(),
              module.moduleName
            )
          }
        >
          Approve
        </Button>
      ) : (
        <Button className="w-full justify-center" onClick={approvePermit2}>
          <div>Approve</div>
        </Button>
      )}
    </div>
  );
};

export default StepperApprovals;
