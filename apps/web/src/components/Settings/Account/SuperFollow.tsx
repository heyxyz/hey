import type { FC } from 'react';

import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import {
  ADDRESS_PLACEHOLDER,
  DEFAULT_COLLECT_TOKEN,
  LENSHUB_PROXY
} from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { Regex } from '@hey/data/regex';
import { SETTINGS } from '@hey/data/tracking';
import {
  FollowModuleType,
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation
} from '@hey/lens';
import getAllTokens from '@hey/lib/api/getAllTokens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Spinner,
  useZodForm
} from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
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

const SuperFollow: FC = () => {
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
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast } = checkDispatcherPermissions(currentProfile);

  const form = useZodForm({
    defaultValues: {
      amount:
        currentProfile?.followModule?.__typename === 'FeeFollowModuleSettings'
          ? currentProfile?.followModule?.amount.value
          : '',
      recipient: currentProfile?.ownedBy.address
    },
    schema: newSuperFollowSchema
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

  const { data: allowedTokens, isLoading: allowedTokensLoading } = useQuery({
    queryFn: () => getAllTokens(),
    queryKey: ['getAllTokens']
  });

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { write } = useContractWrite({
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: 'setFollowModule',
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    },
    onSuccess: () => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
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
        const { followModule, followModuleInitData, profileId } =
          typedData.value;
        const args = [profileId, followModule, followModuleInitData];

        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
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
    amount: null | string,
    recipient: null | string
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

  if (allowedTokensLoading) {
    return (
      <Card>
        <div className="space-y-2 p-5 py-10 text-center">
          <Spinner className="mx-auto" size="md" />
          <div>Loading Super follow settings</div>
        </div>
      </Card>
    );
  }

  const followType = currentProfile?.followModule?.type;

  return (
    <Card>
      <Form
        className="space-y-4 p-5"
        form={form}
        onSubmit={async ({ amount, recipient }) => {
          await setSuperFollow(amount, recipient);
        }}
      >
        <div className="text-lg font-bold">Set Super follow</div>
        <p>
          Setting Super follow makes users spend crypto to follow you, and it's
          a good way to earn it, you can change the amount and currency or
          disable/enable it anytime.
        </p>
        <div className="pt-2">
          <div className="label">Select currency</div>
          <Select
            defaultValue={
              currentProfile?.followModule?.__typename ===
              'FeeFollowModuleSettings'
                ? currentProfile?.followModule?.amount.asset.contract.address
                : undefined
            }
            onChange={(e) => setSelectedCurrency(e.target.value)}
            options={allowedTokens?.map((token) => ({
              label: token.name,
              value: token.contractAddress
            }))}
          />
        </div>
        <Input
          label="Follow amount"
          max="100000"
          min="0"
          placeholder="5"
          step="0.0001"
          type="number"
          {...form.register('amount')}
        />
        <Input
          label="Funds recipient"
          placeholder={ADDRESS_PLACEHOLDER}
          type="text"
          {...form.register('recipient')}
        />
        <div className="ml-auto">
          <div className="block space-x-0 space-y-2 sm:flex sm:space-x-2 sm:space-y-0">
            {followType === FollowModuleType.FeeFollowModule ? (
              <Button
                disabled={isLoading}
                icon={<XMarkIcon className="size-4" />}
                onClick={() => setSuperFollow(null, null)}
                outline
                type="button"
                variant="danger"
              >
                Disable Super follow
              </Button>
            ) : null}
            <Button
              disabled={isLoading}
              icon={<StarIcon className="size-4" />}
              type="submit"
            >
              {followType === FollowModuleType.FeeFollowModule
                ? 'Update Super follow'
                : 'Set Super follow'}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default SuperFollow;
