import { gql, useMutation } from '@apollo/client';
import ChooseFile from '@components/Shared/ChooseFile';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { RelayerResultFields } from '@gql/RelayerResultFields';
import { PlusIcon } from '@heroicons/react/outline';
import uploadMediaToIPFS from '@lib/uploadMediaToIPFS';
import React, { ChangeEvent, FC, useState } from 'react';
import { APP_NAME, HANDLE_REGEX } from 'src/constants';
import { useAccount } from 'wagmi';
import { object, string } from 'zod';

import Pending from './Pending';

const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfile($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ...RelayerResultFields
    }
  }
  ${RelayerResultFields}
`;

const newUserSchema = object({
  handle: string()
    .min(2, { message: 'Handle should be atleast 2 characters' })
    .max(31, { message: 'Handle should be less than 32 characters' })
    .regex(HANDLE_REGEX, {
      message: 'Handle should only contain alphanumeric characters'
    })
});

interface Props {
  isModal?: boolean;
}

const NewProfile: FC<Props> = ({ isModal = false }) => {
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const { address } = useAccount();
  const [createProfile, { data, loading }] = useMutation(CREATE_PROFILE_MUTATION);

  const form = useZodForm({
    schema: newUserSchema
  });

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadMediaToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setAvatar(attachment[0].item);
      }
    } finally {
      setUploading(false);
    }
  };

  return data?.createProfile?.txHash ? (
    <Pending handle={form.getValues('handle')} txHash={data?.createProfile?.txHash} />
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
              profilePictureUri: avatar ? avatar : `https://avatar.tobi.sh/${address}_${username}.png`
            }
          }
        });
      }}
    >
      {data?.createProfile?.reason && (
        <ErrorMessage
          className="mb-3"
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: data?.createProfile?.reason
          }}
        />
      )}
      {isModal && (
        <div className="mb-2 space-y-4">
          <img className="w-10 h-10" height={40} width={40} src="/logo.svg" alt="Logo" />
          <div className="text-xl font-bold">Signup to {APP_NAME}</div>
        </div>
      )}
      <Input label="Handle" type="text" placeholder="gavin" {...form.register('handle')} />
      <div className="space-y-1.5">
        <div className="label">Avatar</div>
        <div className="space-y-3">
          {avatar && (
            <div>
              <img className="w-60 h-60 rounded-lg" height={240} width={240} src={avatar} alt={avatar} />
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
        disabled={loading}
        icon={loading ? <Spinner size="xs" /> : <PlusIcon className="w-4 h-4" />}
      >
        Signup
      </Button>
    </Form>
  );
};

export default NewProfile;
