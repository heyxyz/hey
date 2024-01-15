import { Button } from '@hey/ui';
import { type FC } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

interface SaveOrCancelProps {
  onSave: () => void;
}

const SaveOrCancel: FC<SaveOrCancelProps> = ({ onSave }) => {
  const { reset, setShowModal, showModal } = useOpenActionStore();

  return (
    <div className="mt-5 flex space-x-2">
      <Button
        className="ml-auto"
        onClick={() => {
          reset();
          setShowModal(false);
        }}
        outline
        variant="danger"
      >
        Cancel
      </Button>
      <Button className="ml-auto" onClick={onSave}>
        Save
      </Button>
    </div>
  );
};

export default SaveOrCancel;
