import ChooseFile from '@components/Shared/ChooseFile';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { TextArea } from '@components/UI/TextArea';
import { Toggle } from '@components/UI/Toggle';
import { PencilIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getAttribute from '@lib/getAttribute';
import getIPFSLink from '@lib/getIPFSLink';
import getSignature from '@lib/getSignature';
import hasPrideLogo from '@lib/hasPrideLogo';
import imageProxy from '@lib/imageProxy';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import uploadToIPFS from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import { LensPeriphery } from 'abis';
import { APP_NAME, COVER, LENS_PERIPHERY, SIGN_WALLET, URL_REGEX } from 'data/constants';
import type { CreatePublicSetProfileMetadataUriRequest, MediaSet, Profile } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from 'lens';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string, union } from 'zod';

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

interface Props {
  profile: Profile & { coverPicture: MediaSet };
}

const ProfileSettingsForm: FC<Props> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [pride, setPride] = useState(hasPrideLogo(profile));
  const [cover, setCover] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onCompleted = () => {
    toast.success(t`Profile updated successfully!`);
    Analytics.track(SETTINGS.PROFILE.UPDATE);
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
      const attachment = await uploadToIPFS(evt.target.files);
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
            .map(({ traitType, key, value }) => ({ traitType, key, value })) ?? []),
          { traitType: 'string', key: 'location', value: location },
          { traitType: 'string', key: 'website', value: website },
          { traitType: 'string', key: 'twitter', value: twitter },
          { traitType: 'boolean', key: 'hasPrideLogo', value: pride },
          {
            traitType: 'string',
            key: 'statusEmoji',
            value: getAttribute(profile?.attributes, 'statusEmoji')
          },
          {
            traitType: 'string',
            key: 'statusMessage',
            value: getAttribute(profile?.attributes, 'statusMessage')
          },
          { traitType: 'string', key: 'app', value: APP_NAME }
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
        return await createViaDispatcher(request);
      }

      return await createSetProfileMetadataTypedData({
        variables: { request }
      });
    } catch {}
  };

  const isLoading =
    isUploading || typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;

  return (
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
        <Input label={t`Website`} type="text" placeholder="https://hooli.com" {...form.register('website')} />
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
            {cover && (
              <div>
                <img
                  className="object-cover w-full h-60 rounded-lg"
                  src={imageProxy(getIPFSLink(cover), COVER)}
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
            <span>
              <Trans>Celebrate pride every day</Trans>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Toggle on={pride} setOn={setPride} />
            <div>
              <Trans>Turn this on to show your pride and turn the {APP_NAME} logo rainbow every day.</Trans>
            </div>
          </div>
        </div>
        <Button
          className="ml-auto"
          type="submit"
          disabled={isLoading}
          icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
        >
          <Trans>Save</Trans>
        </Button>
      </Form>
    </Card>
  );
};

export default ProfileSettingsForm;
