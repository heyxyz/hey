import { Alert } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface DiscardProps {
  onDiscard: () => void;
}

const Discard: FC<DiscardProps> = ({ onDiscard }) => {
  const showDiscardModal = useGlobalModalStateStore(
    (state) => state.showDiscardModal
  );

  const setShowDiscardModal = useGlobalModalStateStore(
    (state) => state.setShowDiscardModal
  );

  return (
    <Alert
      isDestructive
      show={showDiscardModal}
      title={t`Discard Post`}
      description={t`This can’t be undone and you’ll lose your draft.`}
      onClose={() => setShowDiscardModal(false)}
      confirmText={t`Discard`}
      onConfirm={onDiscard}
    />
  );
};

export default Discard;
