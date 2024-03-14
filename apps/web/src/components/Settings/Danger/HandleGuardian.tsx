import type { FC } from 'react';

import IndexStatus from '@components/Shared/IndexStatus';
import {
  ExclamationTriangleIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';
import { LensHandles } from '@hey/abis';
import { LENS_HANDLES } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { FeatureFlag } from '@hey/data/feature-flags';
import { SETTINGS } from '@hey/data/tracking';
import { Button, Card, Modal, Spinner, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useWriteContract } from 'wagmi';

const HandleGuardianSettings: FC = () => {
  const { currentProfile } = useProfileStore();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { data, writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
      },
      onSuccess: () => Leafwatch.track(SETTINGS.DANGER.UNPROTECT_HANDLE)
    }
  });

  const write = async () => {
    return await writeContractAsync({
      abi: LensHandles,
      address: LENS_HANDLES,
      functionName: 'DANGER__disableTokenGuardian'
    });
  };

  const handleDisable = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);
      await handleWrongNetwork();
      return await write();
    } catch (error) {
      onError(error);
    }
  };

  if (!isFeatureAvailable(FeatureFlag.Staff)) {
    return null;
  }

  if (!currentProfile?.handle?.guardian?.protected) {
    return null;
  }

  return (
    <Card className="space-y-5 p-5">
      <div className="space-y-3">
        <div className="text-lg font-bold text-red-500">
          Disable handle guardian
        </div>
        <p>
          This will disable the Handle Guardian and allow you to do some actions
          like transfer, burn and approve without restrictions.
        </p>
      </div>
      <div className="text-lg font-bold">What else you should know</div>
      <div className="ld-text-gray-500 divide-y text-sm dark:divide-gray-700">
        <p className="pb-3">
          A 24-hours Security Cooldown Period need to be elapsed for the Handle
          Guardian to become effectively disabled.
        </p>
        <p className="py-3">
          After the Handle Guardian is effectively disabled, you will be able to
          execute approvals and transfers without restrictions.
        </p>
      </div>
      {data ? (
        <div className="mt-5">
          <IndexStatus reload txHash={data} />
        </div>
      ) : (
        <Button
          disabled={isLoading}
          icon={
            isLoading ? (
              <Spinner size="xs" variant="danger" />
            ) : (
              <LockOpenIcon className="size-5" />
            )
          }
          onClick={() => setShowWarningModal(true)}
          variant="danger"
        >
          {isLoading ? 'Disabling...' : 'Disable now'}
        </Button>
      )}
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
                Confirm that you have read all consequences and want to disable
                the Handle Guardian.
              </div>
            }
            title="Are you sure?"
          />
          <Button
            icon={<LockOpenIcon className="size-5" />}
            onClick={async () => {
              setShowWarningModal(false);
              await handleDisable();
            }}
            variant="danger"
          >
            Yes, disable
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default HandleGuardianSettings;
