import {
  CheckIcon,
  ExclamationTriangleIcon,
  FaceFrownIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { HeyLensSignup } from '@hey/abis';
import {
  APP_NAME,
  HANDLE_PREFIX,
  HEY_LENS_SIGNUP,
  SIGNUP_PRICE,
  ZERO_ADDRESS
} from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import { AUTH } from '@hey/data/tracking';
import { useProfileQuery } from '@hey/lens';
import { Button, Form, Input, Spinner, useZodForm } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import { formatUnits, parseEther } from 'viem';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { object, string } from 'zod';

import { useSignupStore } from '.';
import Moonpay from './Moonpay';

const newProfileSchema = object({
  handle: string()
    .min(5, { message: 'Handle must be at least 5 characters long' })
    .max(26, { message: 'Handle must be at most 26 characters long' })
    .regex(Regex.handle, {
      message:
        'Handle must start with a letter/number, only _ allowed in between'
    })
});

const ChooseHandle: FC = () => {
  const delegatedExecutor = useSignupStore((state) => state.delegatedExecutor);
  const setScreen = useSignupStore((state) => state.setScreen);
  const setChoosedHandle = useSignupStore((state) => state.setChoosedHandle);
  const setTransactionHash = useSignupStore(
    (state) => state.setTransactionHash
  );
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 }
  });
  const form = useZodForm({ mode: 'onChange', schema: newProfileSchema });
  const handle = form.watch('handle');

  const balance = balanceData && parseFloat(formatUnits(balanceData.value, 18));
  const hasBalance = balance && balance >= SIGNUP_PRICE;
  const canCheck = Boolean(handle && handle.length > 4);
  const isInvalid = !form.formState.isValid;

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: errorToast,
      onSuccess: (hash) => {
        Leafwatch.track(AUTH.SIGNUP, { price: SIGNUP_PRICE });
        setTransactionHash(hash);
        setChoosedHandle(`${HANDLE_PREFIX}${handle}`);
        setScreen('minting');
      }
    }
  });

  useProfileQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setIsAvailable(!data.profile),
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  const handleMint = async (handle: string) => {
    try {
      setLoading(true);
      return await writeContractAsync({
        abi: HeyLensSignup,
        address: HEY_LENS_SIGNUP,
        args: [[address, ZERO_ADDRESS, '0x'], handle, [delegatedExecutor]],
        functionName: 'createProfileWithHandleUsingCredits',
        value: parseEther(SIGNUP_PRICE.toString())
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="text-xl font-bold">Welcome to {APP_NAME}!</div>
        <div className="ld-text-gray-500 text-sm">
          Let's start by buying your handle for you. Buying you say? Yep -
          handles cost a little bit of money to support the network and keep
          bots away
        </div>
      </div>
      <Form
        className="space-y-5 pt-3"
        form={form}
        onSubmit={async ({ handle }) => await handleMint(handle)}
      >
        <div className="mb-5">
          <Input
            hideError
            placeholder="yourhandle"
            prefix="@lens/"
            {...form.register('handle')}
          />
          {canCheck && !isInvalid ? (
            isAvailable === false ? (
              <div className="mt-2 flex items-center space-x-1 text-sm text-red-500">
                <FaceFrownIcon className="size-4" />
                <b>Handle not available!</b>
              </div>
            ) : isAvailable === true ? (
              <div className="mt-2 flex items-center space-x-1 text-sm text-green-500">
                <CheckIcon className="size-4" />
                <b>You're in luck - it's available!</b>
              </div>
            ) : null
          ) : canCheck && isInvalid ? (
            <div className="mt-2 flex items-center space-x-1 text-sm text-red-500">
              <ExclamationTriangleIcon className="size-4" />
              <b>{form.formState.errors.handle?.message}</b>
            </div>
          ) : (
            <div className="ld-text-gray-500 mt-2 flex items-center space-x-1 text-sm">
              <FaceSmileIcon className="size-4" />
              <b>Hope you will get a good one!</b>
            </div>
          )}
        </div>
        {hasBalance ? (
          <Button
            className="w-full justify-center"
            disabled={
              !canCheck ||
              !isAvailable ||
              loading ||
              !delegatedExecutor ||
              isInvalid
            }
            icon={
              loading ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : (
                <img
                  alt="Lens Logo"
                  className="h-3"
                  height={12}
                  src="/lens.svg"
                  width={19}
                />
              )
            }
            type="submit"
          >
            Mint for {SIGNUP_PRICE} MATIC
          </Button>
        ) : (
          <Moonpay balance={balance} />
        )}
      </Form>
    </div>
  );
};

export default ChooseHandle;
