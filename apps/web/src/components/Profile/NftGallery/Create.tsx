import EmojiPicker from '@components/Shared/EmojiPicker';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import trimify from '@lib/trimify';
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

  const [createGallery, { loading }] = useCreateNftGalleryMutation();

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

  const validateInputs = () => {
    const galleryName = trimify(gallery.name);
    if (!galleryName.length) {
      toast.error('Gallery name required');
    } else if (!gallery.items.length && currentStep === 'PICK_NFTS') {
      toast.error('Select collectibles for your gallery');
    }
  };

  const onClickNext = async () => {
    validateInputs();
    const galleryName = trimify(gallery.name);
    if (galleryName.length && gallery.items.length && currentStep === 'REVIEW') {
      create();
    } else if (galleryName.length && gallery.items.length) {
      setCurrentStep('REVIEW');
    } else if (galleryName.length && !gallery.items.length) {
      setCurrentStep('PICK_NFTS');
    } else {
      setCurrentStep('NAME');
    }
  };

  const onPickEmoji = (emoji: string) => {
    setEmoji(emoji);
    setGallery({ ...gallery, name: gallery.name + emoji });
  };

  const getModalTitle = () => {
    if (currentStep === 'PICK_NFTS' || currentStep === 'REVIEW') {
      return (
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() =>
              setCurrentStep(
                currentStep === 'REVIEW' ? 'PICK_NFTS' : currentStep === 'PICK_NFTS' ? 'NAME' : 'NAME'
              )
            }
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span>
            <Trans>
              {currentStep === 'REVIEW' ? 'Review collection' : 'Select collectibles you want others to see'}
            </Trans>
          </span>
        </div>
      );
    }
    return "What's your gallery name?";
  };

  return (
    <Modal
      size={currentStep === 'NAME' ? 'sm' : 'lg'}
      title={getModalTitle()}
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
          <Button disabled={loading} onClick={() => onClickNext()} icon={loading && <Spinner size="xs" />}>
            Next
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Create;
