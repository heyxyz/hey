import ChooseFile from '@components/Shared/ChooseFile';
import { PencilIcon } from '@heroicons/react/outline';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import uploadCroppedImage, { readFile } from '@lib/profilePictureUtils';
import uploadToArweave from '@lib/uploadToArweave';
import { t, Trans } from '@lingui/macro';
import { LensPeriphery } from 'abis';
import {
  APP_NAME,
  COVER,
  LENS_PERIPHERY,
  PROFILE_NAME_VALIDATOR_REGEX,
  URL_REGEX
} from 'data/constants';
import Errors from 'data/errors';
import { getCroppedImg } from 'image-cropper/cropUtils';
import type { Area } from 'image-cropper/types';
import type {
  CreatePublicSetProfileMetadataUriRequest,
  MediaSet,
  Profile
} from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from 'lens';
import getProfileAttribute from 'lib/getProfileAttribute';
import getSignature from 'lib/getSignature';
import hasPrideLogo from 'lib/hasPrideLogo';
import imageKit from 'lib/imageKit';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
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
  Toggle,
  useZodForm
} from 'ui';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string, union } from 'zod';

import ImageCropperController from './ImageCropperController';

const editProfileSchema = object({
  name: string()
    .max(100, {
      message: t`Name should not exceed 100 characters`
    })
    .regex(PROFILE_NAME_VALIDATOR_REGEX, {
      message: t`Profile name must not contain restricted symbols`
    }),
  location: string().max(100, {
    message: t`Location should not exceed 100 characters`
  }),
  website: union([
    string().regex(URL_REGEX, { message: t`Invalid website` }),
    string().max(0)
  ]),
  twitter: string().max(100, {
    message: t`Twitter should not exceed 100 characters`
  }),
  bio: string().max(260, { message: t`Bio should not exceed 260 characters` })
});

interface ProfileSettingsFormProps {
  profile: Profile & { coverPicture: MediaSet };
}

const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [pride, setPride] = useState(hasPrideLogo(profile));
  const [coverIpfsUrl, setCoverIpfsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

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
      twitter: getProfileAttribute(profile?.attributes, 'twitter')?.replace(
        /(https:\/\/)?twitter\.com\//,
        ''
      ),
      bio: profile?.bio ?? ''
    }
  });

  const editProfile = async (
    name: string,
    location: string | null,
    website?: string | null,
    twitter?: string | null,
    bio?: string | null
  ) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
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
                  'twitter',
                  'hasPrideLogo',
                  'statusEmoji',
                  'statusMessage',
                  'app'
                ].includes(attr.key)
            )
            .map(({ key, value }) => ({ key, value })) ?? []),
          { key: 'location', value: location },
          { key: 'website', value: website },
          { key: 'twitter', value: twitter },
          { key: 'hasPrideLogo', value: pride },
          {
            key: 'statusEmoji',
            value: getProfileAttribute(profile?.attributes, 'statusEmoji')
          },
          {
            key: 'statusMessage',
            value: getProfileAttribute(profile?.attributes, 'statusMessage')
          },
          { key: 'app', value: APP_NAME }
        ],
        version: '1.0.0',
        metadata_id: uuid()
      });

      const request: CreatePublicSetProfileMetadataUriRequest = {
        profileId: currentProfile?.id,
        metadata: `https://arweave.net/${id}`
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
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedImage) {
      return toast.error(Errors.SomethingWentWrong);
    }

    try {
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
          onSubmit={({ name, location, website, twitter, bio }) => {
            editProfile(name, location, website, twitter, bio);
          }}
        >
          {error && (
            <ErrorMessage
              className="mb-3"
              title={t`Transaction failed!`}
              error={error}
            />
          )}
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
            label={t`Twitter`}
            type="text"
            prefix="https://twitter.com"
            placeholder="gavin"
            {...form.register('twitter')}
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
                {uploading && <Spinner size="sm" />}
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <div className="label flex items-center space-x-2">
              <img className="h-5 w-5" src="/pride.svg" alt="Pride Logo" />
              <span>
                <Trans>Celebrate pride every day</Trans>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle on={pride} setOn={setPride} />
              <div className="lt-text-gray-500">
                <Trans>
                  Turn this on to show your pride and turn the {APP_NAME} logo
                  rainbow every day.
                </Trans>
              </div>
            </div>
          </div>
          <Button
            className="ml-auto"
            type="submit"
            disabled={isLoading}
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
