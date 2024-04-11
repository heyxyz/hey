import type { FC } from 'react';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import { useProfileQuery } from '@hey/lens';
import { Spinner } from '@hey/ui';
import Link from 'next/link';

import { useSignupStore } from '.';

const Minting: FC = () => {
  const {
    choosedHandle,
    mintViaCard,
    setProfileId,
    setScreen,
    transactionHash
  } = useSignupStore();

  useProfileQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.profile) {
        setProfileId(data.profile.id);
        setScreen('success');
      }
    },
    pollInterval: 3000,
    skip: mintViaCard ? false : !transactionHash,
    variables: { request: { forHandle: choosedHandle } }
  });

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="text-xl font-bold">We are preparing your profile!</div>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
      {!mintViaCard && (
        <Link
          className="mt-5 flex items-center space-x-1 text-sm underline"
          href={`${POLYGONSCAN_URL}/tx/${transactionHash}`}
          target="_blank"
        >
          <span>View transaction</span>
          <ArrowTopRightOnSquareIcon className="size-4" />
        </Link>
      )}
    </div>
  );
};

export default Minting;
