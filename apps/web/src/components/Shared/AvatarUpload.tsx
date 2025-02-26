import ChooseFile from "@components/Shared/ChooseFile";
import ImageCropperController from "@components/Shared/ImageCropperController";
import uploadCroppedImage, { readFile } from "@helpers/accountPictureUtils";
import errorToast from "@helpers/errorToast";
import { AVATAR, DEFAULT_AVATAR } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import { getCroppedImg } from "@hey/image-cropper/cropUtils";
import type { Area } from "@hey/image-cropper/types";
import { Button, Image, Modal } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface AvatarUploadProps {
  src: string;
  setSrc: (src: string) => void;
  isSmall?: boolean;
}

const AvatarUpload: FC<AvatarUploadProps> = ({
  src,
  setSrc,
  isSmall = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pictureSrc, setPictureSrc] = useState(src);
  const [showPictureCropModal, setShowPictureCropModal] = useState(false);
  const [croppedPictureAreaPixels, setCroppedPictureAreaPixels] =
    useState<Area | null>(null);
  const [uploadedPictureUrl, setUploadedPictureUrl] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const handleUploadAndSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        pictureSrc,
        croppedPictureAreaPixels
      );

      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }

      setUploadingPicture(true);

      const decentralizedUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL("image/png");

      setSrc(decentralizedUrl);
      setUploadedPictureUrl(dataUrl);
    } catch (error) {
      onError(error);
    } finally {
      setShowPictureCropModal(false);
      setUploadingPicture(false);
    }
  };

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      setPictureSrc(await readFile(file));
      setShowPictureCropModal(true);
    }
  };

  const pictureUrl = pictureSrc || DEFAULT_AVATAR;
  const renderPictureUrl = pictureUrl
    ? imageKit(sanitizeDStorageUrl(pictureUrl), AVATAR)
    : "";

  return (
    <>
      <div className="space-y-1.5">
        <div className="label">Avatar</div>
        <div className="space-y-3">
          <Image
            alt="Account picture crop preview"
            className={cn("rounded-lg", isSmall ? "max-w-[200px]" : "max-w-sm")}
            onError={({ currentTarget }) => {
              currentTarget.src = sanitizeDStorageUrl(src);
            }}
            src={uploadedPictureUrl || renderPictureUrl}
          />
          <ChooseFile onChange={(event) => onFileChange(event)} />
        </div>
      </div>
      <Modal
        onClose={
          isSubmitting
            ? undefined
            : () => {
                setPictureSrc("");
                setShowPictureCropModal(false);
              }
        }
        show={showPictureCropModal}
        size="sm"
        title="Crop picture"
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={pictureSrc}
            setCroppedAreaPixels={setCroppedPictureAreaPixels}
            targetSize={{ height: 300, width: 300 }}
          />
          <Button
            disabled={uploadingPicture || !pictureSrc}
            onClick={handleUploadAndSave}
            type="submit"
          >
            Upload
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AvatarUpload;
