import { Alert } from '@hey/ui';
import { type FC, memo } from 'react';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';

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
      title="Discard Post"
      description="This can’t be undone and you’ll lose your draft."
      onClose={() => setShowDiscardModal(false)}
      confirmText="Discard"
      onConfirm={onDiscard}
    />
  );
};

export default memo(Discard);
