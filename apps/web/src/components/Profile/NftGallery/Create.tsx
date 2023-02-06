import { useApolloClient } from '@apollo/client';
import EmojiPicker from '@components/Shared/EmojiPicker';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import trimify from '@lib/trimify';
import { t, Trans } from '@lingui/macro';
import type { NftGallery } from 'lens';
import { NftGalleriesDocument, useCreateNftGalleryMutation, useNftGalleriesLazyQuery } from 'lens';
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

enum CreateSteps {
  NAME = 'NAME',
  PICK_NFTS = 'PICK_NFTS',
  REVIEW = 'REVIEW'
}

const Create: FC<Props> = ({ showModal, setShowModal }) => {
  const [emoji, setEmoji] = useState('');
  const [currentStep, setCurrentStep] = useState<CreateSteps>(CreateSteps.NAME);
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { cache } = useApolloClient();
  const [createGallery, { loading }] = useCreateNftGalleryMutation();
  const [fetchNftGalleries] = useNftGalleriesLazyQuery();

  const closeModal = () => {
    setShowModal(false);
    setCurrentStep(CreateSteps.NAME);
    setGallery({ name: '', items: [] });
  };

  const create = async () => {
    try {
      const sanitizedItems = gallery.items.map((el) => {
        return { tokenId: el.tokenId, contractAddress: el.contractAddress, chainId: el.chainId };
      });
      const { data } = await createGallery({
        variables: {
          request: {
            items: sanitizedItems,
            name: gallery.name,
            profileId: currentProfile?.id
          }
        }
      });
      if (data?.createNftGallery) {
        const { data } = await fetchNftGalleries({
          variables: { request: { profileId: currentProfile?.id } }
        });
        cache.modify({
          fields: {
            nftGalleries() {
              cache.writeQuery({ data: data?.nftGalleries as NftGallery[], query: NftGalleriesDocument });
            }
          }
        });
        closeModal();
        toast.success(t`Gallery created`);
      }
    } catch {}
  };

  const validateInputs = () => {
    const galleryName = trimify(gallery.name);
    if (!galleryName.length) {
      toast.error(t`Gallery name required`);
    } else if (!gallery.items.length && currentStep === CreateSteps.PICK_NFTS) {
      toast.error(t`Select collectibles for your gallery`);
    }
  };

  const onClickNext = async () => {
    validateInputs();
    const galleryName = trimify(gallery.name);
    if (galleryName.length && gallery.items.length && currentStep === CreateSteps.REVIEW) {
      create();
    } else if (galleryName.length && gallery.items.length) {
      setCurrentStep(CreateSteps.REVIEW);
    } else if (galleryName.length && !gallery.items.length) {
      setCurrentStep(CreateSteps.PICK_NFTS);
    } else {
      setCurrentStep(CreateSteps.NAME);
    }
  };

  const onPickEmoji = (emoji: string) => {
    setEmoji(emoji);
    setGallery({ ...gallery, name: gallery.name + emoji });
  };

  const getBackStep = () => {
    if (currentStep === CreateSteps.REVIEW) {
      return CreateSteps.PICK_NFTS;
    } else if (currentStep === CreateSteps.PICK_NFTS) {
      return CreateSteps.NAME;
    } else {
      return CreateSteps.NAME;
    }
  };

  const getModalTitle = () => {
    if (currentStep === CreateSteps.PICK_NFTS || currentStep === CreateSteps.REVIEW) {
      return (
        <div className="flex items-center space-x-1">
          <button type="button" onClick={() => setCurrentStep(getBackStep())}>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span>
            {currentStep === CreateSteps.REVIEW
              ? t`Review collection`
              : t`Select collectibles you want others to see`}
          </span>
        </div>
      );
    }
    return t`What's your gallery name?`;
  };

  return (
    <Modal
      size={currentStep === CreateSteps.NAME ? 'sm' : 'lg'}
      title={getModalTitle()}
      show={showModal}
      onClose={closeModal}
    >
      <div className="max-h-[80vh] overflow-y-auto pb-16" id="scrollableNftGalleryDiv">
        {currentStep === CreateSteps.REVIEW ? (
          <ReviewSelection />
        ) : currentStep === CreateSteps.PICK_NFTS ? (
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
            <Trans>{gallery.items.length} selected</Trans>
          )}
          <Button disabled={loading} onClick={() => onClickNext()} icon={loading && <Spinner size="xs" />}>
            <Trans>Next</Trans>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Create;
