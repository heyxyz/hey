import { useChannelMemberCountStore } from '@components/Channel/Details';
import { CurrencyDollarIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ZoraERC721Drop } from '@hey/abis';
import { ADMIN_ADDRESS, APP_NAME } from '@hey/data/constants';
import type { Channel } from '@hey/types/hey';
import { Button, Spinner } from '@hey/ui';
import { t, Trans } from '@lingui/macro';
import Link from 'next/link';
import { type FC } from 'react';
import { useAppStore } from 'src/store/app';
import type { Address } from 'viem';
import { parseEther } from 'viem';
import { zora } from 'viem/chains';
import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';

import SwitchNetwork from '../SwitchNetwork';

const NO_BALANCE_ERROR = 'exceeds the balance of the account';

interface MintProps {
  channel: Channel;
  joined: boolean;
}

const Mint: FC<MintProps> = ({ channel, joined }) => {
  const { membersCount, setMembersCount } = useChannelMemberCountStore();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const chain = useChainId();

  const nftAddress = channel.contract as Address;
  const recipient = currentProfile?.ownedBy;
  const comment = `Joined from ${APP_NAME}`;
  const mintReferral = ADMIN_ADDRESS;
  const mintFee = parseEther('0.000777');
  const value = (parseEther('0') + mintFee) * 1n;
  const abi = ZoraERC721Drop;
  const args = [recipient, 1n, comment, mintReferral];

  const {
    config,
    isError: isPrepareError,
    error: prepareError
  } = usePrepareContractWrite({
    chainId: zora.id,
    address: nftAddress,
    functionName: 'mintWithRewards',
    abi,
    args,
    value
  });
  const {
    write,
    data,
    isLoading: isContractWriteLoading
  } = useContractWrite({
    ...config,
    onSuccess: () => setMembersCount(membersCount + 1)
  });
  const { isLoading, isSuccess } = useWaitForTransaction({
    chainId: zora.id,
    hash: data?.hash
  });

  const mintingOrSuccess = isLoading || isSuccess;

  // Errors
  const noBalanceError = prepareError?.message?.includes(NO_BALANCE_ERROR);

  return (
    <div className="p-5">
      {!joined ? (
        <div className="mb-3 text-lg font-bold">Join {channel.name}</div>
      ) : null}
      <div>
        {joined ? (
          <Trans>
            You are already a member in <b>{channel.name}</b> channel.
          </Trans>
        ) : (
          <Trans>
            Join <b>{channel.name}</b> channel in Zora network and get your
            membership NFT.
          </Trans>
        )}
      </div>
      {!joined ? (
        !mintingOrSuccess ? (
          <div className="flex">
            {chain !== zora.id ? (
              <SwitchNetwork
                className="mt-5 w-full justify-center"
                toChainId={zora.id}
                title={t`Switch to Zora`}
              />
            ) : isPrepareError ? (
              noBalanceError ? (
                <Link
                  className="w-full"
                  href="https://app.uniswap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="mt-5 w-full justify-center"
                    icon={<CurrencyDollarIcon className="h-5 w-5" />}
                    size="md"
                  >
                    <Trans>You don't have balance</Trans>
                  </Button>
                </Link>
              ) : null
            ) : (
              <Button
                className="mt-5 w-full justify-center"
                disabled={!write}
                onClick={() => write?.()}
                icon={
                  isContractWriteLoading ? (
                    <Spinner className="mr-1" size="xs" />
                  ) : (
                    <UserPlusIcon className="h-5 w-5" />
                  )
                }
              >
                <Trans>Join</Trans>
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-5 text-sm font-medium">
            {isLoading ? (
              <div className="flex items-center space-x-1.5">
                <Spinner size="xs" />
                <div>
                  <Trans>Joining in progress</Trans>
                </div>
              </div>
            ) : null}
            {isSuccess ? (
              <div className="flex items-center space-x-1.5">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <div>
                  <Trans>Joined successful</Trans>
                </div>
              </div>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
};

export default Mint;
