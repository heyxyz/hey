import {
  CheckIcon,
  FaceFrownIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { HeyLensSignup } from '@hey/abis';
import {
  APP_NAME,
  HANDLE_PREFIX,
  HEY_LENS_SIGNUP,
  ZERO_ADDRESS
} from '@hey/data/constants';
import { useProfileQuery } from '@hey/lens';
import { Button, Input } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { type FC, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import { useSignupStore } from '.';

const ChooseHandle: FC = () => {
  const delegatedExecutor = useSignupStore((state) => state.delegatedExecutor);
  const setScreen = useSignupStore((state) => state.setScreen);
  const setTransactionHash = useSignupStore(
    (state) => state.setTransactionHash
  );
  const [handle, setHandle] = useState<null | string>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { address } = useAccount();

  const canCheck = Boolean(handle && handle.length > 3);

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: errorToast,
      onSuccess: (hash) => {
        setTransactionHash(hash);
        setScreen('minting');
      }
    }
  });

  useProfileQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setIsAvailable(!data.profile),
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  const handleMint = async () => {
    return await writeContractAsync({
      abi: HeyLensSignup,
      address: HEY_LENS_SIGNUP,
      args: [[address, ZERO_ADDRESS, '0x'], handle, ['delegatedExecutor']],
      functionName: 'createProfileWithHandleUsingCredits',
      value: parseEther('2')
    });
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
      <div className="space-y-5 pt-3">
        <div className="mb-5">
          <Input
            onChange={(e) => setHandle(e.target.value)}
            placeholder="yourhandle"
            prefix="@lens/"
          />
          {canCheck ? (
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
          ) : (
            <div className="ld-text-gray-500 mt-2 flex items-center space-x-1 text-sm">
              <FaceSmileIcon className="size-4" />
              <b>Hope you will get a good one!</b>
            </div>
          )}
        </div>
        <Button
          className="w-full"
          disabled={!canCheck || !isAvailable}
          onClick={handleMint}
        >
          Mint for 10 MATIC
        </Button>
      </div>
    </div>
  );
};

export default ChooseHandle;
