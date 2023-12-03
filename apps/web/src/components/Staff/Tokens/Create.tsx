import { HEY_API_URL } from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import type { AllowedToken } from '@hey/types/hey';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { object, string } from 'zod';

import getAuthWorkerHeaders from '@/lib/getAuthWorkerHeaders';

const createTokenSchema = object({
  name: string().min(1, { message: 'Name is required' }),
  symbol: string().min(1, { message: 'Symbol is required' }),
  decimals: string().min(1, { message: 'Decimals is required' }),
  contractAddress: string()
    .min(1)
    .max(42)
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' })
});

interface CreateProps {
  tokens: AllowedToken[];
  setTokens: (tokens: any) => void;
  setShowCreateModal: (show: boolean) => void;
}

const Create: FC<CreateProps> = ({ tokens, setTokens, setShowCreateModal }) => {
  const [creating, setCreating] = useState(false);

  const form = useZodForm({
    schema: createTokenSchema
  });

  const create = async (
    name: string,
    symbol: string,
    decimals: string,
    contractAddress: string
  ) => {
    setCreating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/token/create`,
        { name, symbol, decimals: parseInt(decimals), contractAddress },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Creating token...',
        success: ({ data }) => {
          setTokens([...tokens, data?.token]);
          setCreating(false);
          setShowCreateModal(false);
          return 'Token created';
        },
        error: () => {
          setCreating(false);
          return 'Failed to create token';
        }
      }
    );
  };

  return (
    <Form
      form={form}
      className="m-5 space-y-4"
      onSubmit={async ({ name, symbol, decimals, contractAddress }) => {
        await create(name, symbol, decimals, contractAddress);
      }}
    >
      <Input
        className="text-sm"
        type="text"
        placeholder="Name"
        {...form.register('name')}
      />
      <Input
        className="text-sm"
        type="text"
        placeholder="Symbol"
        {...form.register('symbol')}
      />
      <Input
        className="text-sm"
        type="number"
        placeholder="1"
        min="0"
        max="30"
        {...form.register('decimals')}
      />
      <Input
        className="text-sm"
        type="text"
        placeholder="Contract Address"
        {...form.register('contractAddress')}
      />
      <Button type="submit" disabled={creating}>
        Create
      </Button>
    </Form>
  );
};

export default Create;
