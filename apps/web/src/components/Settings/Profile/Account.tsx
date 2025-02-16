import ChooseFile from "@components/Shared/ChooseFile";
import ImageCropperController from "@components/Shared/ImageCropperController";
import PFPUpload from "@components/Shared/PFPUpload";
import uploadCroppedImage, { readFile } from "@helpers/accountPictureUtils";
import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { COVER, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import getAccountAttribute from "@hey/helpers/getAccountAttribute";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import trimify from "@hey/helpers/trimify";
import { getCroppedImg } from "@hey/image-cropper/cropUtils";
import type { Area } from "@hey/image-cropper/types";
import { useSetAccountMetadataMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Modal,
  TextArea,
  useZodForm
} from "@hey/ui";
import type {
  AccountOptions,
  MetadataAttribute
} from "@lens-protocol/metadata";
import {
  MetadataAttributeType,
  account as accountMetadata
} from "@lens-protocol/metadata";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";
import type { z } from "zod";
import { object, string, union } from "zod";

const validationSchema = object({
  bio: string().max(260, { message: "Bio should not exceed 260 characters" }),
  location: string().max(100, {
    message: "Location should not exceed 100 characters"
  }),
  name: string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.accountNameValidator, {
      message: "Account name must not contain restricted symbols"
    }),
  website: union([
    string().regex(Regex.url, { message: "Invalid website" }),
    string().max(0)
  ]),
  x: string().max(100, { message: "X handle must not exceed 100 characters" })
});

