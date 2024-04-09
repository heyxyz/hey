import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import {
  ADDRESS_PLACEHOLDER,
  DEFAULT_COLLECT_TOKEN,
  LENS_HUB,
  STATIC_IMAGES_URL
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
  CardHeader,
  Form,
  Input,
  Select,
  useZodForm
} from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useSignTypedData, useWriteContract } from 'wagmi';
import { object, string } from 'zod';

const newSuperFollowSchema = object({
  amount: string().min(1, { message: 'Invalid amount' }),
  recipient: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' })
});

const SuperFollow: FC = () => {
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileRestriction();
  const {
    decrementLensHubOnchainSigNonce,
    incrementLensHubOnchainSigNonce,
    lensHubOnchainSigNonce
  } = useNonceStore();
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
    queryFn: getAllTokens,
    queryKey: ['getAllTokens']
  });

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        decrementLensHubOnchainSigNonce();
      },
      onSuccess: () => {
        onCompleted();
        incrementLensHubOnchainSigNonce();
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: 'setFollowModule'
    });
  };

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
        await handleWrongNetwork();

        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return await write({ args });
          }

          return;
        }

        return await write({ args });
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

    if (isSuspended) {
      return toast.error(Errors.Suspended);
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
        <Loader className="my-10" message="Loading Super follow settings" />
      </Card>
    );
  }

  const followType = currentProfile?.followModule?.type;

  return (
    <Card>
      <CardHeader
        body="Setting Super follow makes users spend crypto to follow you, and it's
        a good way to earn it, you can change the amount and currency or
        disable/enable it anytime."
        title="Set Super follow"
      />
      <Form
        className="m-5 space-y-4"
        form={form}
        onSubmit={async ({ amount, recipient }) => {
          await setSuperFollow(amount, recipient);
        }}
      >
        <div>
          <div className="label">Select currency</div>
          <Select
            defaultValue={
              currentProfile?.followModule?.__typename ===
              'FeeFollowModuleSettings'
                ? currentProfile?.followModule?.amount.asset.contract.address
                : undefined
            }
            iconClassName="size-4"
            onChange={(value) => setSelectedCurrency(value)}
            options={allowedTokens?.map((token) => ({
              icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
              label: token.name,
              selected: token.contractAddress === selectedCurrency,
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
