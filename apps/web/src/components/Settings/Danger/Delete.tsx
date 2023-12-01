import {
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { APP_NAME, LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { Button, Card, Modal, Spinner, WarningMessage } from '@hey/ui';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useContractWrite, useDisconnect } from 'wagmi';

import UserProfile from '@/components/Shared/UserProfile';
import useHandleWrongNetwork from '@/hooks/useHandleWrongNetwork';
import errorToast from '@/lib/errorToast';
import { Leafwatch } from '@/lib/leafwatch';
import { signOut } from '@/store/persisted/useAuthStore';
import useProfileStore from '@/store/persisted/useProfileStore';

const DeleteSettings: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { disconnect } = useDisconnect();
  const handleWrongNetwork = useHandleWrongNetwork();

  const onCompleted = () => {
    Leafwatch.track(SETTINGS.DANGER.DELETE_PROFILE);
    signOut();
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
    onSuccess: onCompleted
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
      return write({ args: [currentProfile?.id] });
    } catch (error) {
      onError(error);
    }
  };

  const cooldownEnded = () => {
    const cooldownDate = currentProfile?.guardian?.cooldownEndsOn as any;
    return new Date(cooldownDate).getTime() < Date.now();
  };

  const canDelete = !currentProfile?.guardian?.protected && cooldownEnded();

  if (!canDelete) {
    return (
      <Card className="space-y-3 p-5">
        <div className="text-lg font-bold text-red-500">
          Delete Lens profile
        </div>
        <p>Your profile cannot be deleted while profile guardian is enabled.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-5 p-5">
      <UserProfile profile={currentProfile as Profile} />
      <div className="space-y-3">
        <div className="text-lg font-bold text-red-500">
          Delete Lens profile
        </div>
        <p>
          This will permanently delete your Profile NFT on the Lens Protocol.
          You will not be able to use any apps built on Lens, including{' '}
          {APP_NAME}. All your data will be wiped out immediately and you won't
          be able to get it back.
        </p>
      </div>
      <div className="text-lg font-bold">What else you should know</div>
      <div className="ld-text-gray-500 divide-y text-sm dark:divide-gray-700">
        <p className="pb-3">
          You cannot restore your Lens profile if it was accidentally or
          wrongfully deleted.
        </p>
        <p className="py-3">
          Some account information may still be available in search engines,
          such as Google or Bing.
        </p>
        <p className="py-3">
          Your @handle will be released immediately after deleting the account.
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
        {isLoading ? 'Deleting...' : 'Delete your account'}
      </Button>
      <Modal
        title="Danger zone"
        icon={<ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
        show={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            title="Are you sure?"
            message={
              <div className="leading-6">
                Confirm that you have read all consequences and want to delete
                your account anyway
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
            Yes, delete my account
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default DeleteSettings;
