import type { FC } from 'react';

import { OpenAction } from '@hey/data/enums';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

import SwapConfig from './Config/Swap';

const OpenActionsConfig: FC = () => {
  const { selectedOpenAction } = useOpenActionStore();

  return <div>{selectedOpenAction === OpenAction.Swap && <SwapConfig />}</div>;
};

export default OpenActionsConfig;
