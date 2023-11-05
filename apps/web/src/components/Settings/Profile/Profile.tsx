import ChooseFile from '@components/Shared/ChooseFile';
import ImageCropperController from '@components/Shared/ImageCropperController';
import { PencilIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import {
  ARWEAVE_GATEWAY,
  AVATAR,
  COVER,
  LENSHUB_PROXY,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { Regex } from '@hey/data/regex';
import { SETTINGS } from '@hey/data/tracking';
import { getCroppedImg } from '@hey/image-cropper/cropUtils';
import type { Area } from '@hey/image-cropper/types';
import type { OnchainSetProfileMetadataRequest, Profile } from '@hey/lens';
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  useSetProfileMetadataMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getAvatar from '@hey/lib/getAvatar';
import getProfileAttribute from '@hey/lib/getProfileAttribute';
import getSignature from '@hey/lib/getSignature';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import trimify from '@hey/lib/trimify';
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
import type {
  MetadataAttribute,
  ProfileOptions
} from '@lens-protocol/metadata';
import {
  MetadataAttributeType,
  profile as profileMetadata
} from '@lens-protocol/metadata';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import uploadCroppedImage, { readFile } from '@lib/profilePictureUtils';
import uploadToArweave from '@lib/uploadToArweave';
import type { ChangeEvent, FC } from 'react';
import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/useAppStore';
import urlcat from 'urlcat';
import { useContractWrite, useSignTypedData } from 'wagmi';
import type { z } from 'zod';
import { object, string, union } from 'zod';

const editProfileSchema = object({
  name: string()
    .max(100, { message: 'Name should not exceed 100 characters' })
    .regex(Regex.profileNameValidator, {
      message: 'Profile name must not contain restricted symbols'
    }),
  location: string().max(100, {
    message: 'Location should not exceed 100 characters'
  }),
  website: union([
    string().regex(Regex.url, { message: 'Invalid website' }),
    string().max(0)
  ]),
  x: string().max(100, { message: 'X handle must not exceed 100 characters' }),
  bio: string().max(260, { message: 'Bio should not exceed 260 characters' })
});

type FormData = z.infer<typeof editProfileSchema>;

interface ProfileSettingsFormProps {
  profile: Profile;
}

const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isLoading, setIsLoading] = useState(false);

  // Cover Picture
  const [coverPictureIpfsUrl, setCoverPictureIpfsUrl] = useState('');
  const [coverPictureSrc, setCoverPictureSrc] = useState('');
  const [showCoverPictureCropModal, setShowCoverPictureCropModal] =
    useState(false);
  const [croppedCoverPictureAreaPixels, setCoverPictureCroppedAreaPixels] =
    useState<Area | null>(null);
  const [uploadedCoverPictureUrl, setUploadedCoverPictureUrl] = useState('');
  const [uploadingCoverPicture, setUploadingCoverPicture] = useState(false);

  // Picture
  const [profilePictureIpfsUrl, setProfilePictureIpfsUrl] = useState('');
  const [profilePictureSrc, setProfilePictureSrc] = useState('');
  const [showProfilePictureCropModal, setShowProfilePictureCropModal] =
    useState(false);
  const [croppedProfilePictureAreaPixels, setCroppedProfilePictureAreaPixels] =
    useState<Area | null>(null);
  const [uploadedProfilePictureUrl, setUploadedProfilePictureUrl] =
    useState('');
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);

  const handleWrongNetwork = useHandleWrongNetwork();

  // Lens manager
  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

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
    toast.success('Profile updated successfully!');
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
        const { profileId, metadataURI } = typedData.value;

        if (canBroadcast) {
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return write({ args: [profileId, metadataURI] });
          }
        }

        return write({ args: [profileId, metadataURI] });
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
      name: profile?.metadata?.displayName ?? '',
      location: getProfileAttribute(profile?.metadata?.attributes, 'location'),
      website: getProfileAttribute(profile?.metadata?.attributes, 'website'),
      x: getProfileAttribute(profile?.metadata?.attributes, 'x')?.replace(
        /(https:\/\/)?x\.com\//,
        ''
      ),
      bio: profile?.metadata?.bio ?? ''
    }
  });

  const editProfile = async (data: FormData) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      const otherAttributes =
        profile.metadata?.attributes
          ?.filter(
            (attr) =>
              !['location', 'website', 'x', 'timestamp', 'app'].includes(
                attr.key
              )
          )
          .map(({ key, value, type }) => ({
            key,
            value,
            type: MetadataAttributeType[type] as any
          })) ?? [];

      const preparedProfileMetadata: ProfileOptions = {
        ...(data.name && { name: data.name }),
        ...(data.bio && { bio: data.bio }),
        picture: profilePictureIpfsUrl ? profilePictureIpfsUrl : undefined,
        coverPicture: coverPictureIpfsUrl ? coverPictureIpfsUrl : undefined,
        attributes: [
          ...(otherAttributes as MetadataAttribute[]),
          {
            type: MetadataAttributeType.STRING,
            key: 'location',
            value: data.location
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'website',
            value: data.website
          },
          { type: MetadataAttributeType.STRING, key: 'x', value: data.x },
          {
            type: MetadataAttributeType.STRING,
            key: 'timestamp',
            value: new Date().toISOString()
          }
        ]
      };
      preparedProfileMetadata.attributes =
        preparedProfileMetadata.attributes?.filter((m) =>
          Boolean(trimify(m.value))
        );
      const metadata = profileMetadata(preparedProfileMetadata);
      const hash = await uploadToArweave(metadata);

      const request: OnchainSetProfileMetadataRequest = {
        metadataURI: urlcat(`${ARWEAVE_GATEWAY}/:hash`, { hash })
      };

      if (canUseLensManager) {
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
        type === 'avatar' ? profilePictureSrc : coverPictureSrc,
        type === 'avatar'
          ? croppedProfilePictureAreaPixels
          : croppedCoverPictureAreaPixels
      );

      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Update Loading State
      if (type === 'avatar') {
        setUploadingProfilePicture(true);
      } else if (type === 'cover') {
        setUploadingCoverPicture(true);
      }

      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL('image/png');

      // Update Profile Picture
      if (type === 'avatar') {
        setProfilePictureIpfsUrl(ipfsUrl);
        setUploadedProfilePictureUrl(dataUrl);
      } else if (type === 'cover') {
        setCoverPictureIpfsUrl(ipfsUrl);
        setUploadedCoverPictureUrl(dataUrl);
      }
    } catch (error) {
      onError(error);
    } finally {
      setShowCoverPictureCropModal(false);
      setShowProfilePictureCropModal(false);
      setUploadingCoverPicture(false);
      setUploadingProfilePicture(false);
    }
  };

  const onFileChange = async (
    evt: ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = evt.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        setProfilePictureSrc(await readFile(file));
        setShowProfilePictureCropModal(true);
      } else if (type === 'cover') {
        setCoverPictureSrc(await readFile(file));
        setShowCoverPictureCropModal(true);
      }
    }
  };

  const coverPictureUrl =
    profile?.metadata?.coverPicture?.optimized?.uri ||
    `${STATIC_IMAGES_URL}/patterns/2.svg`;
  const renderCoverPictureUrl = coverPictureUrl
    ? imageKit(sanitizeDStorageUrl(coverPictureUrl), COVER)
    : '';

  const profilePictureUrl = getAvatar(profile);
  const renderProfilePictureUrl = profilePictureUrl
    ? imageKit(sanitizeDStorageUrl(profilePictureUrl), AVATAR)
    : '';

  return (
    <>
      <Card className="p-5">
        <Form
          form={form}
          className="space-y-4"
          onSubmit={(data) => editProfile(data)}
        >
          {error ? (
            <ErrorMessage
              title="Transaction failed!"
              error={error}
              className="mb-3"
            />
          ) : null}
          <Input
            label="Profile Id"
            type="text"
            value={currentProfile?.id}
            disabled
          />
          <Input
            label="Name"
            type="text"
            placeholder="Gavin"
            {...form.register('name')}
          />
          <Input
            label="Location"
            type="text"
            placeholder="Miami"
            {...form.register('location')}
          />
          <Input
            label="Website"
            type="text"
            placeholder="https://hooli.com"
            {...form.register('website')}
          />
          <Input
            label="X"
            type="text"
            prefix="https://x.com"
            placeholder="gavin"
            {...form.register('x')}
          />
          <TextArea
            label="Bio"
            placeholder="Tell us something about you!"
            {...form.register('bio')}
          />
          <div className="space-y-1.5">
            <div className="label">Avatar</div>
            <div className="space-y-3">
              <Image
                className="max-w-xs rounded-lg"
                onError={({ currentTarget }) => {
                  currentTarget.src = sanitizeDStorageUrl(
                    profilePictureIpfsUrl
                  );
                }}
                src={uploadedProfilePictureUrl || renderProfilePictureUrl}
                alt="Profile picture crop preview"
              />
              <ChooseFile onChange={(event) => onFileChange(event, 'avatar')} />
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
                      sanitizeDStorageUrl(coverPictureIpfsUrl);
                  }}
                  src={uploadedCoverPictureUrl || renderCoverPictureUrl}
                  alt="Cover picture crop preview"
                />
              </div>
              <ChooseFile onChange={(event) => onFileChange(event, 'cover')} />
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
            Save
          </Button>
        </Form>
      </Card>
      <Modal
        title="Crop cover picture"
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
            disabled={uploadingCoverPicture || !coverPictureSrc}
            onClick={() => uploadAndSave('cover')}
            icon={
              uploadingCoverPicture ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="h-4 w-4" />
              )
            }
          >
            Upload
          </Button>
        </div>
      </Modal>
      {/* Picture */}
      <Modal
        title="Crop profile picture"
        show={showProfilePictureCropModal}
        size="sm"
        onClose={
          isLoading
            ? undefined
            : () => {
                setCoverPictureSrc('');
                setShowProfilePictureCropModal(false);
              }
        }
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={profilePictureSrc}
            setCroppedAreaPixels={setCroppedProfilePictureAreaPixels}
            targetSize={{ width: 300, height: 300 }}
          />
          <Button
            type="submit"
            disabled={uploadingProfilePicture || !profilePictureSrc}
            onClick={() => uploadAndSave('avatar')}
            icon={
              uploadingProfilePicture ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="h-4 w-4" />
              )
            }
          >
            Upload
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default memo(ProfileSettingsForm);
