import MetaTags from '@components/Common/MetaTags';
import UserProfile from '@components/Shared/UserProfile';
import { useDisconnectXmtp } from '@components/utils/hooks/useXmtpClient';
import { ExclamationIcon, TrashIcon } from '@heroicons/react/outline';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import resetAuthData from '@lib/resetAuthData';
import { t, Trans } from '@lingui/macro';
import { LensHub } from 'abis';
import { APP_NAME, LENSHUB_PROXY } from 'data/constants';
import Errors from 'data/errors';
import { useCreateBurnProfileTypedDataMutation } from 'lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { PAGEVIEW } from 'src/tracking';
import {
  Button,
  Card,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Modal,
  Spinner,
  WarningMessage
} from 'ui';
import { useContractWrite, useDisconnect } from 'wagmi';

import SettingsSidebar from '../Sidebar';

const DeleteSettings: FC = () => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const [isLoading, setIsLoading] = useState(false);
  const disconnectXmtp = useDisconnectXmtp();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'delete' });
  }, []);

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

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Delete Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="space-y-5 p-5">
          <UserProfile profile={currentProfile} />
          <div className="text-lg font-bold text-red-500">
            <Trans>This will delete your Lens profile</Trans>
          </div>
          <p>
            <Trans>
              This will permanently delete your Profile NFT on the Lens
              Protocol. You will not be able to use any apps built on Lens,
              including Lenster. All your data will be wiped out immediately and
              you won't be able to get it back.
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
                Some account information may still be available in search
                engines, such as Google or Bing.
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
                      Confirm that you have read all consequences and want to
                      delete your account anyway
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
      </GridItemEight>
    </GridLayout>
  );
};

export default DeleteSettings;
