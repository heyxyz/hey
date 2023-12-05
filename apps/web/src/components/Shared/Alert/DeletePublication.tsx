import type { FC } from 'react';

import { PUBLICATION } from '@hey/data/tracking';
import { useHidePublicationMutation } from '@hey/lens';
import { Alert } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

const DeletePublication: FC = () => {
  const showPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.showPublicationDeleteAlert
  );
  const setShowPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.setShowPublicationDeleteAlert
  );
  const deletingPublication = useGlobalAlertStateStore(
    (state) => state.deletingPublication
  );

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

  return (
    <Alert
      confirmText="Delete"
      description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
      isDestructive
      isPerformingAction={loading}
      onClose={() => setShowPublicationDeleteAlert(false, null)}
      onConfirm={() =>
        hidePost({
          variables: { request: { for: deletingPublication?.id } }
        })
      }
      show={showPublicationDeleteAlert}
      title="Delete Publication?"
    />
  );
};

export default DeletePublication;
