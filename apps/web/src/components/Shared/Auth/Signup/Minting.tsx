import type { FC } from 'react';

import { useProfileQuery } from '@good/lens';
import { Spinner } from '@good/ui';

import { useSignupStore } from '.';

const Minting: FC = () => {
  const { choosedHandle, setProfileId, setScreen, transactionHash } =
    useSignupStore();

  useProfileQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.profile) {
        setProfileId(data.profile.id);
        setScreen('success');
      }
    },
    pollInterval: 3000,
    skip: !transactionHash,
    variables: { request: { forHandle: choosedHandle } }
  });

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="text-xl font-bold">We are preparing your profile!</div>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
    </div>
  );
};

export default Minting;
