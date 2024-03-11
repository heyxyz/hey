import type { FC } from 'react';

import { Errors } from '@hey/data';
import { PUBLICATION } from '@hey/data/tracking';
import { useHidePublicationMutation } from '@hey/lens';
import { Alert } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';

const DeletePublication: FC = () => {
  const {
    deletingPublication,
    setShowPublicationDeleteAlert,
    showPublicationDeleteAlert
  } = useGlobalAlertStateStore();
  const { isSuspended } = useProfileRestriction();

  const [hidePost, { loading }] = useHidePublicationMutation({
    onCompleted: () => {
      setShowPublicationDeleteAlert(false, null);
      Leafwatch.track(PUBLICATION.DELETE);
      toast.success('Publication deleted successfully');
    },
    update: (cache) => {
      cache.evict({
        id: `${deletingPublication?.__typename}:${deletingPublication?.id}`
      });
    }
  });

  const deletePublication = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      return await hidePost({
        variables: { request: { for: deletingPublication?.id } }
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
      onClose={() => setShowPublicationDeleteAlert(false, null)}
      onConfirm={deletePublication}
      show={showPublicationDeleteAlert}
      title="Delete Publication?"
    />
  );
};

export default DeletePublication;
