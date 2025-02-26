import ChooseFile from "@components/Shared/ChooseFile";
import ImageCropperController from "@components/Shared/ImageCropperController";
import uploadCroppedImage, { readFile } from "@helpers/accountPictureUtils";
import errorToast from "@helpers/errorToast";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { COVER, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import { getCroppedImg } from "@hey/image-cropper/cropUtils";
import type { Area } from "@hey/image-cropper/types";
import { Button, Image, Modal } from "@hey/ui";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface CoverUploadProps {
  src: string;
  setSrc: (src: string) => void;
}

const CoverUpload: FC<CoverUploadProps> = ({ src, setSrc }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pictureSrc, setPictureSrc] = useState(src);
  const [showPictureCropModal, setShowPictureCropModal] = useState(false);
  const [croppedPictureAreaPixels, setPictureCroppedAreaPixels] =
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

  const pictureUrl = pictureSrc || `${STATIC_IMAGES_URL}/patterns/2.svg`;
  const renderPictureUrl = pictureUrl
    ? imageKit(sanitizeDStorageUrl(pictureUrl), COVER)
    : "";

  return (
    <>
      <div className="space-y-1.5">
        <div className="label">Cover</div>
        <div className="space-y-3">
          <div>
            <Image
              alt="Cover picture crop preview"
              className="h-[175px] w-[675px] rounded-lg object-cover"
              onError={({ currentTarget }) => {
                currentTarget.src = sanitizeDStorageUrl(src);
              }}
              src={uploadedPictureUrl || renderPictureUrl}
            />
          </div>
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
        size="lg"
        title="Crop cover picture"
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={pictureSrc}
            setCroppedAreaPixels={setPictureCroppedAreaPixels}
            targetSize={{ height: 350, width: 1350 }}
          />
          <div className="flex w-full flex-wrap items-center justify-between gap-y-3">
            <div className="ld-text-gray-500 flex items-center space-x-1 text-left text-sm">
              <InformationCircleIcon className="size-4" />
              <div>
                Optimal cover picture size is <b>1350x350</b>
              </div>
            </div>
            <Button
              disabled={uploadingPicture || !pictureSrc}
              onClick={handleUploadAndSave}
              type="submit"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CoverUpload;
