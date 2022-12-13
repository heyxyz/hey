import EmojiPicker from '@components/Shared/EmojiPicker';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import type { Dispatch, FC } from 'react';
import React, { useState } from 'react';

type Props = {
  showModal: boolean;
  setShowModal: Dispatch<boolean>;
};

const Create: FC<Props> = ({ showModal, setShowModal }) => {
  const [emoji, setEmoji] = useState('');

  return (
    <div>
      <Modal title="What's your gallery name?" show={showModal} onClose={() => setShowModal(false)}>
        <textarea
          rows={4}
          className="py-2 px-4 resize-none w-full bg-white outline-none !ring-0 border-none dark:bg-gray-800"
        />
        <div className="p-4 flex justify-between items-center">
          <EmojiPicker emoji={emoji} setEmoji={setEmoji} />
          <Button>Next</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Create;
