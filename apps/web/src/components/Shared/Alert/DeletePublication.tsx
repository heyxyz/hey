import { PUBLICATION } from '@hey/data/tracking';
import { useHidePublicationMutation } from '@hey/lens';
import { Alert } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, memo } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/useGlobalAlertStateStore';

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
      title="Delete Publication?"
      description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
      confirmText="Delete"
      show={showPublicationDeleteAlert}
      isDestructive
      isPerformingAction={loading}
      onConfirm={() =>
        hidePost({
          variables: { request: { for: deletingPublication?.id } }
        })
      }
      onClose={() => setShowPublicationDeleteAlert(false, null)}
    />
  );
};

export default memo(DeletePublication);
