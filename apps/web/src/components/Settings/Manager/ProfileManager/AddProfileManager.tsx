import type { FC } from 'react';

import SearchUser from '@components/Shared/SearchUser';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { ADDRESS_PLACEHOLDER, LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import {
  ChangeProfileManagerActionType,
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { hydrateTbaStatus } from 'src/store/persisted/useTbaStatusStore';
import { isAddress } from 'viem';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface AddProfileManagerProps {
  setShowAddManagerModal: (show: boolean) => void;
}

const AddProfileManager: FC<AddProfileManagerProps> = ({
  setShowAddManagerModal
}) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const [manager, setManager] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWrongNetwork = useHandleWrongNetwork();

  const { isTba } = hydrateTbaStatus();
  const { canBroadcast } = checkDispatcherPermissions(currentProfile);

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    setShowAddManagerModal(false);
    setManager('');
    toast.success('Manager added successfully!');
    Leafwatch.track(SETTINGS.MANAGER.ADD_MANAGER);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: 'changeDelegatedExecutorsConfig',
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    },
    onSuccess: () => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
    }
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createChangeProfileManagersTypedData] =
    useCreateChangeProfileManagersTypedDataMutation({
      onCompleted: async ({ createChangeProfileManagersTypedData }) => {
        const { id, typedData } = createChangeProfileManagersTypedData;
        const {
          approvals,
          configNumber,
          delegatedExecutors,
          delegatorProfileId,
          switchToGivenConfig
        } = typedData.value;
        const args = [
          delegatorProfileId,
          delegatedExecutors,
          approvals,
          configNumber,
          switchToGivenConfig
        ];

        if (!isTba && canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return write({ args });
          }
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

          return;
        }

        return write({ args });
      },
      onError
    });

  const addManager = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return await createChangeProfileManagersTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: {
            changeManagers: [
              { action: ChangeProfileManagerActionType.Add, address: manager }
            ]
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="space-y-4 p-5">
      <SearchUser
        error={manager.length > 0 && !isAddress(manager)}
        hideDropdown={isAddress(manager)}
        onChange={(event) => setManager(event.target.value)}
        onProfileSelected={(profile) => setManager(profile.ownedBy.address)}
        placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
        value={manager}
      />
      <div className="flex">
        <Button
          className="ml-auto"
          disabled={isLoading || !isAddress(manager)}
          icon={
            isLoading ? (
              <Spinner size="xs" />
            ) : (
              <PlusCircleIcon className="size-4" />
            )
          }
          onClick={addManager}
          type="submit"
        >
          Add manager
        </Button>
      </div>
    </div>
  );
};

export default AddProfileManager;
