import ChooseFile from '@components/Shared/ChooseFile';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { PencilIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getIPFSLink from '@lib/getIPFSLink';
import getSignature from '@lib/getSignature';
import imageProxy from '@lib/imageProxy';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToIPFS from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import { LensHubProxy } from 'abis';
import { AVATAR, LENSHUB_PROXY, SIGN_WALLET } from 'data/constants';
import type { MediaSet, NftImage, Profile, UpdateProfileImageRequest } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation
} from 'lens';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  profile: Profile & { picture: MediaSet & NftImage };
}

const Picture: FC<Props> = ({ profile }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    toast.success(t`Avatar updated successfully!`);
    Analytics.track(SETTINGS.PROFILE.SET_PICTURE);
  };

  const {
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  useEffect(() => {
    if (profile?.picture?.original?.url || profile?.picture?.uri) {
      setAvatar(profile?.picture?.original?.url ?? profile?.picture?.uri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted
  });
  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useCreateSetProfileImageUriTypedDataMutation({
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        const { id, typedData } = createSetProfileImageURITypedData;
        const { profileId, imageURI, deadline } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          profileId,
          imageURI,
          sig
        };
        setUserSigNonce(userSigNonce + 1);
        const { data } = await broadcast({ variables: { request: { id, signature } } });
        if (data?.broadcast.__typename === 'RelayError') {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      },
      onError
    });

  const [createSetProfileImageURIViaDispatcher, { loading: dispatcherLoading }] =
    useCreateSetProfileImageUriViaDispatcherMutation({ onCompleted, onError });

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageURIViaDispatcher({
      variables: { request }
    });
    if (data?.createSetProfileImageURIViaDispatcher?.__typename === 'RelayError') {
      await createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setAvatar(attachment[0].item);
      }
    } finally {
      setUploading(false);
    }
  };

  const editPicture = async (avatar?: string) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (!avatar) {
      return toast.error(t`Avatar can't be empty!`);
    }

    try {
      const request = {
        profileId: currentProfile?.id,
        url: avatar
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        return await createViaDispatcher(request);
      }

      return await createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    } catch {}
  };

  const isLoading = typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;

  return (
    <>
      <div className="space-y-1.5">
        {error && <ErrorMessage className="mb-3" title={t`Transaction failed!`} error={error} />}
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="w-60 h-60 rounded-lg"
                height={240}
                width={240}
                src={imageProxy(getIPFSLink(avatar), AVATAR)}
                alt={avatar}
              />
            </div>
          )}
          <div className="flex items-center space-x-3">
            <ChooseFile onChange={(evt: ChangeEvent<HTMLInputElement>) => handleUpload(evt)} />
            {uploading && <Spinner size="sm" />}
          </div>
        </div>
      </div>
      <Button
        className="ml-auto"
        type="submit"
        disabled={isLoading}
        onClick={() => editPicture(avatar)}
        icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
      >
        <Trans>Save</Trans>
      </Button>
    </>
  );
};

export default Picture;
