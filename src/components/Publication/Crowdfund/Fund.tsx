import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation, useQuery } from '@apollo/client';
import { ALLOWANCE_SETTINGS_QUERY } from '@components/Settings/Allowance';
import AllowanceButton from '@components/Settings/Allowance/Button';
import Uniswap from '@components/Shared/Uniswap';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { LensterCollectModule, LensterPublication } from '@generated/lenstertypes';
import { CreateCollectBroadcastItemResult } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/Broadcast';
import { CashIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import { Mixpanel } from '@lib/mixpanel';
import splitSignature from '@lib/splitSignature';
import React, { Dispatch, FC, useState } from 'react';
import toast from 'react-hot-toast';
import { CONNECT_WALLET, ERROR_MESSAGE, ERRORS, LENSHUB_PROXY, RELAY_ON } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
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
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const [allowed, setAllowed] = useState(true);
  const { address } = useAccount();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError: (error) => {
      toast.error(error?.message);
      Mixpanel.track(CROWDFUND.FUND, {
        result: 'typed_data_error',
        error: error?.message
      });
    }
  });
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
    skip: !collectModule?.amount?.asset?.address || !isConnected,
    onCompleted: (data) => {
      setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
    }
  });

  const onCompleted = () => {
    setRevenue(revenue + parseFloat(collectModule?.amount?.value));
    toast.success('Transaction submitted successfully!');
    Mixpanel.track(CROWDFUND.FUND, { result: 'success' });
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
    onSuccess: () => {
      onCompleted();
    },
    onError: (error: any) => {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
      Mixpanel.track(CROWDFUND.FUND, {
        result: 'broadcast_error',
        error: error?.message
      });
    }
  });
  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
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
            } = await broadcast({ variables: { request: { id, signature } } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError: (error) => {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const createCollect = () => {
    if (!isConnected) {
      return toast.error(CONNECT_WALLET);
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
              <IndexStatus txHash={writeData?.hash ? writeData?.hash : broadcastData?.broadcast?.txHash} />
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
