import { LensPeriphery } from '@abis/LensPeriphery';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Input } from '@components/UI/Input';
import { PageLoading } from '@components/UI/PageLoading';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { CreatePublicSetProfileMetadataUriRequest } from '@generated/types';
import {
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
  useProfileQuery
} from '@generated/types';
import { PencilIcon } from '@heroicons/react/outline';
import getAttribute from '@lib/getAttribute';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LENS_PERIPHERY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useContractWrite, useSignTypedData } from 'wagmi';

import EmojiPicker from './EmojiPicker';
import IndexStatus from './IndexStatus';

const Status: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useProfileQuery({
    variables: { request: { profileId: currentProfile?.id }, who: currentProfile?.id ?? null },
    skip: !currentProfile?.id,
    onCompleted: async ({ profile }) => {
      console.log(profile?.metadata);
      try {
        const metadata = await axios({
          method: 'GET',
          url: profile?.metadata
        });
        setMetadata(metadata?.data);
        setStatus(getAttribute(metadata?.data?.attributes, 'statusMessage'));
        setEmoji(getAttribute(metadata?.data?.attributes, 'statusEmoji'));
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error: any) => {
      setError(error);
      setLoading(false);
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

          setUserSigNonce(userSigNonce + 1);
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
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const editStatus = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    setIsUploading(true);
    metadata.attributes.push({ traitType: 'string', key: 'statusEmoji', value: emoji });
    metadata.attributes.push({ traitType: 'string', key: 'statusMessage', value: status });
    const id = await uploadToArweave(metadata).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      metadata: `https://arweave.net/${id}`
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createViaDispatcher(request);
    } else {
      createSetProfileMetadataTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="p-5">
        <PageLoading message="Loading status settings" />
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
      <Input
        prefix={<EmojiPicker emoji={emoji} setEmoji={setEmoji} />}
        placeholder="What's happening?"
        value={status ?? ''}
        onChange={(event) => setStatus(event.target.value)}
      />
      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          disabled={isLoading}
          icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
          onClick={editStatus}
        >
          Save
        </Button>
        {txHash ? <IndexStatus txHash={txHash} reload /> : null}
      </div>
    </div>
  );
};

export default Status;