const AccountSettingsForm: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);

  const [pfpUrl, setPfpUrl] = useState<string | undefined>();

  // Cover Picture
  const [coverPictureIpfsUrl, setCoverPictureIpfsUrl] = useState(
    currentAccount?.metadata?.coverPicture?.__typename === "ImageSet"
      ? currentAccount?.metadata?.coverPicture?.raw.uri
      : ""
  );
  const [coverPictureSrc, setCoverPictureSrc] = useState("");
  const [showCoverPictureCropModal, setShowCoverPictureCropModal] =
    useState(false);
  const [croppedCoverPictureAreaPixels, setCoverPictureCroppedAreaPixels] =
    useState<Area | null>(null);
  const [uploadedCoverPictureUrl, setUploadedCoverPictureUrl] = useState("");
  const [uploadingCoverPicture, setUploadingCoverPicture] = useState(false);

  const { data: walletClient } = useWalletClient();

  const onCompleted = (hash: string) => {
    setIsLoading(false);
    addSimpleOptimisticTransaction(hash, OptimisticTxType.SET_ACCOUNT_METADATA);
    toast.success("Account updated");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [setAccountMetadata] = useSetAccountMetadataMutation({
    onCompleted: async ({ setAccountMetadata }) => {
      if (setAccountMetadata.__typename === "SetAccountMetadataResponse") {
        return onCompleted(setAccountMetadata.hash);
      }

      if (walletClient) {
        try {
          if (setAccountMetadata.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(setAccountMetadata.raw)
            });

            return onCompleted(hash);
          }

          if (
            setAccountMetadata.__typename === "SelfFundedTransactionRequest"
          ) {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(setAccountMetadata.raw)
            });

            return onCompleted(hash);
          }

          if (setAccountMetadata.__typename === "TransactionWillFail") {
            return toast.error(setAccountMetadata.reason);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (setAccountMetadata.__typename === "TransactionWillFail") {
        return toast.error(setAccountMetadata.reason);
      }
    },
    onError
  });

  const form = useZodForm({
    defaultValues: {
      bio: currentAccount?.metadata?.bio || "",
      location: getAccountAttribute(
        "location",
        currentAccount?.metadata?.attributes
      ),
      name: currentAccount?.metadata?.name || "",
      website: getAccountAttribute(
        "website",
        currentAccount?.metadata?.attributes
      ),
      x: getAccountAttribute(
        "x",
        currentAccount?.metadata?.attributes
      )?.replace(/(https:\/\/)?x\.com\//, "")
    },
    schema: validationSchema
  });

  const editProfile = async (data: z.infer<typeof validationSchema>) => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const otherAttributes =
        currentAccount.metadata?.attributes
          ?.filter(
            (attr) =>
              !["app", "location", "timestamp", "website", "x"].includes(
                attr.key
              )
          )
          .map(({ key, type, value }) => ({
            key,
            type: MetadataAttributeType[type] as any,
            value
          })) || [];

      const preparedAccountMetadata: AccountOptions = {
        ...(data.name && { name: data.name }),
        ...(data.bio && { bio: data.bio }),
        attributes: [
          ...(otherAttributes as MetadataAttribute[]),
          {
            key: "location",
            type: MetadataAttributeType.STRING,
            value: data.location
          },
          {
            key: "website",
            type: MetadataAttributeType.STRING,
            value: data.website
          },
          { key: "x", type: MetadataAttributeType.STRING, value: data.x },
          {
            key: "timestamp",
            type: MetadataAttributeType.STRING,
            value: new Date().toISOString()
          }
        ],
        coverPicture: coverPictureIpfsUrl ? coverPictureIpfsUrl : undefined,
        picture: pfpUrl
      };
      preparedAccountMetadata.attributes =
        preparedAccountMetadata.attributes?.filter((m) => {
          return m.key !== "" && Boolean(trimify(m.value));
        });
      const metadata = accountMetadata(preparedAccountMetadata);
      const metadataUri = await uploadMetadata(metadata);

      return await setAccountMetadata({
        variables: { request: { metadataUri } }
      });
    } catch (error) {
      onError(error);
    }
  };

  const handleUploadAndSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        coverPictureSrc,
        croppedCoverPictureAreaPixels
      );

      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }

      setUploadingCoverPicture(true);

      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL("image/png");

      setCoverPictureIpfsUrl(ipfsUrl);
      setUploadedCoverPictureUrl(dataUrl);
    } catch (error) {
      onError(error);
    } finally {
      setShowCoverPictureCropModal(false);
      setUploadingCoverPicture(false);
    }
  };

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      setCoverPictureSrc(await readFile(file));
      setShowCoverPictureCropModal(true);
    }
  };

  const coverPictureUrl =
    currentAccount?.metadata?.coverPicture?.optimized?.uri ||
    `${STATIC_IMAGES_URL}/patterns/2.svg`;
  const renderCoverPictureUrl = coverPictureUrl
    ? imageKit(sanitizeDStorageUrl(coverPictureUrl), COVER)
    : "";

  return (
    <>
      <Card className="p-5">
        <Form className="space-y-4" form={form} onSubmit={editProfile}>
          <Input
            disabled
            label="Account Id"
            type="text"
            value={currentAccount?.address}
          />
          <Input
            label="Name"
            placeholder="Gavin"
            type="text"
            {...form.register("name")}
          />
          <Input
            label="Location"
            placeholder="Miami"
            type="text"
            {...form.register("location")}
          />
          <Input
            label="Website"
            placeholder="https://hooli.com"
            type="text"
            {...form.register("website")}
          />
          <Input
            label="X"
            placeholder="gavin"
            prefix="https://x.com"
            type="text"
            {...form.register("x")}
          />
          <TextArea
            label="Bio"
            placeholder="Tell us something about you!"
            {...form.register("bio")}
          />
          <PFPUpload src={pfpUrl || ""} setSrc={(src) => setPfpUrl(src)} />
          <div className="space-y-1.5">
            <div className="label">Cover</div>
            <div className="space-y-3">
              <div>
                <Image
                  alt="Cover picture crop preview"
                  className="h-[175px] w-[675px] rounded-lg object-cover"
                  onError={({ currentTarget }) => {
                    currentTarget.src =
                      sanitizeDStorageUrl(coverPictureIpfsUrl);
                  }}
                  src={uploadedCoverPictureUrl || renderCoverPictureUrl}
                />
              </div>
              <ChooseFile onChange={(event) => onFileChange(event)} />
            </div>
          </div>
          <Button
            className="ml-auto"
            disabled={
              isLoading ||
              (!form.formState.isDirty && !coverPictureSrc && !pfpUrl)
            }
            type="submit"
          >
            Save
          </Button>
        </Form>
      </Card>
      <Modal
        onClose={
          isLoading
            ? undefined
            : () => {
                setCoverPictureSrc("");
                setShowCoverPictureCropModal(false);
              }
        }
        show={showCoverPictureCropModal}
        size="lg"
        title="Crop cover picture"
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={coverPictureSrc}
            setCroppedAreaPixels={setCoverPictureCroppedAreaPixels}
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
              disabled={uploadingCoverPicture || !coverPictureSrc}
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

export default AccountSettingsForm;
