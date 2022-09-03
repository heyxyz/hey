import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation, useQuery } from '@apollo/client';
import { ALLOWANCE_SETTINGS_QUERY } from '@components/Settings/Allowance';
import AllowanceButton from '@components/Settings/Allowance/Button';
import Uniswap from '@components/Shared/Uniswap';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import { LensterCollectModule, LensterPublication } from '@generated/lenstertypes';
import { CreateCollectBroadcastItemResult, Mutation } from '@generated/types';
import { CashIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import { Hog } from '@lib/hog';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import React, { Dispatch, FC, useState } from 'react';
import toast from 'react-hot-toast';
import { LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { CROWDFUND } from 'src/tracking';
import { useAccount, useBalance, useContractWrite, useSignTypedData } from 'wagmi';

import IndexStatus from '../../Shared/IndexStatus';

const CREATE_COLLECT_TYPED_DATA_MUTATION = gql`
  mutation CreateCollectTypedData($options: TypedDataOptions, $request: CreateCollectRequest!) {
    createCollectTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`;

interface Props {
  fund: LensterPublication;
  collectModule: LensterCollectModule;
  setRevenue: Dispatch<number>;
  revenue: number;
}

const Fund: FC<Props> = ({ fund, collectModule, setRevenue, revenue }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [allowed, setAllowed] = useState(true);
  const { address } = useAccount();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    addressOrName: address,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: true
  });
  let hasAmount = false;

  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(collectModule?.amount?.value)) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const { data: allowanceData, loading: allowanceLoading } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: collectModule?.type,
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !currentProfile,
    onCompleted: (data) => {
      setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
    }
  });

  const onCompleted = () => {
    setRevenue(revenue + parseFloat(collectModule?.amount?.value));
    toast.success('Transaction submitted successfully!');
    Hog.track(CROWDFUND.FUND);
  };

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult;
      }) => {
        try {
          const { id, typedData } = createCollectTypedData;
          const { profileId, pubId, data: collectData, deadline } = typedData?.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            collector: address,
            profileId,
            pubId,
            data: collectData,
            sig
          };

          setUserSigNonce(userSigNonce + 1);
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ request: { id, signature } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError
    }
  );

  const createCollect = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    createCollectTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { publicationId: fund.id }
      }
    });
  };

  return allowanceLoading || balanceLoading ? (
    <div className="w-24 rounded-lg h-[34px] shimmer" />
  ) : allowed ? (
    <div className="flex items-center mt-3 space-y-0 space-x-3 sm:block sm:mt-0 sm:space-y-2">
      {hasAmount ? (
        <>
          <Button
            className="sm:mt-0 sm:ml-auto"
            onClick={createCollect}
            disabled={!hasAmount || typedDataLoading || signLoading || writeLoading || broadcastLoading}
            variant="success"
            icon={
              typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
                <Spinner variant="success" size="xs" />
              ) : (
                <CashIcon className="w-4 h-4" />
              )
            }
          >
            Fund
          </Button>
          {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
            <div className="mt-2">
              <IndexStatus txHash={writeData?.hash ?? broadcastData?.broadcast?.txHash} />
            </div>
          ) : null}
        </>
      ) : (
        <Uniswap module={collectModule} />
      )}
    </div>
  ) : (
    <AllowanceButton
      title="Allow"
      module={allowanceData?.approvedModuleAllowanceAmount[0]}
      allowed={allowed}
      setAllowed={setAllowed}
    />
  );
};

export default Fund;
