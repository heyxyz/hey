import SingleAccount from "@components/Shared/SingleAccount";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  APP_NAME,
  BLOCK_EXPLORER_URL,
  NULL_ADDRESS
} from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { AccountFragment } from "@hey/indexer";
import {
  Button,
  Card,
  CardHeader,
  H5,
  Modal,
  Spinner,
  WarningMessage
} from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const DeleteSettings: FC = () => {
  const { currentAccount } = useAccountStore();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const handleDelete = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    setIsSubmitting(true);
    await handleWrongNetwork();
    setIsSubmitting(false);
    return toast.success("Feature not implemented yet");
  };

  return (
    <Card>
      <CardHeader
        body={`This will permanently delete your Account on the Lens Protocol. You will not be able to use any apps built on Lens, including ${APP_NAME}. All your data will be wiped out immediately and you won't be able to get it back.`}
        title={<div className="text-red-500">Delete Lens account</div>}
      />
      <div className="m-5 space-y-5">
        <SingleAccount
          hideFollowButton
          hideUnfollowButton
          account={currentAccount as AccountFragment}
        />
        <div className="space-y-3">
          <H5 className="text-red-500">Delete Lens account</H5>
          <p>
            This will permanently delete your Account NFT on the Lens Protocol.
            You will not be able to use any apps built on Lens, including{" "}
            {APP_NAME}. All your data will be wiped out immediately and you
            won't be able to get it back.
          </p>
        </div>
        <H5>What else you should know</H5>
        <div className="ld-text-gray-500 divide-y text-sm dark:divide-gray-700">
          <p className="pb-3">
            You cannot restore your Lens account if it was accidentally or
            wrongfully deleted.
          </p>
          <p className="py-3">
            Some account information may still be available in search engines,
            such as Google or Bing.
          </p>
          <p className="linkify py-3">
            Your account will be transferred to a{" "}
            <Link href={`${BLOCK_EXPLORER_URL}/address/${NULL_ADDRESS}`}>
              null address
            </Link>{" "}
            after deletion.
          </p>
          <p className="py-3 font-bold text-red-500">
            Your @handle will not be available for reuse.
          </p>
        </div>
        <Button
          disabled={isSubmitting}
          icon={
            isSubmitting ? (
              <Spinner size="xs" variant="danger" />
            ) : (
              <TrashIcon className="size-5" />
            )
          }
          onClick={() => setShowWarningModal(true)}
          variant="danger"
        >
          {isSubmitting ? "Deleting..." : "Delete your account"}
        </Button>
      </div>
      <Modal
        onClose={() => setShowWarningModal(false)}
        show={showWarningModal}
        title="Danger zone"
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            message={
              <div className="leading-6">
                Confirm that you have read all consequences and want to delete
                your account anyway
              </div>
            }
            title="Are you sure?"
          />
          <Button
            icon={<TrashIcon className="size-5" />}
            onClick={async () => {
              setShowWarningModal(false);
              await handleDelete();
            }}
            variant="danger"
          >
            Yes, delete my account
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default DeleteSettings;
