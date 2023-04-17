import ChooseFile from '@components/Shared/ChooseFile';
import { PlusIcon } from '@heroicons/react/outline';
import uploadToIPFS from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import { APP_NAME, HANDLE_REGEX, ZERO_ADDRESS } from 'data/constants';
import { ethers } from 'ethers';
import getStampFyiURL from 'lib/getStampFyiURL';
import type { ChangeEvent, FC } from 'react';
import React, { useState } from 'react';
import { Button, ErrorMessage, Form, Input, Spinner, useZodForm } from 'ui';
import { useAccount } from 'wagmi';
import { object, string } from 'zod';

const newUserSchema = object({
  handle: string()
    .min(2, { message: t`Handle should be at least 2 characters` })
    .max(31, { message: t`Handle should not exceed 32 characters` })
    .regex(HANDLE_REGEX, {
      message: t`Handle should only contain alphanumeric characters`
    })
});

interface NewProfileProps {
  isModal?: boolean;
}

const NewProfile: FC<NewProfileProps> = ({ isModal = false }) => {
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { address } = useAccount();

  const { isConnected, connector } = useAccount();

  const form = useZodForm({
    schema: newUserSchema
  });

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setAvatar(attachment[0].item);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProfile = async (username: string, avatar: string) => {
    if (connector) {
      setLoading(true);
      const { ethereum } = window as any;
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.providers.Web3Provider(ethereum);
      const walletAddress = accounts[0]; // first account in MetaMask
      const signer = provider.getSigner(walletAddress);

      const mockProfileProxyCreator = new ethers.Contract(
        '0x923e7786176Ef21d0B31645fB1353b1392Dd0e40',
        [
          {
            inputs: [
              {
                internalType: 'contract ILensHub',
                name: 'hub',
                type: 'address'
              }
            ],
            stateMutability: 'nonpayable',
            type: 'constructor'
          },
          {
            inputs: [],
            name: 'HandleContainsInvalidCharacters',
            type: 'error'
          },
          { inputs: [], name: 'HandleFirstCharInvalid', type: 'error' },
          { inputs: [], name: 'HandleLengthInvalid', type: 'error' },
          {
            inputs: [
              {
                components: [
                  { internalType: 'address', name: 'to', type: 'address' },
                  { internalType: 'string', name: 'handle', type: 'string' },
                  { internalType: 'string', name: 'imageURI', type: 'string' },
                  {
                    internalType: 'address',
                    name: 'followModule',
                    type: 'address'
                  },
                  {
                    internalType: 'bytes',
                    name: 'followModuleInitData',
                    type: 'bytes'
                  },
                  {
                    internalType: 'string',
                    name: 'followNFTURI',
                    type: 'string'
                  }
                ],
                internalType: 'struct DataTypes.CreateProfileData',
                name: 'vars',
                type: 'tuple'
              }
            ],
            name: 'proxyCreateProfile',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        signer
      );

      const createProfileRequest = {
        to: walletAddress,
        handle: username,
        imageURI: '', // TODO: add picture URL once fixed
        followModule: '0x0000000000000000000000000000000000000000',
        followModuleInitData: '0x',
        followNFTURI: ''
      };

      const result = await mockProfileProxyCreator.proxyCreateProfile(createProfileRequest, {
        gasLimit: 300000
      });

      try {
        await result.wait();
      } catch {
        setError(true);
      }
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={async ({ handle }) => {
        const username = handle.toLowerCase();
        const profilePicture = avatar || getStampFyiURL(address ?? ZERO_ADDRESS);

        await handleCreateProfile(username, profilePicture);
      }}
    >
      {error && (
        <ErrorMessage
          className="mb-3"
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: 'Something went wrong with the transaction'
          }}
        />
      )}
      {isModal && (
        <div className="mb-2 space-y-4">
          <img className="h-10 w-10" height={40} width={40} src="/logo.svg" alt="Logo" />
          <div className="text-xl font-bold">
            <Trans>Sign up to {APP_NAME}</Trans>
          </div>
        </div>
      )}
      <Input label={t`Handle`} type="text" placeholder="gavin" {...form.register('handle')} />
      <div className="space-y-1.5">
        <div className="label">Avatar</div>
        <div className="space-y-3">
          {avatar && (
            <div>
              <img className="h-60 w-60 rounded-lg" height={240} width={240} src={avatar} alt={avatar} />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-3">
              <ChooseFile onChange={(evt: ChangeEvent<HTMLInputElement>) => handleUpload(evt)} />
              {uploading && <Spinner size="sm" />}
            </div>
          </div>
        </div>
      </div>
      <Button
        className="ml-auto"
        type="submit"
        disabled={loading || !isConnected}
        icon={loading ? <Spinner size="xs" /> : <PlusIcon className="h-4 w-4" />}
      >
        <Trans>{isConnected ? 'Sign up' : 'Connect your wallet'}</Trans>
      </Button>
    </Form>
  );
};

export default NewProfile;
