import { useDisconnectXmtp } from '@components/utils/hooks/useXmtpClient';
import { ExclamationIcon, LockOpenIcon } from '@heroicons/react/outline';
import { LensHub } from '@lenster/abis';
import { Errors } from '@lenster/data';
import { LENSHUB_PROXY } from '@lenster/data/constants';
import { useCreateBurnProfileTypedDataMutation } from '@lenster/lens';
import { Button, Card, Modal, Spinner, WarningMessage } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import resetAuthData from '@lib/resetAuthData';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { useProfileGuardianInformationStore } from 'src/store/profile-guardian-information';
import { useContractWrite, useDisconnect } from 'wagmi';

const GuardianSettings: FC = () => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const profileGuardianInformation = useProfileGuardianInformationStore(
    (state) => state.profileGuardianInformation
  );
  const [isLoading, setIsLoading] = useState(false);
  const disconnectXmtp = useDisconnectXmtp();
  const { disconnect } = useDisconnect();

  const onCompleted = () => {
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

  if (!profileGuardianInformation.isProtected) {
    return null;
  }

  return (
    <Card className="space-y-5 p-5">
      <div className="text-lg font-bold text-red-500">
        <Trans>Disable profile guardian</Trans>
      </div>
      <p>
        <Trans>
          This will disable the Profile Guardian and allow you to do some
          actions like transfer, burn and approve without restrictions.
        </Trans>
      </p>
      <div className="text-lg font-bold">What else you should know</div>
      <div className="lt-text-gray-500 divide-y text-sm dark:divide-gray-700">
        <p className="pb-3">
          <Trans>
            A 7-day Security Cooldown Period need to be elapsed for the Profile
            Guardian to become effectively disabled.
          </Trans>
        </p>
        <p className="py-3">
          <Trans>
            After the Profile Guardian is effectively disabled, you will be able
            to execute approvals and transfers without restrictions.
          </Trans>
        </p>
      </div>
      <Button
        variant="danger"
        icon={
          isLoading ? (
            <Spinner variant="danger" size="xs" />
          ) : (
            <LockOpenIcon className="h-5 w-5" />
          )
        }
        disabled={isLoading}
        onClick={() => setShowWarningModal(true)}
      >
        {isLoading ? t`Unprotecting...` : t`Unprotect your profile`}
      </Button>
      <Modal
        title={t`Danger Zone`}
        icon={<ExclamationIcon className="h-5 w-5 text-red-500" />}
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
            icon={<LockOpenIcon className="h-5 w-5" />}
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

export default GuardianSettings;
