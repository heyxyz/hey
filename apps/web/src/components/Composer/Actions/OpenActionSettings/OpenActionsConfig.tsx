import { OpenAction } from '@hey/data/enums';
import { type FC } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

import TipConfig from './Config/Tip';

const OpenActionsConfig: FC = () => {
  const selectedOpenAction = useOpenActionStore(
    (state) => state.selectedOpenAction
  );

  return <div>{selectedOpenAction === OpenAction.Tip && <TipConfig />}</div>;
};

export default OpenActionsConfig;
