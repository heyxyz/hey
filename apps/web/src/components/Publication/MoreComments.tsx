import ActionType from '@components/Home/Timeline/EventType';
import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type {
  Comment,
  ElectedMirror,
  FeedItem,
  Publication
} from '@lenster/lens';
import clsx from 'clsx';
import type { FC } from 'react';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationType from './Type';

interface MoreCommentsProps {
  comments: Comment[];
}

const MoreComments: FC<MoreCommentsProps> = ({ comments }) => {
  const hasMoreComments = comments.length > 1;

  if (!hasMoreComments) {
    return null;
  }

  return <div>gm</div>;
};

export default MoreComments;
