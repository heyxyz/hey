import Picker from '@components/Profile/NftGallery/Picker';
import { PencilIcon } from '@heroicons/react/outline';
import { LensHub } from '@lenster/abis';
import { LENSHUB_PROXY } from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import { SETTINGS } from '@lenster/data/tracking';
import {
  type UpdateProfileImageRequest,
  useBroadcastMutation,
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation,
  useNftChallengeLazyQuery
} from '@lenster/lens';
import getSignature from '@lenster/lib/getSignature';
import { Button, ErrorMessage, Modal, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useNftGalleryStore } from 'src/store/nft-gallery';
import { useNonceStore } from 'src/store/nonce';
import { useContractWrite, useSignMessage, useSignTypedData } from 'wagmi';

interface NftAvatarModalProps {
  showNftAvatarModal: boolean;
  setShowNftAvatarModal: Dispatch<SetStateAction<boolean>>;
}

const NftAvatarModal: FC<NftAvatarModalProps> = ({
  showNftAvatarModal,
  setShowNftAvatarModal
}) => {
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const [isLoading, setIsLoading] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const gallery = useNftGalleryStore((state) => state.gallery);

  const { signMessageAsync } = useSignMessage();

  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success(t`Avatar updated successfully!`);
    Leafwatch.track(SETTINGS.PROFILE.SET_NFT_PICTURE);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [loadChallenge] = useNftChallengeLazyQuery();
  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });
  const { signTypedDataAsync } = useSignTypedData({ onError });

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setProfileImageURI',
    onSuccess: () => onCompleted(),
    onError
  });

  // Dispatcher
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;
  const isSponsored = currentProfile?.dispatcher?.sponsor;

  const [createSetProfileImageURITypedData] =
    useCreateSetProfileImageUriTypedDataMutation({
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        const { id, typedData } = createSetProfileImageURITypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setUserSigNonce(userSigNonce + 1);
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast.__typename === 'RelayError') {
          const { profileId, imageURI } = typedData.value;
          return write?.({ args: [profileId, imageURI] });
        }
      },
      onError
    });

  const [createSetProfileImageURIViaDispatcher] =
    useCreateSetProfileImageUriViaDispatcherMutation({
      onCompleted: ({ createSetProfileImageURIViaDispatcher }) =>
        onCompleted(createSetProfileImageURIViaDispatcher.__typename),
      onError
    });

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageURIViaDispatcher({
      variables: { request }
    });
    if (
      data?.createSetProfileImageURIViaDispatcher?.__typename === 'RelayError'
    ) {
      return await createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const setAvatar = async () => {
    if (!currentProfile || gallery.items.length === 0) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);
      const { contractAddress, tokenId, chainId } = gallery.items[0];
      const challengeRes = await loadChallenge({
        variables: {
          request: {
            ethereumAddress: currentProfile?.ownedBy,
            nfts: [
              {
                contractAddress,
                tokenId,
                chainId
              }
            ]
          }
        }
      });

      const signature = await signMessageAsync({
        message: challengeRes?.data?.nftOwnershipChallenge?.text as string
      });

      const request: UpdateProfileImageRequest = {
        profileId: currentProfile?.id,
        nftData: {
          id: challengeRes?.data?.nftOwnershipChallenge?.id,
          signature
        }
      };

      setShowNftAvatarModal(false);

      if (canUseRelay && isSponsored) {
        return await createViaDispatcher(request);
      }

      return await createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Modal
      size="lg"
      title={t`Select a NFT`}
      show={showNftAvatarModal}
      onClose={() => setShowNftAvatarModal(false)}
    >
      <div className="flex flex-col">
        {error && (
          <ErrorMessage
            className="mb-3"
            title={t`Transaction failed!`}
            error={error}
          />
        )}
        <div className="mb-4 mr-1 flex h-[70vh] overflow-y-scroll">
          <Picker onlyAllowOne={true} />
        </div>
        <div className="ml-auto flex items-center space-x-2 p-4">
          <Button
            onClick={setAvatar}
            disabled={isLoading || gallery.items.length === 0}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="h-4 w-4" />
              )
            }
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NftAvatarModal;
