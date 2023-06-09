import ActionType from '@components/Home/Timeline/EventType';
import type { ElectedMirror, FeedItem, Publication } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationType from './Type';

interface SinglePublicationProps {
  publication: Publication;
  feedItem?: FeedItem;
  showType?: boolean;
  showActions?: boolean;
  showModActions?: boolean;
  showThread?: boolean;
}

const SinglePublication: FC<SinglePublicationProps> = ({
  publication,
  feedItem,
  showType = true,
  showActions = true,
  showModActions = false,
  showThread = true
}) => {
  const { push } = useRouter();
  const [tippingEnabled, setTippingEnabled] = useState(false);
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem ? (firstComment ? firstComment : feedItem?.root) : publication;

  return (
    <article
      className="cursor-pointer p-5 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          push(`/posts/${rootPublication?.id}`);
        }
      }}
      data-testid={`publication-${publication.id}`}
      aria-hidden="true"
    >
      {feedItem ? (
        <ActionType feedItem={feedItem} />
      ) : (
        <PublicationType publication={publication} showType={showType} showThread={showThread} />
      )}
      <PublicationHeader publication={rootPublication} feedItem={feedItem} />
      <div className="ml-[53px]">
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <>
            <PublicationBody publication={rootPublication} setTippingEnabled={setTippingEnabled} />
            {showActions && (
              <PublicationActions
                publication={rootPublication}
                electedMirror={feedItem?.electedMirror as ElectedMirror}
                tippingEnabled={tippingEnabled}
              />
            )}
            {showModActions && <ModAction publication={rootPublication} className="mt-3 max-w-md" />}
          </>
        )}
      </div>
    </article>
  );
};

export default SinglePublication;
