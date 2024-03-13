import type { FC } from 'react';

import { OpenAction } from '@hey/data/enums';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

import TipConfig from './Config/Tip';

const OpenActionsConfig: FC = () => {
  const { selectedOpenAction } = useOpenActionStore();

  return <div>{selectedOpenAction === OpenAction.Tip && <TipConfig />}</div>;
};

export default OpenActionsConfig;
