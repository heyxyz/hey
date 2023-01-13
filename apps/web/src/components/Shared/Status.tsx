import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { PencilIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getAttribute from '@lib/getAttribute';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import { t, Trans } from '@lingui/macro';
import { LensPeriphery } from 'abis';
import { APP_NAME, LENS_PERIPHERY, SIGN_WALLET } from 'data/constants';
import type { CreatePublicSetProfileMetadataUriRequest } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
  useProfileSettingsQuery
} from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
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
  const [isUploading, setIsUploading] = useState(false);
  const [emoji, setEmoji] = useState<string>('');

  const form = useZodForm({
    schema: editStatusSchema
  });

  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
    onCompleted: (data) => {
      const profile = data?.profile;
      form.setValue('status', getAttribute(profile?.attributes, 'statusMessage'));
      setEmoji(getAttribute(profile?.attributes, 'statusEmoji'));
    }
  });

  const onCompleted = () => {
    toast.success(t`Status updated successfully!`);
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const { isLoading: writeLoading, write } = useContractWrite({
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

  const profile = data?.profile;

  const editStatus = async (emoji: string, status: string) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
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
          { key: 'location', value: getAttribute(profile?.attributes, 'location') },
          { key: 'website', value: getAttribute(profile?.attributes, 'website') },
          {
            key: 'twitter',
            value: getAttribute(profile?.attributes, 'twitter')?.replace('https://twitter.com/', '')
          },
          { key: 'hasPrideLogo', value: getAttribute(profile?.attributes, 'hasPrideLogo') },
          { key: 'statusEmoji', value: emoji },
          { key: 'statusMessage', value: status },
          { key: 'app', value: APP_NAME }
        ],
        version: '1.0.0',
        metadata_id: uuid()
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
    <div className="p-5 space-y-5">
      <Form
        form={form}
        className="space-y-4"
        onSubmit={({ status }) => {
          editStatus(emoji, status);
          Analytics.track(SETTINGS.PROFILE.SET_PICTURE);
        }}
      >
        <Input
          prefix={<EmojiPicker emoji={emoji} setEmoji={setEmoji} />}
          placeholder={t`What's happening?`}
          {...form.register('status')}
        />
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            type="submit"
            variant="danger"
            disabled={isLoading}
            outline
            onClick={() => {
              setEmoji('');
              form.setValue('status', '');
              editStatus('', '');
              Analytics.track(SETTINGS.PROFILE.CLEAR_STATUS);
            }}
          >
            <Trans>Clear status</Trans>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Status;
