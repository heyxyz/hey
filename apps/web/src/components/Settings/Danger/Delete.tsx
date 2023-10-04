import UserProfile from '@components/Shared/UserProfile';
import {
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { APP_NAME, LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { useCreateBurnProfileTypedDataMutation } from '@hey/lens';
import resetAuthData from '@hey/lib/resetAuthData';
import { Button, Card, Modal, Spinner, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useDisconnectXmtp } from 'src/hooks/useXmtpClient';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { useProfileGuardianInformationStore } from 'src/store/profile-guardian-information';
import { useContractWrite, useDisconnect } from 'wagmi';

const DeleteSettings: FC = () => {
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const disconnectXmtp = useDisconnectXmtp();
  const { disconnect } = useDisconnect();
  const handleWrongNetwork = useHandleWrongNetwork();
  const profileGuardianInformation = useProfileGuardianInformationStore(
    (state) => state.profileGuardianInformation
  );

  const onCompleted = () => {
    Leafwatch.track(SETTINGS.DANGER.DELETE_PROFILE);
    setCurrentProfile(null);
    setProfileId(null);
    disconnectXmtp();
    resetAuthData();
    disconnect?.();
    location.href = '/';
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'burn',
    onSuccess: () => {
      onCompleted();
      setUserSigNonce(userSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setUserSigNonce(userSigNonce - 1);
    }
  });

  const [createBurnProfileTypedData] = useCreateBurnProfileTypedDataMutation({
    onCompleted: async ({ createBurnProfileTypedData }) => {
      const { typedData } = createBurnProfileTypedData;
      const { tokenId } = typedData.value;
      write?.({ args: [tokenId] });
    },
    onError
  });

  const handleDelete = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return await createBurnProfileTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: { profileId: currentProfile?.id }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const cooldownEnded = () => {
    const cooldownDate =
      profileGuardianInformation.disablingProtectionTimestamp as any;
    return new Date(cooldownDate).getTime() < Date.now();
  };

  const canDelete = !profileGuardianInformation.isProtected && cooldownEnded();

  if (!canDelete) {
    return (
      <Card className="space-y-5 p-5">
        <div className="text-lg font-bold text-red-500">
          <Trans>Delete Lens profile</Trans>
        </div>
        <p>
          <Trans>
            Your profile cannot be deleted while profile guardian is enabled.
          </Trans>
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-5 p-5">
      <UserProfile profile={currentProfile as Profile} />
      <div className="text-lg font-bold text-red-500">
        <Trans>Delete Lens profile</Trans>
      </div>
      <p>
        <Trans>
          This will permanently delete your Profile NFT on the Lens Protocol.
          You will not be able to use any apps built on Lens, including{' '}
          {APP_NAME}. All your data will be wiped out immediately and you won't
          be able to get it back.
        </Trans>
      </p>
      <div className="text-lg font-bold">What else you should know</div>
      <div className="lt-text-gray-500 divide-y text-sm dark:divide-gray-700">
        <p className="pb-3">
          <Trans>
            You cannot restore your Lens profile if it was accidentally or
            wrongfully deleted.
          </Trans>
        </p>
        <p className="py-3">
          <Trans>
            Some account information may still be available in search engines,
            such as Google or Bing.
          </Trans>
        </p>
        <p className="py-3">
          <Trans>
            Your @handle will be released immediately after deleting the
            account.
          </Trans>
        </p>
      </div>
      <Button
        variant="danger"
        icon={
          isLoading ? (
            <Spinner variant="danger" size="xs" />
          ) : (
            <TrashIcon className="h-5 w-5" />
          )
        }
        disabled={isLoading}
        onClick={() => setShowWarningModal(true)}
      >
        {isLoading ? t`Deleting...` : t`Delete your account`}
      </Button>
      <Modal
        title={t`Danger zone`}
        icon={<ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
        show={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            title="Are you sure?"
            message={
              <div className="leading-6">
                <Trans>
                  Confirm that you have read all consequences and want to delete
                  your account anyway
                </Trans>
              </div>
            }
          />
          <Button
            variant="danger"
            icon={<TrashIcon className="h-5 w-5" />}
            onClick={async () => {
              setShowWarningModal(false);
              await handleDelete();
            }}
          >
            <Trans>Yes, delete my account</Trans>
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default DeleteSettings;
