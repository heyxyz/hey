import ChooseFile from '@components/Shared/ChooseFile';
import { PlusIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import {
  CreateProfileWithHandleErrorReasonType,
  useCreateProfileWithHandleMutation
} from '@hey/lens';
import {
  Button,
  ErrorMessage,
  Form,
  Input,
  Spinner,
  useZodForm
} from '@hey/ui';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { object, string } from 'zod';

import Pending from './Pending';

const newUserSchema = object({
  handle: string()
    .min(5, { message: t`Handle should be at least 5 characters` })
    .max(26, { message: t`Handle should not exceed 26 characters` })
    .regex(Regex.handle, {
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
  const [createProfileWithHandle, { data, loading }] =
    useCreateProfileWithHandleMutation();

  const form = useZodForm({
    schema: newUserSchema
  });

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files?.length) {
      try {
        setUploading(true);
        const attachment = await uploadFileToIPFS(event.target.files[0]);
        if (attachment.uri) {
          setAvatar(attachment.uri);
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const relayErrorToString = (
    error: CreateProfileWithHandleErrorReasonType
  ): string => {
    return error === CreateProfileWithHandleErrorReasonType.HandleTaken
      ? t`The selected handle is already taken`
      : error;
  };

  return data?.createProfileWithHandle.__typename === 'RelaySuccess' &&
    data?.createProfileWithHandle.txHash ? (
    <Pending
      handle={form.getValues('handle')}
      txHash={data?.createProfileWithHandle?.txHash}
    />
  ) : (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ handle }) => {
        const username = handle.toLowerCase();
        createProfileWithHandle({
          variables: { request: { handle: username, to: address } }
        });
      }}
    >
      {data?.createProfileWithHandle.__typename ===
        'CreateProfileWithHandleErrorResult' &&
      data?.createProfileWithHandle.reason ? (
        <ErrorMessage
          className="mb-3"
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: relayErrorToString(data?.createProfileWithHandle?.reason)
          }}
        />
      ) : null}
      {isModal ? (
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
      ) : null}
      <Input
        label={t`Handle`}
        type="text"
        placeholder="gavin"
        {...form.register('handle')}
      />
      <div className="space-y-1.5">
        <div className="label">Avatar</div>
        <div className="space-y-3">
          {avatar ? (
            <div>
              <img
                className="h-60 w-60 rounded-lg"
                height={240}
                width={240}
                src={avatar}
                alt={avatar}
              />
            </div>
          ) : null}
          <div>
            <div className="flex items-center space-x-3">
              <ChooseFile
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  handleUpload(evt)
                }
              />
              {uploading ? <Spinner size="sm" /> : null}
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
