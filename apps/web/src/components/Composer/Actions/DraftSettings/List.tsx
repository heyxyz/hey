import type { Draft } from '@hey/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

interface ListProps {
  setShowModal: (showModal: boolean) => void;
}

const List: FC<ListProps> = ({ setShowModal }) => {
  const { setPublicationContent } = usePublicationStore();
  const { setCollectModule } = useCollectModuleStore((state) => state);
  const [editor] = useLexicalComposerContext();

  const fetchDrafts = async (): Promise<Draft[] | null> => {
    try {
      const { data } = await axios.get(`${HEY_API_URL}/drafts/all`, {
        headers: getAuthApiHeaders()
      });

      return data.result;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryFn: fetchDrafts,
    queryKey: ['fetchDrafts']
  });

  if (isLoading) {
    return <Loader className="my-10" message="Loading drafts..." />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load drafts" />;
  }

  if (!data?.length) {
    return (
      <div className="my-5">
        <EmptyState
          hideCard
          icon={<ArchiveBoxArrowDownIcon className="size-8" />}
          message="No drafts yet"
        />
      </div>
    );
  }

  const onSelectDraft = (draft: Draft) => {
    editor.update(() => {
      $convertFromMarkdownString(draft.content);
    });

    setPublicationContent(draft.content);

    if (draft.collectModule) {
      setCollectModule(JSON.parse(draft.collectModule as any));
    }

    setShowModal(false);
  };

  return (
    <div className="flex max-h-[80vh] flex-col divide-y overflow-y-auto dark:divide-gray-700">
      {data?.map((draft) => (
        <button
          className="p-5"
          key={draft.id}
          onClick={() => onSelectDraft(draft)}
        >
          <div className="flex items-center space-x-2">
            <div className="line-clamp-3 text-sm">{draft.content}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default List;
