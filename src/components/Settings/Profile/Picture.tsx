import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation } from '@apollo/client';
import ChooseFile from '@components/Shared/ChooseFile';
import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { CreateSetProfileImageUriBroadcastItemResult, MediaSet, NftImage, Profile } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation';
import { PencilIcon } from '@heroicons/react/outline';
import getIPFSLink from '@lib/getIPFSLink';
import imagekitURL from '@lib/imagekitURL';
import { Mixpanel } from '@lib/mixpanel';
import omit from '@lib/omit';
import splitSignature from '@lib/splitSignature';
import uploadMediaToIPFS from '@lib/uploadMediaToIPFS';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE, ERRORS, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileImageUriTypedData(
    $options: TypedDataOptions
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURITypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`;

interface Props {
  profile: Profile & { picture: MediaSet & NftImage };
}

const Picture: FC<Props> = ({ profile }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const currentUser = useAppPersistStore((state) => state.currentUser);
  const [avatar, setAvatar] = useState<string>();
  const [uploading, setUploading] = useState<boolean>(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError: (error) => {
      toast.error(error?.message);
      Mixpanel.track(SETTINGS.PROFILE.SET_PICTURE, {
        result: 'typed_data_error',
        error: error?.message
      });
    }
  });

  const onCompleted = () => {
    toast.success('Avatar updated successfully!');
    Mixpanel.track(SETTINGS.PROFILE.SET_PICTURE, {
      result: 'success'
    });
  };

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onCompleted();
    },
    onError: (error: any) => {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  useEffect(() => {
    if (profile?.picture?.original?.url || profile?.picture?.uri) {
      setAvatar(profile?.picture?.original?.url ?? profile?.picture?.uri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
      Mixpanel.track(SETTINGS.PROFILE.SET_PICTURE, {
        result: 'broadcast_error',
        error: error?.message
      });
    }
  });
  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createSetProfileImageURITypedData
      }: {
        createSetProfileImageURITypedData: CreateSetProfileImageUriBroadcastItemResult;
      }) => {
        const { id, typedData } = createSetProfileImageURITypedData;
        const { deadline } = typedData?.value;

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          });
          setUserSigNonce(userSigNonce + 1);
          const { profileId, imageURI } = typedData?.value;
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            imageURI,
            sig
          };
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch (error) {}
      },
      onError: (error) => {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadMediaToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setAvatar(attachment[0].item);
      }
    } finally {
      setUploading(false);
    }
  };

  const editPicture = (avatar: string | undefined) => {
    if (!isAuthenticated) {
      return toast.error(SIGN_WALLET);
    }

    if (!avatar) {
      return toast.error("Avatar can't be empty!");
    }

    createSetProfileImageURITypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentUser?.id,
          url: avatar
        }
      }
    });
  };

  return (
    <>
      <div className="space-y-1.5">
        {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />}
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="w-60 h-60 rounded-lg"
                height={240}
                width={240}
                src={imagekitURL(getIPFSLink(avatar), 'avatar')}
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
      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          type="submit"
          disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
          onClick={() => editPicture(avatar)}
          icon={
            typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
              <Spinner size="xs" />
            ) : (
              <PencilIcon className="w-4 h-4" />
            )
          }
        >
          Save
        </Button>
        {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
          <IndexStatus txHash={writeData?.hash ? writeData?.hash : broadcastData?.broadcast?.txHash} />
        ) : null}
      </div>
    </>
  );
};

export default Picture;
