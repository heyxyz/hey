import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import errorToast from 'src/helpers/errorToast';
import getAuthApiHeaders from 'src/helpers/getAuthApiHeaders';
import { Leafwatch } from 'src/helpers/leafwatch';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { object, string } from 'zod';

const updateEmailSchema = object({
  email: string().email()
});

const EmailForm: FC = () => {
  const { currentProfile } = useProfileStore();
  const { email, setEmail: setEmailState } = usePreferencesStore();
  const { isSuspended } = useProfileRestriction();
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm({ schema: updateEmailSchema });

  useEffect(() => {
    if (email) {
      form.setValue('email', email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

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
      await axios.post(
        `${HEY_API_URL}/email/update`,
        { email },
        { headers: getAuthApiHeaders() }
      );
      setEmailState(email as string);
      Leafwatch.track(SETTINGS.ACCOUNT.SET_EMAIL);

      return toast.success('Email verification sent to your email!');
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      className="space-y-4"
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
        <Button disabled={isLoading || !form.formState.isDirty} type="submit">
          Set Email
        </Button>
      </div>
    </Form>
  );
};

export default EmailForm;
