import IndexStatus from "@components/Shared/IndexStatus";
import LazySmallSingleAccount from "@components/Shared/LazySmallSingleAccount";
import Loader from "@components/Shared/Loader";
import Slug from "@components/Shared/Slug";
import errorToast from "@helpers/errorToast";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import { Button, EmptyState } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const LinkHandle: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [linkingHandle, setLinkingHandle] = useState<null | string>(null);

  const onError = (error: any) => {
    setLinkingHandle(null);
    errorToast(error);
  };

  const { data, loading } = useOwnedHandlesQuery({
    variables: { request: { for: currentAccount?.owner } }
  });

  const handleLink = async (handle: string) => {
    if (!currentAccount) {
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    const confirmation = confirm("Are you sure you want to link this handle?");

    if (!confirmation) {
      return;
    }

    try {
      setLinkingHandle(handle);
      const request: LinkHandleToProfileRequest = { handle };

      return await createLinkHandleToProfileTypedData({
        variables: { request }
      });
    } catch (error) {
      onError(error);
    }
  };

  if (loading) {
    return <Loader className="py-10" />;
  }

  const ownedHandles = data?.ownedHandles.items.filter(
    (handle) => handle.linkedTo?.nftTokenId !== currentAccount?.address
  );

  if (!ownedHandles?.length) {
    return (
      <EmptyState
        hideCard
        icon={<AtSymbolIcon className="size-8" />}
        message="No handles found to link!"
      />
    );
  }

  return (
    <div className="m-5 space-y-6">
      {ownedHandles?.map((handle) => (
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          key={handle.fullHandle}
        >
          <div className="flex items-center space-x-2">
            <Slug className="font-bold" slug={handle.fullHandle} />
            {handle.linkedTo ? (
              <div className="flex items-center space-x-2">
                <span>·</span>
                <div>Linked to</div>
                <LazySmallSingleAccount address={handle.linkedTo?.nftTokenId} />
              </div>
            ) : null}
          </div>
          {writeHash ? (
            <div className="mt-2">
              <IndexStatus shouldReload txHash={writeHash} />
            </div>
          ) : (
            <Button
              disabled={linkingHandle === handle.fullHandle}
              onClick={() => handleLink(handle.fullHandle)}
              outline
            >
              {handle.linkedTo ? "Unlink and Link" : "Link"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
