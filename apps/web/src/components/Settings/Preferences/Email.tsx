import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { HEY_API_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import getPreferences from '@hey/lib/api/getPreferences';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { object, string } from 'zod';

const updateEmailSchema = object({
  email: string().email({ message: 'Invalid email' })
});

const Email: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const preferences = usePreferencesStore((state) => state.preferences);
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const [updating, setUpdating] = useState(false);

  const form = useZodForm({
    defaultValues: {
      email: preferences.email || ''
    },
    schema: updateEmailSchema
  });

  const saveSettings = (email: string) => {
    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preference/updatePreferences`,
        { email, marketingOptIn: preferences.marketingOptIn },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating email preference';
        },
        loading: 'Updating email preference...',
        success: () => {
          getPreferences(currentProfile?.id, getAuthWorkerHeaders());
          setUpdating(false);
          Leafwatch.track(SETTINGS.PREFERENCES.UPDATE_EMAIL);
          return 'Email preference updated';
        }
      }
    );
  };

  return (
    <Form
      form={form}
      onSubmit={async ({ email }) => {
        await saveSettings(email);
      }}
    >
      <div className="text-lg font-bold">Email Settings</div>
      <div className="mt-4">
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          {...form.register('email')}
        />
        <div className="mt-4">
          <ToggleWithHelper
            description="You will receive updates on new features and promotions from Hey to your email address"
            heading="News about Hey product and feature updates"
            on={preferences.marketingOptIn}
            setOn={() =>
              setPreferences({
                ...preferences,
                marketingOptIn: !preferences.marketingOptIn
              })
            }
          />
        </div>
        <Button className="mt-5" disabled={updating} type="submit">
          Save Changes
        </Button>
      </div>
    </Form>
  );
};

export default Email;
