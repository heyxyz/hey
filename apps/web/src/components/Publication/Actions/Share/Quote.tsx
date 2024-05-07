import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { TriStateValue } from '@hey/lens';
import cn from '@hey/ui/cn';
import toast from 'react-hot-toast';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface QuoteProps {
  publication: MirrorablePublication;
}

const Quote: FC<QuoteProps> = ({ publication }) => {
  const { currentProfile } = useProfileStore();
  const { setShowAuthModal, setShowNewPostModal } = useGlobalModalStateStore();
  const { setQuotedPublication } = usePublicationStore();
  const { isSuspended } = useProfileRestriction();

  const publicationType = publication.__typename;

  if (publication.operations.canQuote === TriStateValue.No) {
    return null;
  }

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      onClick={() => {
        if (!currentProfile) {
          setShowAuthModal(true);
          return;
        }

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
    </Menu.Item>
  );
};

export default Quote;
