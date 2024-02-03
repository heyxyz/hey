import { Spinner } from '@hey/ui';
import { type FC } from 'react';

import { useSignupStore } from '.';

const Minting: FC = () => {
  const setScreen = useSignupStore((state) => state.setScreen);

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="text-xl font-bold">We are minting your profile!</div>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
      <button className="mt-5" onClick={() => setScreen('success')}>
        take to success (debug)
      </button>
    </div>
  );
};

export default Minting;
