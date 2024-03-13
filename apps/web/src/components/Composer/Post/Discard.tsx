import type { FC } from 'react';

import { Alert } from '@hey/ui';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface DiscardProps {
  onDiscard: () => void;
}

const Discard: FC<DiscardProps> = ({ onDiscard }) => {
  const { setShowDiscardModal, showDiscardModal } = useGlobalModalStateStore();

  return (
    <Alert
      confirmText="Discard"
      description="This can’t be undone and you’ll lose your draft."
      isDestructive
      onClose={() => setShowDiscardModal(false)}
      onConfirm={onDiscard}
      show={showDiscardModal}
      title="Discard Post"
    />
  );
};

export default Discard;
