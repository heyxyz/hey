import EmojiPicker from '@components/Shared/EmojiPicker';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { useCreateNftGalleryMutation } from 'lens';
import type { Dispatch, FC } from 'react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useNftGalleryStore } from 'src/store/nft-gallery';

import Picker from './Picker';
import ReviewSelection from './ReviewSelection';

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<boolean>;
}

const Create: FC<Props> = ({ showModal, setShowModal }) => {
  const [emoji, setEmoji] = useState('');
  const [currentStep, setCurrentStep] = useState('NAME');
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [createGallery] = useCreateNftGalleryMutation();

  const closeModal = () => {
    setShowModal(false);
    setCurrentStep('NAME');
    setGallery({ name: '', items: [] });
  };

  const create = async () => {
    try {
      const sanitizedItems = gallery.items.map((el) => {
        return { tokenId: el.tokenId, contractAddress: el.contractAddress, chainId: el.chainId };
      });
      const result = await createGallery({
        variables: {
          request: {
            items: sanitizedItems,
            name: gallery.name,
            profileId: currentProfile?.id
          }
        }
      });
      if (result) {
        closeModal();
        toast.success('Gallery created');
      }
    } catch {}
  };

  const onClickNext = async () => {
    if (gallery.name.length && gallery.items.length && currentStep === 'REVIEW') {
      create();
    } else if (gallery.name.length && gallery.items.length) {
      setCurrentStep('REVIEW');
    } else if (gallery.name.length && !gallery.items.length) {
      setCurrentStep('PICK_NFTS');
    } else {
      setCurrentStep('NAME');
    }
  };

  const onPickEmoji = (emoji: string) => {
    setEmoji(emoji);
    setGallery({ ...gallery, name: gallery.name + emoji });
  };

  return (
    <Modal
      size={currentStep === 'NAME' ? 'sm' : 'lg'}
      title={
        currentStep === 'PICK_NFTS' || currentStep === 'REVIEW' ? (
          <div className="flex items-center space-x-1">
            <button type="button" onClick={() => setCurrentStep(gallery.name.length ? 'PICK_NFTS' : 'NAME')}>
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span>
              <Trans>
                {currentStep === 'REVIEW'
                  ? 'Review collection'
                  : 'Select collectibles you want others to see'}
              </Trans>
            </span>
          </div>
        ) : (
          "What's your gallery name?"
        )
      }
      show={showModal}
      onClose={() => closeModal()}
    >
      <div className="max-h-[80vh] overflow-y-auto pb-16">
        {currentStep === 'REVIEW' ? (
          <ReviewSelection />
        ) : currentStep === 'PICK_NFTS' ? (
          <Picker />
        ) : (
          <textarea
            className="w-full resize-none border-none bg-white py-2 px-4 outline-none !ring-0 dark:bg-gray-800"
            value={gallery.name}
            onChange={(e) => setGallery({ name: e.target.value, items: gallery.items })}
            rows={4}
          />
        )}
        <div className="absolute bottom-0 flex w-full items-center justify-between rounded-b-lg bg-white p-4 dark:bg-gray-800">
          {currentStep === 'NAME' ? (
            <EmojiPicker emoji={emoji} setEmoji={(emoji) => onPickEmoji(emoji)} />
          ) : (
            `${gallery.items.length} selected`
          )}
          <Button onClick={() => onClickNext()}>Next</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Create;
