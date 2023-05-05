import ChooseFile from '@components/Shared/ChooseFile';
import { useFeature } from '@growthbook/growthbook-react';
import { PencilIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import uploadCroppedImage, { readFile } from '@lib/profilePictureUtils';
import splitSignature from '@lib/splitSignature';
import { t, Trans } from '@lingui/macro';
import { LensHub } from 'abis';
import { KillSwitch } from 'data';
import { AVATAR, LENSHUB_PROXY } from 'data/constants';
import Errors from 'data/errors';
import { getCroppedImg } from 'image-cropper/cropUtils';
import type { Area } from 'image-cropper/types';
import type {
  MediaSet,
  NftImage,
  Profile,
  UpdateProfileImageRequest
} from 'lens';
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
  const [isLoading, setIsLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const { on: useThirdwebIpfs } = useFeature(KillSwitch.UseThirdwebIpfs);

  // Dispatcher
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;
  const isSponsored = currentProfile?.dispatcher?.sponsor;

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success(t`Avatar updated successfully!`);
    Mixpanel.track(SETTINGS.PROFILE.SET_PICTURE);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    toast.error(
      error?.data?.message ?? error?.message ?? Errors.SomethingWentWrong
    );
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });
  const [createSetProfileImageURITypedData] =
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
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast.__typename === 'RelayError') {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      },
      onError
    });

  const [createSetProfileImageURIViaDispatcher] =
    useCreateSetProfileImageUriViaDispatcherMutation({
      onCompleted: ({ createSetProfileImageURIViaDispatcher }) =>
        onCompleted(createSetProfileImageURIViaDispatcher.__typename),
      onError
    });

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageURIViaDispatcher({
      variables: { request }
    });
    if (
      data?.createSetProfileImageURIViaDispatcher?.__typename === 'RelayError'
    ) {
      return await createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const uploadAndSave = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedImage) {
      return toast.error(Errors.SomethingWentWrong);
    }

    try {
      setIsLoading(true);
      const ipfsUrl = await uploadCroppedImage(croppedImage, useThirdwebIpfs);
      const dataUrl = croppedImage.toDataURL('image/png');

      const request: UpdateProfileImageRequest = {
        profileId: currentProfile?.id,
        url: ipfsUrl
      };

      setAvatarDataUrl(dataUrl);
      if (canUseRelay && isSponsored) {
        return await createViaDispatcher(request);
      }
      return await createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    } finally {
      setShowCropModal(false);
    }
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageSrc(await readFile(file));
      setShowCropModal(true);
    }
  };

  const profilePictureUrl =
    profile?.picture?.original?.url ?? profile?.picture?.uri;
  const profilePictureIpfsUrl = profilePictureUrl
    ? imageProxy(sanitizeDStorageUrl(profilePictureUrl), AVATAR)
    : '';

  return (
    <>
      <Modal
        title={t`Crop image`}
        show={showCropModal}
        size="sm"
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
            targetSize={{ width: 300, height: 300 }}
          />
          <Button
            type="submit"
            disabled={isLoading || !imageSrc}
            onClick={() => uploadAndSave()}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="h-4 w-4" />
              )
            }
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      </Modal>
      <div className="space-y-1.5">
        {error && (
          <ErrorMessage
            className="mb-3"
            title={t`Transaction failed!`}
            error={error}
          />
        )}
        <div className="space-y-3">
          <div>
            <Image
              className="max-w-xs rounded-lg"
              src={avatarDataUrl || profilePictureIpfsUrl}
              alt={t`Profile picture crop preview`}
            />
          </div>
          <div className="flex items-center space-x-3">
            <ChooseFile onChange={onFileChange} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Picture;
