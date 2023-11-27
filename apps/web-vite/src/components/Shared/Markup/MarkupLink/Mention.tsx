import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { MarkupLinkProps } from '@hey/types/misc';
import { Leafwatch } from '@lib/leafwatch';
import { Link } from 'react-router-dom';
import { type FC } from 'react';

import Slug from '../../Slug';
import UserPreview from '../../UserPreview';

const Mention: FC<MarkupLinkProps> = ({ title, mentions }) => {
  const handle = title?.slice(1);

  if (!handle) {
    return null;
  }

  const fullHandles = mentions?.map(
    (mention) => mention.snapshotHandleMentioned.fullHandle
  );

  if (!fullHandles?.includes(handle)) {
    return title;
  }

  const canShowUserPreview = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.snapshotHandleMentioned.fullHandle === handle
    );

    return foundMention?.snapshotHandleMentioned.linkedTo?.nftTokenId
      ? true
      : false;
  };

  const getLocalNameFromFullHandle = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.snapshotHandleMentioned.fullHandle === handle
    );
    return foundMention?.snapshotHandleMentioned.localName;
  };

  return canShowUserPreview(handle) ? (
    <Link
      to={`/u/${getLocalNameFromFullHandle(handle)}`}
      className="outline-brand-500 outline-offset-2"
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.CLICK_MENTION, {
          handle: getLocalNameFromFullHandle(handle)
        });
      }}
    >
      <UserPreview handle={handle}>
        <Slug
          slug={getLocalNameFromFullHandle(handle)}
          prefix="@"
          useBrandColor
        />
      </UserPreview>
    </Link>
  ) : (
    <Slug slug={getLocalNameFromFullHandle(handle)} prefix="@" useBrandColor />
  );
};

export default Mention;
