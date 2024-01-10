import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { TriStateValue } from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import toast from 'react-hot-toast';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';

interface QuoteProps {
  publication: AnyPublication;
}

const Quote: FC<QuoteProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const publicationType = targetPublication.__typename;

  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );
  const setQuotedPublication = usePublicationStore(
    (state) => state.setQuotedPublication
  );
  const { isSuspended } = useProfileRestriction();

  if (targetPublication.operations.canQuote === TriStateValue.No) {
    return null;
  }

  return (
    <DropdownMenuItem
      className="m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
      onClick={() => {
        if (isSuspended) {
          return toast.error(Errors.Suspended);
        }

        setQuotedPublication(publication);
        setShowNewPostModal(true);
      }}
    >
      <div className="flex items-center space-x-2">
        <ChatBubbleBottomCenterTextIcon className="size-4" />
        <div>
          {publicationType === 'Comment' ? 'Quote comment' : 'Quote post'}
        </div>
      </div>
    </DropdownMenuItem>
  );
};

export default Quote;
