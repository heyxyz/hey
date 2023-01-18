import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { t } from '@lingui/macro';
import type { ISuccessResult } from '@worldcoin/idkit';
import { IDKitWidget } from '@worldcoin/idkit';
import { LensHubProxy } from 'abis';
import clsx from 'clsx';
import { IDKIT_ACTION_ID, IS_MAINNET, LENSHUB_PROXY } from 'data/constants';
import { useBroadcastMutation, useCreateSetDispatcherTypedDataMutation, useIsIdKitVerifiedQuery } from 'lens';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  buttonSize?: 'sm';
}

const ToggleDispatcher: FC<Props> = ({ buttonSize = 'md' }) => {
  const { data: idKitData } = useIsIdKitVerifiedQuery({});
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;

  const onCompleted = () => {
    toast.success(t`Profile updated successfully!`);
    Analytics.track(SETTINGS.DISPATCHER.TOGGLE);
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted
  });
  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] =
    useCreateSetDispatcherTypedDataMutation({
      onCompleted: async ({ createSetDispatcherTypedData }) => {
        const { id, typedData } = createSetDispatcherTypedData;
        const { profileId, dispatcher, deadline } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          profileId,
          dispatcher,
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

  const toggleDispatcher = async () => {
    try {
      await createSetProfileMetadataTypedData({
        variables: {
          request: {
            profileId: currentProfile?.id,
            enable: canUseRelay ? false : true
          }
        }
      });
    } catch {}
  };

  const handleIDKitProof = async (result: ISuccessResult) => {
    const response = await fetch('https://world-id-lens-bridge.vercel.app/api/v1/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...result,
        is_production: IS_MAINNET,
        action_id: IDKIT_ACTION_ID,
        signal: currentProfile?.ownedBy
      })
    });

    if (response.ok) {
      return;
    }

    if (response.status === 400 && (await response.json()).code === 'already_verified') {
      throw new Error(
        'You have already verified this phone number with Lens. You can only verify one wallet with one phone number.'
      );
    }

    throw new Error('Something went wrong. Please try again.');
  };

  const isLoading = signLoading || writeLoading || broadcastLoading || typedDataLoading;
  const broadcastTxHash =
    broadcastData?.broadcast.__typename === 'RelayerResult' && broadcastData.broadcast.txHash;

  return writeData?.hash ?? broadcastTxHash ? (
    <div className="mt-2">
      <IndexStatus txHash={writeData?.hash ?? broadcastTxHash} reload />
    </div>
  ) : (
    <IDKitWidget
      autoClose
      actionId={IDKIT_ACTION_ID}
      onSuccess={toggleDispatcher}
      handleVerify={handleIDKitProof}
      signal={currentProfile?.ownedBy}
      copy={{
        title: 'Lens Dispatcher',
        heading: t`Verify your phone number for free gassless transactions`
      }}
    >
      {({ open }) => (
        <Button
          variant={canUseRelay ? 'danger' : 'primary'}
          className={clsx({ 'text-sm': buttonSize === 'sm' }, `mr-auto`)}
          disabled={isLoading}
          icon={
            isLoading ? (
              <Spinner variant={canUseRelay ? 'danger' : 'primary'} size="xs" />
            ) : canUseRelay ? (
              <XIcon className="w-4 h-4" />
            ) : (
              <CheckCircleIcon className="w-4 h-4" />
            )
          }
          onClick={idKitData?.isIDKitPhoneVerified ? toggleDispatcher : open}
        >
          {canUseRelay ? t`Disable dispatcher` : t`Enable dispatcher`}
        </Button>
      )}
    </IDKitWidget>
  );
};

export default ToggleDispatcher;
