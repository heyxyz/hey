import EmojiPicker from '@components/Shared/EmojiPicker';
import { Input } from '@components/UI/Input';
import { Modal } from '@components/UI/Modal';
import React, { useState } from 'react';

const Create = () => {
  const [showModal, setShowModal] = useState(false);
  const [emoji, setEmoji] = useState('');

  return (
    <div>
      <Modal title="What's your gallery name?" show={showModal} onClose={() => setShowModal(false)}>
        <Input />
        <EmojiPicker emoji={emoji} setEmoji={setEmoji} />
      </Modal>
    </div>
  );
};

export default Create;
