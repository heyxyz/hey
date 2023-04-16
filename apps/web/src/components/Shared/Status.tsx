import { PencilIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import { t, Trans } from '@lingui/macro';
import { LensPeriphery } from 'abis';
import { APP_NAME, LENS_PERIPHERY } from 'data/constants';
import Errors from 'data/errors';
import type { CreatePublicSetProfileMetadataUriRequest } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
  useProfileSettingsQuery
} from 'lens';
import getProfileAttribute from 'lib/getProfileAttribute';
import getSignature from 'lib/getSignature';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { SETTINGS } from 'src/tracking';
import { Button, ErrorMessage, Form, Input, Spinner, useZodForm } from 'ui';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string } from 'zod';

import EmojiPicker from './EmojiPicker';
import Loader from './Loader';

const editStatusSchema = object({
  status: string()
    .min(1, { message: t`Status should not be empty` })
    .max(100, { message: t`Status should not exceed 100 characters` })
});

const Status: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowStatusModal = useGlobalModalStateStore((state) => state.setShowStatusModal);
  const [isUploading, setIsUploading] = useState(false);
  const [emoji, setEmoji] = useState<string>('');

  const form = useZodForm({
    schema: editStatusSchema
  });

  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
    onCompleted: ({ profile }) => {
      form.setValue('status', getProfileAttribute(profile?.attributes, 'statusMessage'));
      setEmoji(getProfileAttribute(profile?.attributes, 'statusEmoji'));
    }
  });

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    toast.success(t`Status updated successfully!`);
    setShowStatusModal(false);
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
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
    useCreateSetProfileMetadataViaDispatcherMutation({
      onCompleted: ({ createSetProfileMetadataViaDispatcher }) =>
        onCompleted(createSetProfileMetadataViaDispatcher.__typename),
      onError
    });

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

  const profile = data?.profile;

  const editStatus = async (emoji: string, status: string) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsUploading(true);
      const id = await uploadToArweave({
        name: profile?.name ?? '',
        bio: profile?.bio ?? '',
        cover_picture:
          profile?.coverPicture?.__typename === 'MediaSet' ? profile?.coverPicture?.original?.url ?? '' : '',
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
          { key: 'location', value: getProfileAttribute(profile?.attributes, 'location') },
          { key: 'website', value: getProfileAttribute(profile?.attributes, 'website') },
          {
            key: 'twitter',
            value: getProfileAttribute(profile?.attributes, 'twitter')?.replace('https://twitter.com/', '')
          },
          { key: 'hasPrideLogo', value: getProfileAttribute(profile?.attributes, 'hasPrideLogo') },
          { key: 'statusEmoji', value: emoji },
          { key: 'statusMessage', value: status },
          { key: 'app', value: APP_NAME }
        ],
        version: '1.0.0',
        metadata_id: uuid()
      }).finally(() => setIsUploading(false));

      const request: CreatePublicSetProfileMetadataUriRequest = {
        profileId: currentProfile?.id,
        metadata: `ar://${id}`
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        return await createViaDispatcher(request);
      }

      return await createSetProfileMetadataTypedData({
        variables: { request }
      });
    } catch {}
  };

  if (loading) {
    return (
      <div className="p-5">
        <Loader message={t`Loading status settings`} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load status settings`} error={error} />;
  }

  const isLoading =
    isUploading || typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;

  return (
    <div className="space-y-5 p-5">
      <Form
        form={form}
        className="space-y-4"
        onSubmit={({ status }) => {
          editStatus(emoji, status);
          Mixpanel.track(SETTINGS.PROFILE.SET_PICTURE);
        }}
      >
        <Input
          prefix={<EmojiPicker emoji={emoji} setEmoji={setEmoji} />}
          placeholder={t`What's happening?`}
          {...form.register('status')}
        />
        <div className="ml-auto flex items-center space-x-2">
          <Button
            type="submit"
            variant="danger"
            disabled={isLoading}
            outline
            onClick={() => {
              setEmoji('');
              form.setValue('status', '');
              editStatus('', '');
              Mixpanel.track(SETTINGS.PROFILE.CLEAR_STATUS);
            }}
          >
            <Trans>Clear status</Trans>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            leadingIcon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="h-4 w-4" />}
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Status;
