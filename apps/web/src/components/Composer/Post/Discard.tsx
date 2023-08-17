import { Button } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface DiscardProps {
  onDiscard: () => void;
}

const Discard: FC<DiscardProps> = ({ onDiscard }) => {
  const setShowDiscardModal = useGlobalModalStateStore(
    (state) => state.setShowDiscardModal
  );
  return (
    <div className="space-y-3 p-5">
      <div>
        <Trans>{`This can’t be undone and you’ll lose your draft.`}</Trans>
      </div>
      <div className="flex items-center space-x-3">
        <Button onClick={() => setShowDiscardModal(false)} outline>
          <Trans>Cancel</Trans>
        </Button>
        <Button onClick={onDiscard} variant="danger">
          <Trans>Discard</Trans>
        </Button>
      </div>
    </div>
  );
};

export default Discard;
