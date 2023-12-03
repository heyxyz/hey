import { HEY_API_URL } from '@hey/data/constants';
import type { Features } from '@hey/types/hey';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { object, string } from 'zod';

import getAuthWorkerHeaders from '@/lib/getAuthWorkerHeaders';

const createFeatureSchema = object({
  key: string().min(1, { message: 'Key is required' })
});

interface CreateProps {
  flags: Features[];
  setFlags: (flags: any) => void;
  setShowCreateModal: (show: boolean) => void;
}

const Create: FC<CreateProps> = ({ flags, setFlags, setShowCreateModal }) => {
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
        loading: 'Creating feature flag...',
        success: ({ data }) => {
          setFlags([...flags, data.feature]);
          setCreating(false);
          setShowCreateModal(false);
          return 'Feature flag created';
        },
        error: () => {
          setCreating(false);
          return 'Failed to create feature flag';
        }
      }
    );
  };

  return (
    <Form
      form={form}
      className="m-5 space-y-4"
      onSubmit={async ({ key }) => {
        await create(key);
      }}
    >
      <Input
        className="text-sm"
        type="text"
        placeholder="Key"
        {...form.register('key')}
      />
      <Button type="submit" disabled={creating}>
        Create
      </Button>
    </Form>
  );
};

export default Create;
