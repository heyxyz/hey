import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { Errors } from "@hey/data/errors";
import { PUBLICATION } from "@hey/data/tracking";
import { useHidePublicationMutation } from "@hey/lens";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { toast } from "react-hot-toast";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import { useProfileStatus } from "src/store/non-persisted/useProfileStatus";

const DeletePublication: FC = () => {
  const { deletingPost, setShowPostDeleteAlert, showPostDeleteAlert } =
    useGlobalAlertStateStore();
  const { isSuspended } = useProfileStatus();

  const [hidePost, { loading }] = useHidePublicationMutation({
    onCompleted: () => {
      setShowPostDeleteAlert(false, null);
      toast.success("Publication deleted");
      Leafwatch.track(PUBLICATION.DELETE);
    },
    update: (cache) => {
      cache.evict({
        id: `${deletingPost?.__typename}:${deletingPost?.id}`
      });
    }
  });

  const deletePublication = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      return await hidePost({
        variables: { request: { for: deletingPost?.id } }
      });
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Alert
      confirmText="Delete"
      description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
      isDestructive
      isPerformingAction={loading}
      onClose={() => setShowPostDeleteAlert(false, null)}
      onConfirm={deletePublication}
      show={showPostDeleteAlert}
      title="Delete Publication?"
    />
  );
};

export default DeletePublication;
