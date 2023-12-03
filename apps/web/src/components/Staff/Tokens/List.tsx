import Loader from '@components/Shared/Loader';
import { CurrencyDollarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import type { AllowedToken } from '@hey/types/hey';
import { Button, Card, EmptyState, ErrorMessage, Modal } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';

import Create from './Create';

const List: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tokens, setTokens] = useState<AllowedToken[] | []>([]);

  const getAllTokens = async (): Promise<AllowedToken[] | []> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/token/all`, {
        headers: getAuthWorkerHeaders()
      });
      const { data } = response;
      setTokens(data?.tokens || []);

      return data?.tokens || [];
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error } = useQuery({
    queryKey: ['getAllTokens'],
    queryFn: getAllTokens
  });

  const deleteToken = async (id: string) => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/token/delete`,
        { id },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Deleting token...',
        success: () => {
          setTokens(tokens.filter((token) => token.id !== id));
          return 'Token deleted';
        },
        error: 'Failed to delete token'
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <div className="text-lg font-bold">Allowed Tokens</div>
        <Button onClick={() => setShowCreateModal(!showCreateModal)}>
          Create
        </Button>
      </div>
      <div className="divider" />
      <div className="p-5">
        {isLoading ? (
          <Loader message="Loading profiles..." />
        ) : error ? (
          <ErrorMessage title="Failed to load feature flags" error={error} />
        ) : !tokens.length ? (
          <EmptyState
            message={<span>No tokens found</span>}
            icon={<CurrencyDollarIcon className="text-brand-500 h-8 w-8" />}
            hideCard
          />
        ) : (
          <div className="space-y-5">
            {tokens?.map((token) => (
              <div key={token.id} className="flex items-center justify-between">
                <div>
                  <b>{token.name}</b> ({token.symbol})
                  <div className="mt-2 text-sm">
                    <span className="ld-text-gray-500">Decimals: </span>
                    {token.decimals}
                  </div>
                  <div className="text-sm">
                    <span className="ld-text-gray-500">Contract: </span>
                    {token.contractAddress}
                  </div>
                </div>
                <Button
                  onClick={() => deleteToken(token.id)}
                  icon={<TrashIcon className="h-4 w-4" />}
                  outline
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        title="Create feature flag"
        show={showCreateModal}
        onClose={() => setShowCreateModal(!showCreateModal)}
      >
        <Create
          tokens={tokens}
          setTokens={setTokens}
          setShowCreateModal={setShowCreateModal}
        />
      </Modal>
    </Card>
  );
};

export default List;
