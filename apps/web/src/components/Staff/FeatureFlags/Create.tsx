import type { Feature } from '@hey/types/hey';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { object, string } from 'zod';

const createFeatureSchema = object({
  key: string().min(1, { message: 'Key is required' })
});

interface CreateProps {
  features: Feature[];
  setFeatures: (flags: any) => void;
  setShowCreateModal: (show: boolean) => void;
}

const Create: FC<CreateProps> = ({
  features,
  setFeatures,
  setShowCreateModal
}) => {
  const [creating, setCreating] = useState(false);

  const form = useZodForm({
    schema: createFeatureSchema
  });

  const create = async (key: string) => {
    setCreating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/feature/create`,
        { key },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setCreating(false);
          return 'Failed to create feature flag';
        },
        loading: 'Creating feature flag...',
        success: ({ data }) => {
          setFeatures([...features, data.feature]);
          setCreating(false);
          setShowCreateModal(false);
          return 'Feature flag created';
        }
      }
    );
  };

  return (
    <Form
      className="m-5 space-y-4"
      form={form}
      onSubmit={async ({ key }) => {
        await create(key);
      }}
    >
      <Input
        className="text-sm"
        placeholder="Key"
        type="text"
        {...form.register('key')}
      />
      <Button disabled={creating} type="submit">
        Create
      </Button>
    </Form>
  );
};

export default Create;
