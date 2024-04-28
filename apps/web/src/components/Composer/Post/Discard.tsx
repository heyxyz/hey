import type { FC } from 'react';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { HEY_API_URL } from '@hey/data/constants';
import { Alert } from '@hey/ui';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProStore } from 'src/store/non-persisted/useProStore';

interface DiscardProps {
  onDiscard: () => void;
}

const Discard: FC<DiscardProps> = ({ onDiscard }) => {
  const { isPro } = useProStore();
  const { setShowDiscardModal, showDiscardModal } = useGlobalModalStateStore();
  const { draftId, publicationContent, setDraftId } = usePublicationStore();
  const { collectModule } = useCollectModuleStore((state) => state);

  const canBeDrafted = publicationContent.length > 0;

  const updateDraft = async () => {
    if (!canBeDrafted || !isPro) {
      setShowDiscardModal(false);
      return;
    }

    try {
      const draft = {
        collectModule: collectModule.type
          ? JSON.stringify(collectModule)
          : null,
        content: publicationContent,
        id: draftId
      };

      await axios.post(`${HEY_API_URL}/drafts/update`, draft, {
        headers: getAuthApiHeaders()
      });
      onDiscard();
      setShowDiscardModal(false);

      return toast.success(
        `Draft ${draftId ? 'updated' : 'saved'} successfully`
      );
    } catch {
      return toast.error(`Error ${draftId ? 'updating' : 'saving'} draft`);
    } finally {
      setDraftId(null);
    }
  };

  return (
    <Alert
      cancelText={
        canBeDrafted && isPro
          ? draftId
            ? 'Update draft'
            : 'Save as draft'
          : 'Cancel'
      }
      confirmText="Discard"
      description="You can save this to send later from your drafts."
      isDestructive
      onClose={updateDraft}
      onConfirm={() => {
        onDiscard();
        setShowDiscardModal(false);
      }}
      show={showDiscardModal}
      title="Discard Post"
    />
  );
};

export default Discard;
