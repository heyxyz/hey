import type { FC } from 'react';

import { useSignupStore } from '.';

const ChooseHandle: FC = () => {
  const setScreen = useSignupStore((state) => state.setScreen);

  return <div className="space-y-2.5">gm</div>;
};

export default ChooseHandle;
