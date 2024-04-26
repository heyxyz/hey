import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import errorToast from '@helpers/errorToast';
import { Leafwatch } from '@helpers/leafwatch';
import {
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { APP_NAME, LENS_HUB } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import {
  Button,
  Card,
  CardHeader,
  Modal,
  Spinner,
  WarningMessage
} from '@hey/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { signOut } from 'src/store/persisted/useAuthStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useDisconnect, useWriteContract } from 'wagmi';

const DeleteSettings: FC = () => {
  const { currentProfile } = useProfileStore();
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

  const { writeContractAsync } = useWriteContract({
    mutation: { onSuccess: onCompleted }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: 'burn'
    });
  };

  const handleDelete = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);
      await handleWrongNetwork();
      return await write({ args: [currentProfile?.id] });
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
      <Card>
        <CardHeader
          body="Your profile cannot be deleted while profile guardian is enabled."
          hideDivider
          title={<div className="text-red-500">Delete Lens profile</div>}
        />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        body={`This will permanently delete your Profile NFT on the Lens Protocol. You will not be able to use any apps built on Lens, including ${APP_NAME}. All your data will be wiped out immediately and you won't be able to get it back.`}
        title={<div className="text-red-500">Delete Lens profile</div>}
      />
      <div className="m-5 space-y-5">
        <UserProfile
          hideFollowButton
          hideUnfollowButton
          profile={currentProfile as Profile}
        />
        <div className="space-y-3">
          <div className="text-lg font-bold text-red-500">
            Delete Lens profile
          </div>
          <p>
            This will permanently delete your Profile NFT on the Lens Protocol.
            You will not be able to use any apps built on Lens, including{' '}
            {APP_NAME}. All your data will be wiped out immediately and you
            won't be able to get it back.
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
            Your @handle will be released immediately after deleting the
            account.
          </p>
        </div>
        <Button
          disabled={isLoading}
          icon={
            isLoading ? (
              <Spinner size="xs" variant="danger" />
            ) : (
              <TrashIcon className="size-5" />
            )
          }
          onClick={() => setShowWarningModal(true)}
          variant="danger"
        >
          {isLoading ? 'Deleting...' : 'Delete your account'}
        </Button>
      </div>
      <Modal
        icon={<ExclamationTriangleIcon className="size-5" />}
        onClose={() => setShowWarningModal(false)}
        show={showWarningModal}
        title="Danger zone"
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            message={
              <div className="leading-6">
                Confirm that you have read all consequences and want to delete
                your account anyway
              </div>
            }
            title="Are you sure?"
          />
          <Button
            icon={<TrashIcon className="size-5" />}
            onClick={async () => {
              setShowWarningModal(false);
              await handleDelete();
            }}
            variant="danger"
          >
            Yes, delete my account
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default DeleteSettings;
