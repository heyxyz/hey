import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import { PencilIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getAttribute from '@lib/getAttribute';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import { LensPeriphery } from 'abis';
import { APP_NAME, LENS_PERIPHERY, RELAY_ON, SIGN_WALLET } from 'data/constants';
import type { CreatePublicSetProfileMetadataUriRequest } from 'lens';
import {
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
import IndexStatus from './IndexStatus';
import Loader from './Loader';

const editStatusSchema = object({
  status: string()
    .min(1, { message: 'Status should atleast have 1 character' })
    .max(100, { message: 'Status should not exceed 100 characters' })
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
    toast.success('Status updated successfully!');
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] =
    useCreateSetProfileMetadataTypedDataMutation({
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

          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }

          const {
            data: { broadcast: result }
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }
        } catch {}
      },
      onError
    });

  const [createSetProfileMetadataViaDispatcher, { data: dispatcherData, loading: dispatcherLoading }] =
    useCreateSetProfileMetadataViaDispatcherMutation({ onCompleted, onError });

  const createViaDispatcher = async (request: CreatePublicSetProfileMetadataUriRequest) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    });
    if (data?.createSetProfileMetadataViaDispatcher?.__typename === 'RelayError') {
      createSetProfileMetadataTypedData({
        variables: { request }
      });
    }
  };

  const profile = data?.profile;

  const editStatus = async (emoji: string, status: string) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }
    setIsUploading(true);
    const id = await uploadToArweave({
      name: profile?.name ?? '',
      bio: profile?.bio ?? '',
      cover_picture:
        profile?.coverPicture?.__typename === 'MediaSet' ? profile?.coverPicture?.original?.url ?? '' : '',
      attributes: [
        { traitType: 'string', key: 'location', value: getAttribute(profile?.attributes, 'location') },
        { traitType: 'string', key: 'website', value: getAttribute(profile?.attributes, 'website') },
        {
          traitType: 'string',
          key: 'twitter',
          value: getAttribute(profile?.attributes, 'twitter')?.replace('https://twitter.com/', '')
        },
        {
          traitType: 'boolean',
          key: 'hasPrideLogo',
          value: getAttribute(profile?.attributes, 'hasPrideLogo')
        },
        { traitType: 'string', key: 'statusEmoji', value: emoji },
        { traitType: 'string', key: 'statusMessage', value: status },
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
      createViaDispatcher(request);
    } else {
      createSetProfileMetadataTypedData({
        variables: { request }
      });
    }
  };

  if (loading) {
    return (
      <div className="p-5">
        <Loader message="Loading status settings" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load status settings" error={error} />;
  }

  const isLoading =
    isUploading || typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;
  const txHash =
    writeData?.hash ??
    broadcastData?.broadcast?.txHash ??
    (dispatcherData?.createSetProfileMetadataViaDispatcher.__typename === 'RelayerResult' &&
      dispatcherData?.createSetProfileMetadataViaDispatcher.txHash);

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
          placeholder="What's happening?"
          {...form.register('status')}
        />
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              className="ml-auto"
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
              Clear status
            </Button>
            <Button
              className="ml-auto"
              type="submit"
              disabled={isLoading}
              icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
            >
              Save
            </Button>
          </div>
          {txHash ? <IndexStatus txHash={txHash} reload /> : null}
        </div>
      </Form>
    </div>
  );
};

export default Status;
