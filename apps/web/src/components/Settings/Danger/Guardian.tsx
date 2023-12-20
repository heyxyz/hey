import type { FC } from 'react';

import IndexStatus from '@components/Shared/IndexStatus';
import {
  ExclamationTriangleIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import { Button, Card, Modal, Spinner, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useContractWrite } from 'wagmi';

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
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: 'DANGER__disableTokenGuardian',
    onError: (error) => {
      onError(error);
    },
    onSuccess: () => {
      Leafwatch.track(SETTINGS.DANGER.UNPROTECT_PROFILE);
    }
  });

  const handleDisable = () => {
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
          <IndexStatus reload txHash={data.hash} />
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
        icon={<ExclamationTriangleIcon className="size-5 text-red-500" />}
        onClose={() => setShowWarningModal(false)}
        show={showWarningModal}
        title="Danger zone"
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            message={
              <div className="leading-6">
                Confirm that you have read all consequences and want to disable
                the Profile Guardian.
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

export default GuardianSettings;
