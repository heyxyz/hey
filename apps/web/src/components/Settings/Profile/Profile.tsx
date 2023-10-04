import ChooseFile from '@components/Shared/ChooseFile';
import ImageCropperController from '@components/Shared/ImageCropperController';
import { PencilIcon } from '@heroicons/react/24/outline';
import { LensPeriphery } from '@hey/abis';
import { COVER, LENS_PERIPHERY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { Regex } from '@hey/data/regex';
import { SETTINGS } from '@hey/data/tracking';
import { getCroppedImg } from '@hey/image-cropper/cropUtils';
import type { Area } from '@hey/image-cropper/types';
import type {
  CreatePublicSetProfileMetadataUriRequest,
  MediaSet,
  Profile
} from '@hey/lens';
import {
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from '@hey/lens';
import getProfileAttribute from '@hey/lib/getProfileAttribute';
import getSignature from '@hey/lib/getSignature';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import {
  Button,
  Card,
  ErrorMessage,
  Form,
  Image,
  Input,
  Modal,
  Spinner,
  TextArea,
  useZodForm
} from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import uploadCroppedImage, { readFile } from '@lib/profilePictureUtils';
import uploadToArweave from '@lib/uploadToArweave';
import { t, Trans } from '@lingui/macro';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/app';
import urlcat from 'urlcat';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string, union } from 'zod';

const editProfileSchema = object({
  name: string()
    .max(100, {
      message: t`Name should not exceed 100 characters`
    })
    .regex(Regex.profileNameValidator, {
      message: t`Profile name must not contain restricted symbols`
    }),
  location: string().max(100, {
    message: t`Location should not exceed 100 characters`
  }),
  website: union([
    string().regex(Regex.url, { message: t`Invalid website` }),
    string().max(0)
  ]),
  x: string().max(100, {
    message: t`X handle must not exceed 100 characters`
  }),
  bio: string().max(260, { message: t`Bio should not exceed 260 characters` })
});

interface ProfileSettingsFormProps {
  profile: Profile & { coverPicture: MediaSet };
}

const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [coverIpfsUrl, setCoverIpfsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const handleWrongNetwork = useHandleWrongNetwork();

  // Dispatcher
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;
  const isSponsored = currentProfile?.dispatcher?.sponsor;

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success(t`Profile updated successfully!`);
    Leafwatch.track(SETTINGS.PROFILE.UPDATE);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { error, write } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: 'setProfileMetadataURI',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });
  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createSetProfileMetadataTypedData }) => {
        const { id, typedData } = createSetProfileMetadataTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast.__typename === 'RelayError') {
          const { profileId, metadata } = typedData.value;
          return write?.({ args: [profileId, metadata] });
        }
      },
      onError
    });

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onCompleted: ({ createSetProfileMetadataViaDispatcher }) =>
        onCompleted(createSetProfileMetadataViaDispatcher.__typename),
      onError
    });

  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    });
    if (
      data?.createSetProfileMetadataViaDispatcher?.__typename === 'RelayError'
    ) {
      return await createSetProfileMetadataTypedData({
        variables: { request }
      });
    }
  };

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: profile?.name ?? '',
      location: getProfileAttribute(profile?.attributes, 'location'),
      website: getProfileAttribute(profile?.attributes, 'website'),
      x: getProfileAttribute(profile?.attributes, 'x')?.replace(
        /(https:\/\/)?x\.com\//,
        ''
      ),
      bio: profile?.bio ?? ''
    }
  });

  const editProfile = async (
    name: string,
    location: string | null,
    website?: string | null,
    x?: string | null,
    bio?: string | null
  ) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      const id = await uploadToArweave({
        name,
        bio,
        cover_picture: coverIpfsUrl ? coverIpfsUrl : null,
        attributes: [
          ...(profile?.attributes
            ?.filter(
              (attr) =>
                ![
                  'location',
                  'website',
                  'x',
                  'statusEmoji',
                  'statusMessage',
                  'app'
                ].includes(attr.key)
            )
            .map(({ key, value }) => ({ key, value })) ?? []),
          { key: 'location', value: location },
          { key: 'website', value: website },
          { key: 'x', value: x },
          {
            key: 'statusEmoji',
            value: getProfileAttribute(profile?.attributes, 'statusEmoji')
          },
          {
            key: 'statusMessage',
            value: getProfileAttribute(profile?.attributes, 'statusMessage')
          }
        ],
        version: '1.0.0',
        metadata_id: uuid()
      });

      const request: CreatePublicSetProfileMetadataUriRequest = {
        profileId: currentProfile?.id,
        metadata: urlcat('https://arweave.net/:id', { id })
      };

      if (canUseRelay && isSponsored) {
        return await createViaDispatcher(request);
      }

      return await createSetProfileMetadataTypedData({
        variables: { request }
      });
    } catch (error) {
      onError(error);
    }
  };

  const uploadAndSave = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }
      setUploading(true);
      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL('image/png');
      setCoverIpfsUrl(ipfsUrl);
      setUploadedImageUrl(dataUrl);
    } catch (error) {
      onError(error);
    } finally {
      setShowCropModal(false);
      setUploading(false);
    }
  };

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      setImageSrc(await readFile(file));
      setShowCropModal(true);
    }
  };

  const coverPictureUrl = profile?.coverPicture?.original?.url;
  const coverPictureIpfsUrl = coverPictureUrl
    ? imageKit(sanitizeDStorageUrl(coverPictureUrl), COVER)
    : '';

  return (
    <>
      <Card className="p-5">
        <Form
          form={form}
          className="space-y-4"
          onSubmit={({ name, location, website, x, bio }) => {
            editProfile(name, location, website, x, bio);
          }}
        >
          {error ? (
            <ErrorMessage
              className="mb-3"
              title={t`Transaction failed!`}
              error={error}
            />
          ) : null}
          <Input
            label={t`Profile Id`}
            type="text"
            value={currentProfile?.id}
            disabled
          />
          <Input
            label={t`Name`}
            type="text"
            placeholder="Gavin"
            {...form.register('name')}
          />
          <Input
            label={t`Location`}
            type="text"
            placeholder="Miami"
            {...form.register('location')}
          />
          <Input
            label={t`Website`}
            type="text"
            placeholder="https://hooli.com"
            {...form.register('website')}
          />
          <Input
            label={t`X`}
            type="text"
            prefix="https://x.com"
            placeholder="gavin"
            {...form.register('x')}
          />
          <TextArea
            label={t`Bio`}
            placeholder={t`Tell us something about you!`}
            {...form.register('bio')}
          />
          <div className="space-y-1.5">
            <div className="label">Cover</div>
            <div className="space-y-3">
              <div>
                <Image
                  className="h-60 w-full rounded-lg object-cover"
                  onError={({ currentTarget }) => {
                    currentTarget.src = sanitizeDStorageUrl(coverIpfsUrl);
                  }}
                  src={uploadedImageUrl || coverPictureIpfsUrl}
                  alt={t`Cover picture crop preview`}
                />
              </div>
              <div className="flex items-center space-x-3">
                <ChooseFile onChange={onFileChange} />
                {uploading ? <Spinner size="sm" /> : null}
              </div>
            </div>
          </div>
          <Button
            className="ml-auto"
            type="submit"
            disabled={isLoading || (!form.formState.isDirty && !imageSrc)}
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
        </Form>
      </Card>
      <Modal
        title={t`Crop image`}
        show={showCropModal}
        size="md"
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
            targetSize={{ width: 1500, height: 500 }}
          />
          <Button
            type="submit"
            disabled={uploading || !imageSrc}
            onClick={uploadAndSave}
            icon={
              uploading ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="h-4 w-4" />
              )
            }
          >
            <Trans>Upload</Trans>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProfileSettingsForm;
