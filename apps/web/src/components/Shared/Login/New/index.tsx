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
import { type FC } from 'react';
import { useAccount } from 'wagmi';
import { object, string } from 'zod';

import errorToast from '@/lib/errorToast';

import Pending from './Pending';

const newUserSchema = object({
  handle: string()
    .min(3, { message: 'Handle should be at least 3 characters' })
    .max(31, { message: 'Handle should not exceed 31 characters' })
    .regex(Regex.handle, {
      message: 'Handle should only contain alphanumeric characters'
    })
});

interface NewProfileProps {
  isModal?: boolean;
}

const NewProfile: FC<NewProfileProps> = ({ isModal = false }) => {
  const { address } = useAccount();

  const form = useZodForm({
    schema: newUserSchema
  });

  const onError = (error: any) => {
    errorToast(error);
  };

  const [createProfileWithHandle, { data, loading }] =
    useCreateProfileWithHandleMutation({ onError });

  const relayErrorToString = (
    error: CreateProfileWithHandleErrorReasonType
  ): string => {
    return error === CreateProfileWithHandleErrorReasonType.HandleTaken
      ? 'The selected handle is already taken'
      : error;
  };

  const signup = async (handle: string) => {
    const username = handle.toLowerCase();
    await createProfileWithHandle({
      variables: { request: { handle: username, to: address } }
    });
  };

  return data?.createProfileWithHandle.__typename === 'RelaySuccess' &&
    data?.createProfileWithHandle.txId ? (
    <Pending txId={data?.createProfileWithHandle?.txId} />
  ) : (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ handle }) => signup(handle)}
    >
      {data?.createProfileWithHandle.__typename ===
        'CreateProfileWithHandleErrorResult' &&
      data?.createProfileWithHandle.reason ? (
        <ErrorMessage
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: relayErrorToString(data?.createProfileWithHandle?.reason)
          }}
          className="mb-3"
        />
      ) : null}
      {isModal ? (
        <div className="mb-2 space-y-4">
          <img
            className="h-10 w-10"
            height={40}
            width={40}
            src="/logo.png"
            alt="Logo"
          />
          <div className="text-xl font-bold">Sign up to {APP_NAME}</div>
        </div>
      ) : null}
      <Input
        label="Handle"
        type="text"
        placeholder="gavin"
        {...form.register('handle')}
      />
      <Button
        className="ml-auto"
        type="submit"
        disabled={loading}
        icon={
          loading ? <Spinner size="xs" /> : <PlusIcon className="h-4 w-4" />
        }
      >
        Sign up
      </Button>
    </Form>
  );
};

export default NewProfile;
