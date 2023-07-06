import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/outline';
import { LensHub } from '@lenster/abis';
import { LENSHUB_PROXY } from '@lenster/data';
import {
  Button,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Spinner
} from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import { type FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useContractWrite } from 'wagmi';

import CountdownTimer from './CountdownTimer';
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

  if (profileGuardianInformation.isProtected) {
    return null;
  }

  const coolOffTime = new Date(
    new Date(
      profileGuardianInformation.disablingProtectionTimestamp as any
    ).getTime() +
      5 * 60 * 100
  ).toISOString();

  const isCoolOffPassed =
    new Date(
      profileGuardianInformation.disablingProtectionTimestamp as any
    ).getTime() < Date.now();

  return (
    <div className="border-b border-red-300 bg-red-500/20">
      <GridLayout className="!p-5">
        <GridItemEight className="!mb-0 space-y-1">
          <div className="flex items-center space-x-2 text-red-700">
            <LockOpenIcon className="h-5 w-5" />
            <div className="text-base font-bold sm:text-lg">
              <Trans>Attention! Your profile is currently unlocked.</Trans>
            </div>
          </div>
          <div className="font-bold text-red-500">
            {isCoolOffPassed ? (
              <Trans>
                Your profile protection disabled.
                <Link
                  className="ml-1.5 underline"
                  href="https://docs.lens.xyz"
                  target="_blank"
                >
                  Learn more
                </Link>
              </Trans>
            ) : (
              <Trans>
                Your profile protection disabling has been triggered. It will
                take effect in <CountdownTimer targetDate={coolOffTime} />
              </Trans>
            )}
          </div>
        </GridItemEight>
        <GridItemFour className="mt-5 flex items-center sm:ml-auto sm:mt-0">
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
        </GridItemFour>
      </GridLayout>
    </div>
  );
};

export default ProtectProfile;
