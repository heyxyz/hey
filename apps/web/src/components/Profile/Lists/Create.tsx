import ChooseFile from "@components/Shared/ChooseFile";
import ImageCropperController from "@components/Shared/ImageCropperController";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import uploadCroppedImage, { readFile } from "@helpers/profilePictureUtils";
import { AVATAR, HEY_API_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import { getCroppedImg } from "@hey/image-cropper/cropUtils";
import type { Area } from "@hey/image-cropper/types";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  TextArea,
  useZodForm
} from "@hey/ui";
import axios from "axios";
import { useRouter } from "next/router";
import { type ChangeEvent, type FC, useState } from "react";
import toast from "react-hot-toast";
import { object, string, type z } from "zod";

const newListSchema = object({
  name: string()
    .min(3, { message: "Name should be at least 3 characters" })
    .max(100, { message: "Name should not exceed 100 characters" }),
  description: string()
    .max(500, { message: "Description should not exceed 500 characters" })
    .optional()
});

const Create: FC = () => {
  const { push } = useRouter();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarIpfsUrl, setAvatarIpfsUrl] = useState("");
  const [showAvatarCropModal, setShowAvatarCropModal] = useState(false);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState("");
  const [croppedAvatarAreaPixels, setCroppedAvatarAreaPixels] =
    useState<Area | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [creatingList, setCreatingList] = useState(false);

  const form = useZodForm({
    schema: newListSchema
  });

  const createList = async ({
    name,
    description
  }: z.infer<typeof newListSchema>) => {
    try {
      setCreatingList(true);
      const { data } = await axios.post(
        `${HEY_API_URL}/lists/create`,
        { name, description, avatar: avatarIpfsUrl },
        { headers: getAuthApiHeaders() }
      );

      toast.success("List created");
      push(`/lists/${data?.result.id}`);
    } catch (error) {
      errorToast(error);
    } finally {
      setCreatingList(false);
    }
  };

  const uploadAndSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        avatarUrl,
        croppedAvatarAreaPixels
      );

      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Update Loading State
      setUploadingAvatar(true);

      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL("image/png");

      // Update Profile Picture
      setAvatarIpfsUrl(ipfsUrl);
      setUploadedAvatarUrl(dataUrl);
    } catch (error) {
      errorToast(error);
    } finally {
      setShowAvatarCropModal(false);
      setUploadingAvatar(false);
    }
  };

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      setAvatarUrl(await readFile(file));
      setShowAvatarCropModal(true);
    }
  };

  const renderAvatarUrl = avatarUrl
    ? imageKit(sanitizeDStorageUrl(avatarUrl), AVATAR)
    : "";

  return (
    <div className="p-5">
      <Form className="space-y-4" form={form} onSubmit={createList}>
        <Input label="Name" placeholder="John Doe" {...form.register("name")} />
        <TextArea
          label="Description"
          placeholder="Please provide additional details about the list"
          {...form.register("description")}
        />
        <div className="space-y-1.5">
          <div className="label">Avatar</div>
          <div className="space-y-3">
            <Image
              alt="Avatar crop preview"
              className="size-40 rounded-lg"
              onError={({ currentTarget }) => {
                currentTarget.src = sanitizeDStorageUrl(avatarIpfsUrl);
              }}
              src={uploadedAvatarUrl || renderAvatarUrl}
            />
            <ChooseFile onChange={onFileChange} />
          </div>
        </div>
        <Button
          className="flex w-full justify-center"
          disabled={creatingList}
          type="submit"
        >
          {creatingList ? "Creating..." : "Create"}
        </Button>
      </Form>
      <Modal
        onClose={() => {
          setAvatarUrl("");
          setShowAvatarCropModal(false);
        }}
        show={showAvatarCropModal}
        size="sm"
        title="Crop avatar"
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={avatarUrl}
            setCroppedAreaPixels={setCroppedAvatarAreaPixels}
            targetSize={{ height: 300, width: 300 }}
          />
          <Button
            disabled={uploadingAvatar || !avatarUrl}
            onClick={uploadAndSave}
            type="submit"
          >
            Upload
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Create;
