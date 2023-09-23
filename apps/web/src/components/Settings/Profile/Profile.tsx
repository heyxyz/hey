import ChooseFile from '@components/Shared/ChooseFile';
import ImageCropperController from '@components/Shared/ImageCropperController';
import { PencilIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@lenster/abis';
import {
  AVATAR,
  COVER,
  LENSHUB_PROXY,
  STATIC_IMAGES_URL
} from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import { SETTINGS } from '@lenster/data/tracking';
import { getCroppedImg } from '@lenster/image-cropper/cropUtils';
import type { Area } from '@lenster/image-cropper/types';
import type { OnchainSetProfileMetadataRequest, Profile } from '@lenster/lens';
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  useSetProfileMetadataMutation
} from '@lenster/lens';
import getAvatarUrl from '@lenster/lib/getAvatarUrl';
import getProfileAttribute from '@lenster/lib/getProfileAttribute';
import getSignature from '@lenster/lib/getSignature';
import imageKit from '@lenster/lib/imageKit';
import sanitizeDStorageUrl from '@lenster/lib/sanitizeDStorageUrl';
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
} from '@lenster/ui';
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
  profile: Profile;
}

const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cover Picture
  const [profileCoverIpfsUrl, setProfileCoverIpfsUrl] = useState('');
  const [coverPictureSrc, setCoverPictureSrc] = useState('');
  const [showCoverPictureCropModal, setShowCoverPictureCropModal] =
    useState(false);
  const [croppedCoverPictureAreaPixels, setCoverPictureCroppedAreaPixels] =
    useState<Area | null>(null);
  const [uploadedCoverPictureUrl, setUploadedCoverPictureUrl] = useState('');

  // Picture
  const [profilePictureIpfsUrl, setProfilePictureIpfsUrl] = useState('');
  const [pictureSrc, setPictureSrc] = useState('');
  const [showPictureCropModal, setShowPictureCropModal] = useState(false);
  const [croppedPictureAreaPixels, setPictureCroppedAreaPixels] =
    useState<Area | null>(null);
  const [uploadedPictureUrl, setUploadedPictureUrl] = useState('');

  const handleWrongNetwork = useHandleWrongNetwork();

  // Dispatcher
  const canUseRelay = currentProfile?.lensManager;
  const isSponsored = currentProfile?.sponsor;

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
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
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setProfileMetadataURI',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createOnchainSetProfileMetadataTypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { id, typedData } = createOnchainSetProfileMetadataTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          const { profileId, metadataURI } = typedData.value;
          return write?.({ args: [profileId, metadataURI] });
        }
      },
      onError
    });

  const [setProfileMetadata] = useSetProfileMetadataMutation({
    onCompleted: ({ setProfileMetadata }) =>
      onCompleted(setProfileMetadata.__typename),
    onError
  });

  const updateProfile = async (request: OnchainSetProfileMetadataRequest) => {
    const { data } = await setProfileMetadata({
      variables: { request }
    });
    if (
      data?.setProfileMetadata?.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createOnchainSetProfileMetadataTypedData({
        variables: { request }
      });
    }
  };

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: profile.metadata?.displayName ?? '',
      location: getProfileAttribute(profile.metadata?.attributes, 'location'),
      website: getProfileAttribute(profile.metadata?.attributes, 'website'),
      x: getProfileAttribute(profile.metadata?.attributes, 'x')?.replace(
        /(https:\/\/)?x\.com\//,
        ''
      ),
      bio: profile.metadata?.bio ?? ''
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
        cover_picture: profileCoverIpfsUrl ? profileCoverIpfsUrl : null,
        attributes: [
          ...(profile?.metadata?.attributes
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
            value: getProfileAttribute(
              profile.metadata?.attributes,
              'statusEmoji'
            )
          },
          {
            key: 'statusMessage',
            value: getProfileAttribute(
              profile.metadata?.attributes,
              'statusMessage'
            )
          }
        ],
        version: '1.0.0',
        metadata_id: uuid()
      });

      const request: OnchainSetProfileMetadataRequest = {
        metadataURI: `https://arweave.net/${id}`
      };

      if (canUseRelay && isSponsored) {
        return await updateProfile(request);
      }

      return await createOnchainSetProfileMetadataTypedData({
        variables: { request }
      });
    } catch (error) {
      onError(error);
    }
  };

  const uploadAndSave = async (type: 'avatar' | 'cover') => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      const croppedImage = await getCroppedImg(
        type === 'avatar' ? pictureSrc : coverPictureSrc,
        type === 'avatar'
          ? croppedPictureAreaPixels
          : croppedCoverPictureAreaPixels
      );
      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }
      setUploading(true);
      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL('image/png');

      if (type === 'avatar') {
        setProfileCoverIpfsUrl(ipfsUrl);
        setUploadedCoverPictureUrl(dataUrl);
      } else if (type === 'cover') {
        setProfilePictureIpfsUrl(ipfsUrl);
        setUploadedPictureUrl(dataUrl);
      }
    } catch (error) {
      onError(error);
    } finally {
      setShowCoverPictureCropModal(false);
      setUploading(false);
    }
  };

  const onFileChange = async (
    evt: ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = evt.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        setPictureSrc(await readFile(file));
        setShowPictureCropModal(true);
      } else if (type === 'cover') {
        setCoverPictureSrc(await readFile(file));
        setShowCoverPictureCropModal(true);
      }
    }
  };

  const coverPictureUrl =
    profile?.metadata?.coverPicture?.raw.uri ||
    profile?.metadata?.coverPicture?.optimized?.uri ||
    `${STATIC_IMAGES_URL}/patterns/2.svg`;
  const coverPictureIpfsUrl = coverPictureUrl
    ? imageKit(sanitizeDStorageUrl(coverPictureUrl), COVER)
    : '';

  const pictureUrl = getAvatarUrl(profile);
  const pictureIpfsUrl = pictureUrl
    ? imageKit(sanitizeDStorageUrl(pictureUrl), AVATAR)
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
            <div className="label">Avatar</div>
            <div className="space-y-3">
              <Image
                className="max-w-xs rounded-lg"
                src={uploadedPictureUrl || pictureIpfsUrl}
                alt={t`Profile picture crop preview`}
              />
              <div className="flex items-center space-x-3">
                <ChooseFile
                  onChange={(event) => onFileChange(event, 'avatar')}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="label">Cover</div>
            <div className="space-y-3">
              <div>
                <Image
                  className="h-60 w-full rounded-lg object-cover"
                  onError={({ currentTarget }) => {
                    currentTarget.src =
                      sanitizeDStorageUrl(profileCoverIpfsUrl);
                  }}
                  src={uploadedCoverPictureUrl || coverPictureIpfsUrl}
                  alt={t`Cover picture crop preview`}
                />
              </div>
              <div className="flex items-center space-x-3">
                <ChooseFile
                  onChange={(event) => onFileChange(event, 'cover')}
                />
                {uploading ? <Spinner size="sm" /> : null}
              </div>
            </div>
          </div>
          <Button
            className="ml-auto"
            type="submit"
            disabled={
              isLoading || (!form.formState.isDirty && !coverPictureSrc)
            }
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
        show={showCoverPictureCropModal}
        size="md"
        onClose={
          isLoading
            ? undefined
            : () => {
                setCoverPictureSrc('');
                setShowCoverPictureCropModal(false);
              }
        }
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={coverPictureSrc}
            setCroppedAreaPixels={setCoverPictureCroppedAreaPixels}
            targetSize={{ width: 1500, height: 500 }}
          />
          <Button
            type="submit"
            disabled={uploading || !coverPictureSrc}
            onClick={() => uploadAndSave('cover')}
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
      {/* Picture */}
      <Modal
        title={t`Crop image`}
        show={showPictureCropModal}
        size="sm"
        onClose={
          isLoading
            ? undefined
            : () => {
                setCoverPictureSrc('');
                setShowPictureCropModal(false);
              }
        }
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={pictureSrc}
            setCroppedAreaPixels={setPictureCroppedAreaPixels}
            targetSize={{ width: 300, height: 300 }}
          />
          <Button
            type="submit"
            disabled={isLoading || !pictureSrc}
            onClick={() => uploadAndSave('avatar')}
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
    </>
  );
};

export default ProfileSettingsForm;
