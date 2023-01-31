import EmojiPicker from '@components/Shared/EmojiPicker';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Dispatch, FC } from 'react';
import React, { useState } from 'react';

import Picker from './Picker';

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<boolean>;
}

const Create: FC<Props> = ({ showModal, setShowModal }) => {
  const [emoji, setEmoji] = useState('');
  const [pickNfts, setPickNfts] = useState(false);

  return (
    <Modal
      size={pickNfts ? 'lg' : 'sm'}
      title={
        pickNfts ? (
          <div className="flex items-center space-x-1">
            <button type="button" onClick={() => setPickNfts(false)}>
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span>
              <Trans>Select collectibles you want others to see</Trans>
            </span>
          </div>
        ) : (
          "What's your gallery name?"
        )
      }
      show={showModal}
      onClose={() => setShowModal(false)}
    >
      {pickNfts ? (
        <Picker />
      ) : (
        <textarea
          rows={4}
          className="py-2 px-4 resize-none w-full bg-white outline-none !ring-0 border-none dark:bg-gray-800"
        />
      )}

      <div className={clsx('p-4 flex items-center', pickNfts ? 'justify-end' : 'justify-between')}>
        {!pickNfts && <EmojiPicker emoji={emoji} setEmoji={setEmoji} />}
        <Button onClick={() => setPickNfts(true)}>Next</Button>
      </div>
    </Modal>
  );
};

export default Create;
