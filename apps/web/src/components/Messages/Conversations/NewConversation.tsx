import SearchProfiles from '@components/Shared/SearchProfiles';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Modal } from '@hey/ui';
import { type FC, useState } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

const NewConversation: FC = () => {
  const { setNewConversationAddress } = useMessagesStore();
  const [value, setValue] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="m-5 flex items-center justify-between">
      <div className="text-lg font-bold">Messages</div>
      <button onClick={() => setShowModal(true)}>
        <PlusCircleIcon className="size-6" />
      </button>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="New Conversation"
      >
        <div className="p-5">
          <SearchProfiles
            onChange={(event) => setValue(event.target.value)}
            onProfileSelected={(profile) => {
              setNewConversationAddress(profile.ownedBy.address);
              setShowModal(false);
            }}
            value={value}
          />
        </div>
      </Modal>
    </div>
  );
};

export default NewConversation;
