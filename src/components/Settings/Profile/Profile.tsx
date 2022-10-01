import { LensPeriphery } from '@abis/LensPeriphery';
import { useMutation } from '@apollo/client';
import ChooseFile from '@components/Shared/ChooseFile';
import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { Card, CardBody } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { TextArea } from '@components/UI/TextArea';
import { Toggle } from '@components/UI/Toggle';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import {
  CreateSetProfileMetadataTypedDataDocument,
  CreateSetProfileMetadataViaDispatcherDocument,
  MediaSet,
  Mutation,
  Profile
} from '@generated/types';
import { PencilIcon } from '@heroicons/react/outline';
import getAttribute from '@lib/getAttribute';
import getIPFSLink from '@lib/getIPFSLink';
import getSignature from '@lib/getSignature';
import hasPrideLogo from '@lib/hasPrideLogo';
import imagekitURL from '@lib/imagekitURL';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadMediaToIPFS from '@lib/uploadMediaToIPFS';
import uploadToArweave from '@lib/uploadToArweave';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME, LENS_PERIPHERY, RELAY_ON, SIGN_WALLET, URL_REGEX } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, optional, string } from 'zod';

const editProfileSchema = object({
  name: string().max(100, { message: 'Name should not exceed 100 characters' }),
  location: string().max(100, {
    message: 'Location should not exceed 100 characters'
  }),
  website: optional(
    string()
      .regex(URL_REGEX, { message: 'Invalid website' })
      .max(100, { message: 'Website should not exceed 100 characters' })
  ),
  twitter: string().max(100, {
    message: 'Twitter should not exceed 100 characters'
  }),
  bio: string().max(260, { message: 'Bio should not exceed 260 characters' })
});

interface Props {
  profile: Profile & { coverPicture: MediaSet };
}

const Profile: FC<Props> = ({ profile }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [pride, setPride] = useState(hasPrideLogo(profile));
  const [cover, setCover] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onCompleted = () => {
    toast.success('Profile updated successfully!');
    Mixpanel.track(SETTINGS.PROFILE.UPDATE);
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    addressOrName: LENS_PERIPHERY,
    contractInterface: LensPeriphery,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CreateSetProfileMetadataTypedDataDocument,
    {
      onCompleted: async ({ createSetProfileMetadataTypedData }) => {
        try {
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

          setUserSigNonce(userSigNonce + 1);
          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }

          const {
            data: { broadcast: result }
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError
    }
  );

  const [createSetProfileMetadataViaDispatcher, { data: dispatcherData, loading: dispatcherLoading }] =
    useMutation(CreateSetProfileMetadataViaDispatcherDocument, {
      onCompleted,
      onError
    });

  useEffect(() => {
    if (profile?.coverPicture?.original?.url) {
      setCover(profile?.coverPicture?.original?.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadMediaToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setCover(attachment[0].item);
      }
    } finally {
      setUploading(false);
    }
  };

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: profile?.name ?? '',
      location: getAttribute(profile?.attributes, 'location'),
      website: getAttribute(profile?.attributes, 'website'),
      twitter: getAttribute(profile?.attributes, 'twitter')?.replace('https://twitter.com/', ''),
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

    setIsUploading(true);
    const id = await uploadToArweave({
      name,
      bio,
      cover_picture: cover ? cover : null,
      attributes: [
        {
          traitType: 'string',
          key: 'location',
          value: location
        },
        {
          traitType: 'string',
          key: 'website',
          value: website
        },
        {
          traitType: 'string',
          key: 'twitter',
          value: twitter
        },
        {
          traitType: 'boolean',
          key: 'hasPrideLogo',
          value: pride
        },
        {
          traitType: 'string',
          key: 'app',
          value: APP_NAME
        }
      ],
      version: '1.0.0',
      metadata_id: uuid(),
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      metadata: `https://arweave.net/${id}`
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createSetProfileMetadataViaDispatcher({ variables: { request } });
    } else {
      createSetProfileMetadataTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const isLoading =
    isUploading || typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;
  const txHash =
    writeData?.hash ??
    broadcastData?.broadcast?.txHash ??
    (dispatcherData?.createSetProfileMetadataViaDispatcher.__typename === 'RelayerResult' &&
      dispatcherData?.createSetProfileMetadataViaDispatcher.txHash);

  return (
    <Card>
      <CardBody>
        <Form
          form={form}
          className="space-y-4"
          onSubmit={({ name, location, website, twitter, bio }) => {
            editProfile(name, location, website, twitter, bio);
          }}
        >
          {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />}
          <Input label="Profile Id" type="text" value={currentProfile?.id} disabled />
          <Input label="Name" type="text" placeholder="Gavin" {...form.register('name')} />
          <Input label="Location" type="text" placeholder="Miami" {...form.register('location')} />
          <Input label="Website" type="text" placeholder="https://hooli.com" {...form.register('website')} />
          <Input
            label="Twitter"
            type="text"
            prefix="https://twitter.com"
            placeholder="gavin"
            {...form.register('twitter')}
          />
          <TextArea label="Bio" placeholder="Tell us something about you!" {...form.register('bio')} />
          <div className="space-y-1.5">
            <div className="label">Cover</div>
            <div className="space-y-3">
              {cover && (
                <div>
                  <img
                    className="object-cover w-full h-60 rounded-lg"
                    src={imagekitURL(getIPFSLink(cover), 'cover')}
                    alt={cover}
                  />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <ChooseFile onChange={(evt: ChangeEvent<HTMLInputElement>) => handleUpload(evt)} />
                {uploading && <Spinner size="sm" />}
              </div>
            </div>
          </div>
          <div className="pt-4 space-y-2">
            <div className="flex items-center space-x-2 label">
              <img className="w-5 h-5" src="/pride.svg" alt="Pride Logo" />
              <span>Celebrate pride every day</span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle on={pride} setOn={setPride} />
              <div>Turn this on to show your pride and turn the {APP_NAME} logo rainbow every day.</div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              className="ml-auto"
              type="submit"
              disabled={isLoading}
              icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
            >
              Save
            </Button>
            {txHash ? <IndexStatus txHash={txHash} /> : null}
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Profile;
