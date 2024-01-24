import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { object, string } from 'zod';

const openAiApiKeySchema = object({
  key: string()
});

const OpenAiApiKey: FC = () => {
  const openAiApiKey = usePreferencesStore((state) => state.openAiApiKey);
  const setOpenAiApiKey = usePreferencesStore((state) => state.setOpenAiApiKey);
  const [updating, setUpdating] = useState(false);

  const form = useZodForm({
    schema: openAiApiKeySchema
  });

  useEffect(() => {
    form.setValue('key', openAiApiKey || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAiApiKey]);

  const updateOpenAiApiKey = (key: string) => {
    if (!key.startsWith('sk-') && key.length > 0) {
      return toast.error('Invalid OpenAI API key');
    }

    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/preferences/update`,
        { openAiApiKey: key || null },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating OpenAI API key';
        },
        loading: 'Updating OpenAI API key...',
        success: () => {
          setUpdating(false);
          setOpenAiApiKey(key);
          Leafwatch.track(SETTINGS.PREFERENCES.ADD_OR_REMOVE_OPEN_AI_API_KEY);

          return 'OpenAI API key updated';
        }
      }
    );
  };

  return (
    <Form
      className="space-y-4"
      form={form}
      onSubmit={async ({ key }) => await updateOpenAiApiKey(key)}
    >
      <Input
        label="OpenAI API Key"
        placeholder="sk-your-api-key-here"
        {...form.register('key')}
      />
      <div className="ml-auto">
        <Button
          disabled={updating || form.watch('key') === openAiApiKey}
          type="submit"
          variant="primary"
        >
          Save OpenAI API Key
        </Button>
      </div>
    </Form>
  );
};

export default OpenAiApiKey;
