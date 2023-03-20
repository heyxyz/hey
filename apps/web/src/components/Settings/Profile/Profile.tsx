import ChooseFile from '@components/Shared/ChooseFile';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Image } from '@components/UI/Image';
import { Input } from '@components/UI/Input';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { TextArea } from '@components/UI/TextArea';
import { Toggle } from '@components/UI/Toggle';
import { PencilIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import uploadCroppedImage, { readFile } from '@lib/profilePictureUtils';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import { t, Trans } from '@lingui/macro';
import { LensPeriphery } from 'abis';
import { APP_NAME, COVER, ERROR_MESSAGE, LENS_PERIPHERY, SIGN_WALLET, URL_REGEX } from 'data/constants';
import { getCroppedImg } from 'image-cropper/cropUtils';
import type { Area } from 'image-cropper/types';
import type { CreatePublicSetProfileMetadataUriRequest, MediaSet, Profile } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from 'lens';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import getIPFSLink from 'utils/getIPFSLink';
import getProfileAttribute from 'utils/getProfileAttribute';
import getSignature from 'utils/getSignature';
import hasPrideLogo from 'utils/hasPrideLogo';
import imageProxy from 'utils/imageProxy';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string, union } from 'zod';

import ImageCropperController from './ImageCropperController';

const editProfileSchema = object({
  name: string().max(100, { message: t`Name should not exceed 100 characters` }),
  location: string().max(100, {
    message: t`Location should not exceed 100 characters`
  }),
  website: union([string().regex(URL_REGEX, { message: t`Invalid website` }), string().max(0)]),
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
  const [cover, setCover] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const onCompleted = () => {
    toast.success(t`Profile updated successfully!`);
    Mixpanel.track(SETTINGS.PROFILE.UPDATE);
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted
  });
  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createSetProfileMetadataTypedData }) => {
        const { id, typedData } = createSetProfileMetadataTypedData;
        const { profileId, metadata, deadline } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          user: currentProfile?.ownedBy,
          profileId,
          metadata,
          sig
        };
        const { data } = await broadcast({ variables: { request: { id, signature } } });
        if (data?.broadcast.__typename === 'RelayError') {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      },
      onError
    });

  const [createSetProfileMetadataViaDispatcher, { loading: dispatcherLoading }] =
    useCreateSetProfileMetadataViaDispatcherMutation({ onCompleted, onError });

  const createViaDispatcher = async (request: CreatePublicSetProfileMetadataUriRequest) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    });
    if (data?.createSetProfileMetadataViaDispatcher?.__typename === 'RelayError') {
      await createSetProfileMetadataTypedData({
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
      return toast.error(SIGN_WALLET);
    }

    try {
      setIsUploading(true);
      const id = await uploadToArweave({
        name,
        bio,
        cover_picture: cover ? cover : null,
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
          { key: 'statusEmoji', value: getProfileAttribute(profile?.attributes, 'statusEmoji') },
          { key: 'statusMessage', value: getProfileAttribute(profile?.attributes, 'statusMessage') },
          { key: 'app', value: APP_NAME }
        ],
        version: '1.0.0',
        metadata_id: uuid()
      }).finally(() => setIsUploading(false));

      const request: CreatePublicSetProfileMetadataUriRequest = {
        profileId: currentProfile?.id,
        metadata: `https://arweave.net/${id}`
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        return await createViaDispatcher(request);
      }

      return await createSetProfileMetadataTypedData({
        variables: { request }
      });
    } catch {}
  };

  const uploadAndSave = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedImage) {
      return toast.error(ERROR_MESSAGE);
    }

    try {
      setUploading(true);
      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL('image/png');
      setCover(ipfsUrl);
      setUploadedImageUrl(dataUrl);
    } catch (error) {
      toast.error(t`Upload failed`);
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

  const isLoading =
    isUploading ||
    typedDataLoading ||
    dispatcherLoading ||
    signLoading ||
    writeLoading ||
    broadcastLoading ||
    uploading;

  const coverPictureUrl = profile?.coverPicture?.original?.url;
  const coverPictureIpfsUrl = coverPictureUrl ? imageProxy(getIPFSLink(coverPictureUrl), COVER) : '';

  const cropperBorderSize = 20;

  return (
    <>
      <Modal
        title={t`Crop image`}
        show={showCropModal}
        onClose={
          isLoading
            ? undefined
            : () => {
                setImageSrc('');
                setShowCropModal(false);
              }
        }
        size="md"
      >
        <div className="p-5 text-right">
          <ImageCropperController
            imageSrc={imageSrc}
            setCroppedAreaPixels={setCroppedAreaPixels}
            borderSize={cropperBorderSize}
            targetSize={{ width: 1500, height: 500 }}
          />
          <Button
            type="submit"
            disabled={isLoading || !imageSrc}
            onClick={() => uploadAndSave()}
            icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="h-4 w-4" />}
          >
            <Trans>Upload</Trans>
          </Button>
        </div>
      </Modal>

      <Card className="p-5">
        <Form
          form={form}
          className="space-y-4"
          onSubmit={({ name, location, website, twitter, bio }) => {
            editProfile(name, location, website, twitter, bio);
          }}
        >
          {error && <ErrorMessage className="mb-3" title={t`Transaction failed!`} error={error} />}
          <Input label={t`Profile Id`} type="text" value={currentProfile?.id} disabled />
          <Input label={t`Name`} type="text" placeholder="Gavin" {...form.register('name')} />
          <Input label={t`Location`} type="text" placeholder="Miami" {...form.register('location')} />
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
          <TextArea label={t`Bio`} placeholder={t`Tell us something about you!`} {...form.register('bio')} />
          <div className="space-y-1.5">
            <div className="label">Cover</div>
            <div className="space-y-3">
              <div>
                <Image
                  className="h-60 w-full rounded-lg object-cover"
                  onError={({ currentTarget }) => {
                    currentTarget.src = getIPFSLink(cover);
                  }}
                  src={uploadedImageUrl || coverPictureIpfsUrl}
                  alt={cover}
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
                <Trans>Turn this on to show your pride and turn the {APP_NAME} logo rainbow every day.</Trans>
              </div>
            </div>
          </div>
          <Button
            className="ml-auto"
            type="submit"
            disabled={isLoading}
            icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="h-4 w-4" />}
          >
            <Trans>Save</Trans>
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default ProfileSettingsForm;
