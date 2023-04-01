import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { useHidePublicationMutation } from 'lens';
import { publicationKeyFields } from 'lens/apollo/lib';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/alerts';
import { PUBLICATION } from 'src/tracking';
import { Alert } from 'ui/Alert';

const DeletePublication: FC = () => {
  const showPublicationDeleteAlert = useGlobalAlertStateStore((state) => state.showPublicationDeleteAlert);
  const setShowPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.setShowPublicationDeleteAlert
  );
  const deletingPublication = useGlobalAlertStateStore((state) => state.deletingPublication);

  const [hidePost, { loading }] = useHidePublicationMutation({
    onCompleted: () => {
      setShowPublicationDeleteAlert(false, null);
      Mixpanel.track(PUBLICATION.DELETE);
      toast.success(t`Publication deleted successfully`);
    },
    update: (cache) => {
      cache.evict({ id: publicationKeyFields(deletingPublication) });
    }
  });

  return (
    <Alert
      title={t`Delete Publication?`}
      description={t`This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.`}
      confirmText={t`Delete`}
      show={showPublicationDeleteAlert}
      isDestructive
      isPerformingAction={loading}
      onConfirm={() => hidePost({ variables: { request: { publicationId: deletingPublication?.id } } })}
      onClose={() => setShowPublicationDeleteAlert(false, null)}
    />
  );
};

export default DeletePublication;
