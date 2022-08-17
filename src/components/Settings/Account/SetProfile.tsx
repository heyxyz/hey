import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation } from '@apollo/client';
import IndexStatus from '@components/Shared/IndexStatus';
import UserProfile from '@components/Shared/UserProfile';
import { Button } from '@components/UI/Button';
import { Card, CardBody } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { Profile, SetDefaultProfileBroadcastItemResult } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation';
import { ExclamationIcon, PencilIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import omit from '@lib/omit';
import splitSignature from '@lib/splitSignature';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME, ERROR_MESSAGE, ERRORS, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

const CREATE_SET_DEFAULT_PROFILE_DATA_MUTATION = gql`
  mutation CreateSetDefaultProfileTypedData(
    $options: TypedDataOptions
    $request: CreateSetDefaultProfileRequest!
  ) {
    createSetDefaultProfileTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          wallet
          profileId
        }
      }
    }
  }
`;

const SetProfile: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const [selectedUser, setSelectedUser] = useState<string>();
  const { address } = useAccount();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError: (error) => {
      toast.error(error?.message);
      Mixpanel.track(SETTINGS.ACCOUNT.SET_DEFAULT_PROFILE, {
        result: 'typed_data_error',
        error: error?.message
      });
    }
  });

  const onCompleted = () => {
    toast.success('Default profile updated successfully!');
    Mixpanel.track(SETTINGS.ACCOUNT.SET_DEFAULT_PROFILE, { result: 'success' });
  };

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'setDefaultProfileWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onCompleted();
    },
    onError: (error: any) => {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  const hasDefaultProfile = !!profiles.find((o) => o.isDefault);
  const sortedProfiles: Profile[] = profiles?.sort((a, b) =>
    !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
  );

  useEffect(() => {
    setSelectedUser(sortedProfiles[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
      Mixpanel.track(SETTINGS.ACCOUNT.SET_DEFAULT_PROFILE, {
        result: 'broadcast_error',
        error: error?.message
      });
    }
  });
  const [createSetDefaultProfileTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_SET_DEFAULT_PROFILE_DATA_MUTATION,
    {
      onCompleted: async ({
        createSetDefaultProfileTypedData
      }: {
        createSetDefaultProfileTypedData: SetDefaultProfileBroadcastItemResult;
      }) => {
        const { id, typedData } = createSetDefaultProfileTypedData;
        const { deadline } = typedData?.value;

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          });
          setUserSigNonce(userSigNonce + 1);
          const { wallet, profileId } = typedData?.value;
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            follower: address,
            wallet,
            profileId,
            sig
          };
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch (error) {}
      },
      onError: (error) => {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const setDefaultProfile = () => {
    if (!isAuthenticated) {
      return toast.error(SIGN_WALLET);
    }

    createSetDefaultProfileTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { profileId: selectedUser }
      }
    });
  };

  if (!isAuthenticated) {
    return <Custom404 />;
  }

  return (
    <Card>
      <CardBody className="space-y-5">
        {error && <ErrorMessage title="Transaction failed!" error={error} />}
        {hasDefaultProfile ? (
          <>
            <div className="text-lg font-bold">Your default profile</div>
            <UserProfile profile={sortedProfiles[0]} />
          </>
        ) : (
          <div className="flex items-center space-x-1.5 font-bold text-yellow-500">
            <ExclamationIcon className="w-5 h-5" />
            <div>You don&rsquo;t have any default profile set!</div>
          </div>
        )}
        <div className="text-lg font-bold">Select default profile</div>
        <p>
          Selecting your default account helps to display the selected profile across {APP_NAME}, you can
          change your default profile anytime.
        </p>
        <div className="text-lg font-bold">What else you should know</div>
        <div className="text-sm text-gray-500 divide-y dark:divide-gray-700">
          <p className="pb-3">
            Only the default profile will be visible across the {APP_NAME}, example notifications, follow etc.
          </p>
          <p className="py-3">You can change default profile anytime here.</p>
        </div>
        <div>
          <div className="label">Select profile</div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {sortedProfiles?.map((profile: Profile) => (
              <option key={profile?.id} value={profile?.id}>
                @{profile?.handle}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <Button
            className="ml-auto"
            type="submit"
            disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
            onClick={setDefaultProfile}
            icon={
              typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="w-4 h-4" />
              )
            }
          >
            Save
          </Button>
          {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
            <IndexStatus
              txHash={writeData?.hash ? writeData?.hash : broadcastData?.broadcast?.txHash}
              reload
            />
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
};

export default SetProfile;
