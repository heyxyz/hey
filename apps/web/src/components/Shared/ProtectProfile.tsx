import { LockClosedIcon } from '@heroicons/react/outline';
import { LensHub } from '@lenster/abis';
import { LENSHUB_PROXY, STATIC_IMAGES_URL } from '@lenster/data';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { getTimeFromNowShort } from '@lib/formatTime';
import { Trans } from '@lingui/macro';
import { type FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useContractWrite } from 'wagmi';

import IndexStatus from './IndexStatus';

const ProtectProfile: FC = () => {
  const profileGuardianInformation = useAppStore(
    (state) => state.profileGuardianInformation
  );

  const { data, write, isLoading } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'enableProfileGuardian',
    onError: (error) => {
      errorToast(error);
    }
  });

  const isCoolOffPassed =
    new Date(
      profileGuardianInformation.disablingProtectionTimestamp as any
    ).getTime() < Date.now();
  const coolOffTime = getTimeFromNowShort(
    new Date(profileGuardianInformation.disablingProtectionTimestamp as any)
  );

  return (
    <div className="p-5">
      <div className="mb-2 space-y-4">
        <img
          className="h-14 w-14"
          height={56}
          width={56}
          src={`${STATIC_IMAGES_URL}/emojis/locked.png`}
          alt="Locked Icon"
        />
        <div className="text-lg font-bold">
          {isCoolOffPassed ? (
            <Trans>Attention! Your profile is currently unlocked.</Trans>
          ) : (
            <Trans>
              Your profile is currently not protected. Please take action to
              protect your profile.
            </Trans>
          )}
        </div>
        <div>
          {isCoolOffPassed ? (
            <b className="space-y-3 text-red-500">
              <div>
                <Trans>
                  You have exceeded the cool-off time to protect your profile.
                </Trans>
              </div>
              <div>
                <Trans>
                  Please note that an unlocked profile may be vulnerable to
                  unauthorized access and misuse.
                </Trans>
              </div>
              <div>
                <Trans>
                  Take immediate action to protect your profile and secure your
                  information.
                </Trans>
              </div>
            </b>
          ) : (
            <b className="lt-text-gray-500">
              <Trans>
                Note: You have a cool-off time of {coolOffTime} to protect your
                profile. After that, your profile will be unlocked.
              </Trans>
            </b>
          )}
        </div>
        <div className="mt-5">
          {data?.hash ? (
            <IndexStatus txHash={data?.hash} reload />
          ) : (
            <Button
              disabled={isLoading}
              icon={
                isLoading ? (
                  <Spinner size="xs" className="mr-1" />
                ) : (
                  <LockClosedIcon className="h-5 w-5" />
                )
              }
              onClick={() => write()}
            >
              <Trans>Protect now</Trans>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtectProfile;
