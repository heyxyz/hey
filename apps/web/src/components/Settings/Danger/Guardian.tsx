import {
  ExclamationTriangleIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import { Button, Card, Modal, Spinner, WarningMessage } from '@hey/ui';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useContractWrite } from 'wagmi';

import IndexStatus from '@/components/Shared/IndexStatus';
import useHandleWrongNetwork from '@/hooks/useHandleWrongNetwork';
import errorToast from '@/lib/errorToast';
import { Leafwatch } from '@/lib/leafwatch';
import useProfileStore from '@/store/persisted/useProfileStore';

const GuardianSettings: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { data, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'DANGER__disableTokenGuardian',
    onSuccess: () => {
      Leafwatch.track(SETTINGS.DANGER.UNPROTECT_PROFILE);
    },
    onError: (error) => {
      onError(error);
    }
  });

  const handleDisable = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return write();
    } catch (error) {
      onError(error);
    }
  };

  if (!currentProfile?.guardian?.protected) {
    return null;
  }

  return (
    <Card className="space-y-5 p-5">
      <div className="space-y-3">
        <div className="text-lg font-bold text-red-500">
          Disable profile guardian
        </div>
        <p>
          This will disable the Profile Guardian and allow you to do some
          actions like transfer, burn and approve without restrictions.
        </p>
      </div>
      <div className="text-lg font-bold">What else you should know</div>
      <div className="ld-text-gray-500 divide-y text-sm dark:divide-gray-700">
        <p className="pb-3">
          A 7-day Security Cooldown Period need to be elapsed for the Profile
          Guardian to become effectively disabled.
        </p>
        <p className="py-3">
          After the Profile Guardian is effectively disabled, you will be able
          to execute approvals and transfers without restrictions.
        </p>
      </div>
      {data?.hash ? (
        <div className="mt-5">
          <IndexStatus txHash={data.hash} reload />
        </div>
      ) : (
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
          {isLoading ? 'Disabling...' : 'Disable now'}
        </Button>
      )}
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
                Confirm that you have read all consequences and want to disable
                the Profile Guardian.
              </div>
            }
          />
          <Button
            variant="danger"
            icon={<LockOpenIcon className="h-5 w-5" />}
            onClick={async () => {
              setShowWarningModal(false);
              await handleDisable();
            }}
          >
            Yes, disable
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default GuardianSettings;
