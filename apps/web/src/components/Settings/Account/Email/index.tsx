import type { FC } from 'react';

import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { Button, Card, CardHeader, Form, Input, useZodForm } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { object, string } from 'zod';

const updateEmailSchema = object({
  email: string().email()
});

const Email: FC = () => {
  const { currentProfile } = useProfileStore();
  const { email } = usePreferencesStore();
  const { isSuspended } = useProfileRestriction();
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm({
    defaultValues: { email: email! },
    schema: updateEmailSchema
  });

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const setEmail = async (email: null | string) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      return await axios.post(
        `${HEY_API_URL}/email/update`,
        { email },
        { headers: getAuthApiHeaders() }
      );
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Card>
      <CardHeader
        body={`You will receive updates on new features and promotions from ${APP_NAME} to your email address`}
        title="Set Email"
      />
      <Form
        className="m-5 space-y-4"
        form={form}
        onSubmit={async ({ email }) => {
          await setEmail(email);
        }}
      >
        <Input
          label="Email address"
          placeholder="gavin@hooli.com"
          {...form.register('email')}
          type="email"
        />
        <div className="ml-auto">
          <Button disabled={isLoading} type="submit">
            Set Email
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Email;
