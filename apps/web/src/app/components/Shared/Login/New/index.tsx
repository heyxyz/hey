'use client';
import ChooseFile from '@components/Shared/ChooseFile';
import { PlusIcon } from '@heroicons/react/outline';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import { APP_NAME, HANDLE_REGEX, ZERO_ADDRESS } from 'data/constants';
import { RelayErrorReasons, useCreateProfileMutation } from 'lens';
import getStampFyiURL from 'lib/getStampFyiURL';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { Button, ErrorMessage, Form, Input, Spinner, useZodForm } from 'ui';
import { useAccount } from 'wagmi';
import { object, string } from 'zod';

import Pending from './Pending';

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
  const { address } = useAccount();
  const [createProfile, { data, loading }] = useCreateProfileMutation();

  const form = useZodForm({
    schema: newUserSchema
  });

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files?.length) {
      try {
        setUploading(true);
        const attachment = await uploadFileToIPFS(event.target.files[0]);
        if (attachment.original.url) {
          setAvatar(attachment.original.url);
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const relayErrorToString = (error: RelayErrorReasons): string => {
    return error === RelayErrorReasons.HandleTaken
      ? t`The selected handle is already taken`
      : error;
  };

  return data?.createProfile.__typename === 'RelayerResult' &&
    data?.createProfile.txHash ? (
    <Pending
      handle={form.getValues('handle')}
      txHash={data?.createProfile?.txHash}
    />
  ) : (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ handle }) => {
        const username = handle.toLowerCase();
        createProfile({
          variables: {
            request: {
              handle: username,
              profilePictureUri: avatar
                ? avatar
                : getStampFyiURL(address ?? ZERO_ADDRESS)
            }
          }
        });
      }}
    >
      {data?.createProfile.__typename === 'RelayError' &&
        data?.createProfile.reason && (
          <ErrorMessage
            className="mb-3"
            title="Create profile failed!"
            error={{
              name: 'Create profile failed!',
              message: relayErrorToString(data?.createProfile?.reason)
            }}
          />
        )}
      {isModal && (
        <div className="mb-2 space-y-4">
          <img
            className="h-10 w-10"
            height={40}
            width={40}
            src="/logo.svg"
            alt="Logo"
          />
          <div className="text-xl font-bold">
            <Trans>Sign up to {APP_NAME}</Trans>
          </div>
        </div>
      )}
      <Input
        label={t`Handle`}
        type="text"
        placeholder="gavin"
        {...form.register('handle')}
      />
      <div className="space-y-1.5">
        <div className="label">Avatar</div>
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="h-60 w-60 rounded-lg"
                height={240}
                width={240}
                src={avatar}
                alt={avatar}
              />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-3">
              <ChooseFile
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  handleUpload(evt)
                }
              />
              {uploading && <Spinner size="sm" />}
            </div>
          </div>
        </div>
      </div>
      <Button
        className="ml-auto"
        type="submit"
        disabled={loading}
        icon={
          loading ? <Spinner size="xs" /> : <PlusIcon className="h-4 w-4" />
        }
      >
        <Trans>Sign up</Trans>
      </Button>
    </Form>
  );
};

export default NewProfile;
