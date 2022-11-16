import { LensHubProxy } from '@abis/LensHubProxy';
import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { Form, useZodForm } from '@components/UI/Form';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { Erc20 } from '@generated/types';
import {
  useCreateSetFollowModuleTypedDataMutation,
  useEnabledCurrencyModulesWithProfileQuery
} from '@generated/types';
import { StarIcon, XIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import getTokenImage from '@lib/getTokenImage';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ADDRESS_REGEX, DEFAULT_COLLECT_TOKEN, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string } from 'zod';

const newSuperFollowSchema = object({
  amount: string().min(1, { message: 'Invalid amount' }),
  recipient: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(ADDRESS_REGEX, { message: 'Invalid Ethereum address' })
});

const SuperFollow: FC = () => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_COLLECT_TOKEN);
  const [selectedCurrencySymobol, setSelectedCurrencySymobol] = useState('WMATIC');
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
  const { data: currencyData, loading } = useEnabledCurrencyModulesWithProfileQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id
  });

  const onCompleted = () => {
    Leafwatch.track(SETTINGS.ACCOUNT.SET_SUPER_FOLLOW);
  };

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'setFollowModuleWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const form = useZodForm({
    schema: newSuperFollowSchema,
    defaultValues: {
      recipient: currentProfile?.ownedBy
    }
  });

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createSetFollowModuleTypedData, { loading: typedDataLoading }] =
    useCreateSetFollowModuleTypedDataMutation({
      onCompleted: async ({ createSetFollowModuleTypedData }) => {
        try {
          const { id, typedData } = createSetFollowModuleTypedData;
          const { profileId, followModule, followModuleInitData, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            followModule,
            followModuleInitData,
            sig
          };

          setUserSigNonce(userSigNonce + 1);
          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }

          const {
            data: { broadcast: result }
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }
        } catch {}
      },
      onError
    });

  const setSuperFollow = (amount: string | null, recipient: string | null) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    createSetFollowModuleTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentProfile?.id,
          followModule: amount
            ? {
                feeFollowModule: {
                  amount: {
                    currency: selectedCurrency,
                    value: amount
                  },
                  recipient
                }
              }
            : {
                freeFollowModule: true
              }
        }
      }
    });
  };

  if (loading) {
    return (
      <Card>
        <div className="p-5 py-10 space-y-2 text-center">
          <Spinner size="md" className="mx-auto" />
          <div>Loading super follow settings</div>
        </div>
      </Card>
    );
  }

  const followType = currencyData?.profile?.followModule?.__typename;

  return (
    <Card>
      <Form
        form={form}
        className="p-5 space-y-4"
        onSubmit={({ amount, recipient }) => {
          setSuperFollow(amount, recipient);
        }}
      >
        <div className="text-lg font-bold">Set super follow</div>
        <p>
          Setting super follow makes users spend crypto to follow you, and it&rsquo;s a good way to earn it,
          you can change the amount and currency or disable/enable it anytime.
        </p>
        <div className="pt-2">
          <div className="label">Select Currency</div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => {
              const currency = e.target.value.split('-');
              setSelectedCurrency(currency[0]);
              setSelectedCurrencySymobol(currency[1]);
            }}
          >
            {currencyData?.enabledModuleCurrencies?.map((currency: Erc20) => (
              <option key={currency.address} value={`${currency.address}-${currency.symbol}`}>
                {currency.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Follow amount"
          type="number"
          step="0.0001"
          min="0"
          max="100000"
          prefix={
            <img
              className="w-6 h-6"
              height={24}
              width={24}
              src={getTokenImage(selectedCurrencySymobol)}
              alt={selectedCurrencySymobol}
            />
          }
          placeholder="5"
          {...form.register('amount')}
        />
        <Input
          label="Funds recipient"
          type="text"
          placeholder="0x3A5bd...5e3"
          {...form.register('recipient')}
        />
        <div className="ml-auto flex flex-col space-y-2">
          <div className="block space-y-2 space-x-0 sm:flex sm:space-y-0 sm:space-x-2">
            {followType === 'FeeFollowModuleSettings' && (
              <Button
                type="button"
                variant="danger"
                outline
                onClick={() => setSuperFollow(null, null)}
                disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
                icon={<XIcon className="w-4 h-4" />}
              >
                Disable Super follow
              </Button>
            )}
            <Button
              type="submit"
              disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
              icon={<StarIcon className="w-4 h-4" />}
            >
              {followType === 'FeeFollowModuleSettings' ? 'Update Super follow' : 'Set Super follow'}
            </Button>
          </div>
          {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
            <IndexStatus txHash={writeData?.hash ?? broadcastData?.broadcast?.txHash} />
          ) : null}
        </div>
      </Form>
    </Card>
  );
};

export default SuperFollow;
