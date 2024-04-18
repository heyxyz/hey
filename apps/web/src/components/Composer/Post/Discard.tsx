import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Alert } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface DiscardProps {
  onDiscard: () => void;
}

const Discard: FC<DiscardProps> = ({ onDiscard }) => {
  const { setShowDiscardModal, showDiscardModal } = useGlobalModalStateStore();
  const { publicationContent } = usePublicationStore();
  const { attachments, isUploading } = usePublicationAttachmentStore(
    (state) => state
  );
  const { collectModule } = useCollectModuleStore((state) => state);
  const { openAction } = useOpenActionStore();

  const updateDraft = async () => {
    try {
      const draft = {
        attachments: attachments.length ? JSON.stringify(attachments) : null,
        collectModule: collectModule.type
          ? JSON.stringify(collectModule)
          : null,
        content: publicationContent,
        openActionModules: openAction ? JSON.stringify(openAction) : null
      };

      await axios.post(`${HEY_API_URL}/drafts/update`, draft, {
        headers: getAuthApiHeaders()
      });
      onDiscard();
      setShowDiscardModal(false);
    } catch {
      return toast.error('Error saving draft');
    }
  };

  return (
    <Alert
      cancelText="Save as draft"
      confirmText="Discard"
      description="You can save this to send later from your drafts."
      isDestructive
      isPerformingAction={isUploading}
      onClose={updateDraft}
      onConfirm={() => setShowDiscardModal(false)}
      show={showDiscardModal}
      title="Discard Post"
    />
  );
};

export default Discard;
