import Loader from "@components/Shared/Loader";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { STAFFTOOLS } from "@hey/data/tracking";
import getAllTokens, {
  GET_ALL_TOKENS_QUERY_KEY
} from "@hey/helpers/api/getAllTokens";
import type { AllowedToken } from "@hey/types/hey";
import { Button, Card, EmptyState, ErrorMessage, H5, Modal } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import Create from "./Create";

const List: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tokens, setTokens] = useState<[] | AllowedToken[]>([]);

  const { error, isLoading } = useQuery({
    queryFn: () =>
      getAllTokens().then((tokens) => {
        setTokens(tokens);
        return tokens;
      }),
    queryKey: [GET_ALL_TOKENS_QUERY_KEY]
  });

  const handleDeleteToken = async (id: string) => {
    try {
      await axios.post(
        `${HEY_API_URL}/internal/tokens/delete`,
        { id },
        { headers: getAuthApiHeaders() }
      );

      setTokens(tokens.filter((token) => token.id !== id));
      toast.success("Token deleted");
      Leafwatch.track(STAFFTOOLS.TOKENS.DELETE);
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <H5>Allowed Tokens</H5>
        <Button onClick={() => setShowCreateModal(!showCreateModal)}>
          Create
        </Button>
      </div>
      <div className="divider" />
      <div className="m-5">
        {isLoading ? (
          <Loader className="my-10" message="Loading tokens..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load tokens" />
        ) : tokens.length ? (
          <div className="space-y-6">
            {tokens?.map((token) => (
              <div className="flex items-center justify-between" key={token.id}>
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
                  onClick={() => handleDeleteToken(token.id)}
                  outline
                  size="sm"
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            hideCard
            icon={<CurrencyDollarIcon className="size-8" />}
            message={<span>No tokens found</span>}
          />
        )}
      </div>
      <Modal
        onClose={() => setShowCreateModal(false)}
        show={showCreateModal}
        title="Create token"
      >
        <Create
          setShowCreateModal={setShowCreateModal}
          setTokens={setTokens}
          tokens={tokens}
        />
      </Modal>
    </Card>
  );
};

export default List;
