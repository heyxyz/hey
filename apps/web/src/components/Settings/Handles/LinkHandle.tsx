import Loader from '@components/Shared/Loader';
import Slug from '@components/Shared/Slug';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { DEFAULT_COLLECT_TOKEN, LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { Regex } from '@hey/data/regex';
import { SETTINGS } from '@hey/data/tracking';
import {
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation,
  useOwnedHandlesQuery
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner, useZodForm } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string } from 'zod';

const newSuperFollowSchema = object({
  amount: string().min(1, { message: 'Invalid amount' }),
  recipient: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' })
});

const LinkHandle: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    DEFAULT_COLLECT_TOKEN
  );
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] =
    useState('WMATIC');
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast } = checkDispatcherPermissions(currentProfile);

  const form = useZodForm({
    schema: newSuperFollowSchema,
    defaultValues: {
      recipient: currentProfile?.ownedBy.address
    }
  });

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success('Super follow updated successfully!');
    Leafwatch.track(SETTINGS.ACCOUNT.SET_SUPER_FOLLOW);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });
  const { data, loading } = useOwnedHandlesQuery({
    variables: { request: { for: currentProfile?.ownedBy.address } }
  });

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setFollowModule',
    onSuccess: () => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    }
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createSetFollowModuleTypedData] =
    useCreateSetFollowModuleTypedDataMutation({
      onCompleted: async ({ createSetFollowModuleTypedData }) => {
        const { id, typedData } = createSetFollowModuleTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { profileId, followModule, followModuleInitData } =
          typedData.value;
        const args = [profileId, followModule, followModuleInitData];

        if (canBroadcast) {
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return write({ args });
          }
          return;
        }

        return write({ args });
      },
      onError
    });

  const setSuperFollow = async (
    amount: string | null,
    recipient: string | null
  ) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return await createSetFollowModuleTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: {
            followModule: amount
              ? {
                  feeFollowModule: {
                    amount: { currency: selectedCurrency, value: amount },
                    recipient
                  }
                }
              : { freeFollowModule: true }
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const ownedHandles = data?.ownedHandles.items;

  return (
    <div className="space-y-6">
      {ownedHandles?.map((handle) => (
        <div
          key={handle.fullHandle}
          className="flex items-center justify-between"
        >
          <Slug slug={handle.fullHandle} />
          <Button
            icon={
              false ? (
                <Spinner size="xs" />
              ) : handle.linkedTo ? (
                <MinusCircleIcon className="h-4 w-4" />
              ) : (
                <PlusCircleIcon className="h-4 w-4" />
              )
            }
            onClick={() => {}}
            disabled={false}
            outline
          >
            {handle.linkedTo ? 'Unlink' : 'Link'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
