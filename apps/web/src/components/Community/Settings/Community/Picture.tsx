import ChooseFile from '@components/Shared/ChooseFile';
import ImageCropperController from '@components/Shared/ImageCropperController';
import { PencilIcon } from '@heroicons/react/outline';
import { AVATAR, COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import { getCroppedImg } from '@lenster/image-cropper/cropUtils';
import type { Area } from '@lenster/image-cropper/types';
import imageKit from '@lenster/lib/imageKit';
import sanitizeDStorageUrl from '@lenster/lib/sanitizeDStorageUrl';
import type { Community } from '@lenster/types/communities';
import { Button, Image, Modal, Spinner } from '@lenster/ui';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import uploadCroppedImage, { readFile } from '@lib/profilePictureUtils';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';

interface PictureProps {
  community: Community;
}

const Picture: FC<PictureProps> = ({ community }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [avatarDataUrl, setAvatarDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);

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
      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL('image/png');
      await axios(`${COMMUNITIES_WORKER_URL}/createOrUpdate`, {
        method: 'POST',
        data: {
          id: community?.id,
          avatar: ipfsUrl,
          admin: currentProfile.id,
          ...getBasicWorkerPayload()
        }
      });
      setAvatarDataUrl(dataUrl);
    } catch (error) {
      toast.error(Errors.SomethingWentWrong);
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

  const profilePictureUrl = community?.avatar;
  const profilePictureIpfsUrl = profilePictureUrl
    ? imageKit(sanitizeDStorageUrl(profilePictureUrl), AVATAR)
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
