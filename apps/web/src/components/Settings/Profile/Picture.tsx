import ChooseFile from '@components/Shared/ChooseFile';
import { PencilIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToIPFS from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import { LensHub } from 'abis';
import { AVATAR, ERROR_MESSAGE, LENSHUB_PROXY, SIGN_WALLET } from 'data/constants';
import { getCroppedImg } from 'image-cropper/cropUtils';
import type { Area, Size } from 'image-cropper/types';
import type { MediaSet, NftImage, Profile, UpdateProfileImageRequest } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation
} from 'lens';
import getSignature from 'lib/getSignature';
import imageProxy from 'lib/imageProxy';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { Button, ErrorMessage, Image, Modal, Spinner } from 'ui';
import { useContractWrite, useSignTypedData } from 'wagmi';

import ImageCropperController from './ImageCropperController';

interface PictureProps {
  profile: Profile & { picture: MediaSet & NftImage };
}

const Picture: FC<PictureProps> = ({ profile }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [avatarDataUrl, setAvatarDataUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);

  const onCompleted = () => {
    toast.success(t`Avatar updated successfully!`);
    Mixpanel.track(SETTINGS.PROFILE.SET_PICTURE);
  };

  const {
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted
  });
  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useCreateSetProfileImageUriTypedDataMutation({
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        const { id, typedData } = createSetProfileImageURITypedData;
        const { profileId, imageURI, deadline } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          profileId,
          imageURI,
          sig
        };
        setUserSigNonce(userSigNonce + 1);
        const { data } = await broadcast({ variables: { request: { id, signature } } });
        if (data?.broadcast.__typename === 'RelayError') {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      },
      onError
    });

  const [createSetProfileImageURIViaDispatcher, { loading: dispatcherLoading }] =
    useCreateSetProfileImageUriViaDispatcherMutation({ onCompleted, onError });

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageURIViaDispatcher({
      variables: { request }
    });
    if (data?.createSetProfileImageURIViaDispatcher?.__typename === 'RelayError') {
      await createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const uploadImage = async (image: HTMLCanvasElement): Promise<{ ipfsUrl: string; dataUrl: string }> => {
    const blob = await new Promise((resolve) => image.toBlob(resolve));
    let file = new File([blob as Blob], 'cropped_image.png', { type: (blob as Blob).type });
    const attachment = await uploadToIPFS([file]);
    if (attachment[0]?.item) {
      const ipfsUrl = attachment[0].item;
      const dataUrl = image.toDataURL('image/png');
      return { ipfsUrl, dataUrl };
    } else {
      throw new Error('uploadToIPFS failed');
    }
  };

  const uploadAndSave = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedImage) {
      return toast.error(ERROR_MESSAGE);
    }

    try {
      setUploading(true);
      let { ipfsUrl, dataUrl } = await uploadImage(croppedImage);

      const request: UpdateProfileImageRequest = {
        profileId: currentProfile?.id,
        url: ipfsUrl
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        await createViaDispatcher(request);
      } else {
        await createSetProfileImageURITypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request
          }
        });
      }
      setAvatarDataUrl(dataUrl);
    } catch (error) {
      toast.error(t`Upload failed`);
    } finally {
      setShowCropModal(false);
      setUploading(false);
    }
  };

  const isLoading =
    typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading || uploading;

  const readFile = (file: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result as string), false);
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setShowCropModal(true);
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  const profilePictureUrl = profile?.picture?.original?.url ?? profile?.picture?.uri;
  const profilePictureIpfsUrl = profilePictureUrl
    ? imageProxy(sanitizeDStorageUrl(profilePictureUrl), AVATAR)
    : '';

  const cropperPreviewSize: Size = { width: 240, height: 240 };
  const cropperBorderSize = 20;

  return (
    <>
      <Modal
        title={t`Crop image`}
        show={showCropModal}
        size="fit-content"
        onClose={
          isLoading
            ? undefined
            : () => {
                setImageSrc('');
                setShowCropModal(false);
              }
        }
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={imageSrc}
            setCroppedAreaPixels={setCroppedAreaPixels}
            cropSize={cropperPreviewSize}
            borderSize={cropperBorderSize}
          />
          <Button
            type="submit"
            disabled={isLoading || !imageSrc}
            onClick={() => uploadAndSave()}
            icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="h-4 w-4" />}
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      </Modal>
      <div className="space-y-1.5">
        {error && <ErrorMessage className="mb-3" title={t`Transaction failed!`} error={error} />}
        <div className="space-y-3">
          <div>
            <Image
              className="rounded-lg"
              height={cropperPreviewSize.height}
              width={cropperPreviewSize.width}
              src={avatarDataUrl || profilePictureIpfsUrl}
              alt={t`Profile picture crop preview`}
            />
          </div>
          <div className="flex items-center space-x-3">
            <ChooseFile onChange={(event: ChangeEvent<HTMLInputElement>) => onFileChange(event)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Picture;
