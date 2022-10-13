import UserProfile from '@components/Shared/UserProfile';
import type { LensterPublication } from '@generated/lenstertypes';
import { Leafwatch } from '@lib/leafwatch';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationType from './Type';

dayjs.extend(relativeTime);

interface Props {
  publication: LensterPublication;
  showType?: boolean;
  showActions?: boolean;
  showModActions?: boolean;
  showThread?: boolean;
}

const SinglePublication: FC<Props> = ({
  publication,
  showType = true,
  showActions = true,
  showModActions = false,
  showThread = true
}) => {
  const { push } = useRouter();
  const isMirror = publication.__typename === 'Mirror';
  const profile = isMirror ? publication?.mirrorOf?.profile : publication?.profile;
  const timestamp = isMirror ? publication?.mirrorOf?.createdAt : publication?.createdAt;

  return (
    <article className="p-5">
      <PublicationType publication={publication} showType={showType} showThread={showThread} />
      <div className="flex justify-between pb-4 space-x-1.5">
        <span onClick={(event) => event.stopPropagation()}>
          <UserProfile profile={profile ?? publication?.collectedBy?.defaultProfile} />
        </span>
        <span className="text-xs text-gray-500">{dayjs(new Date(timestamp)).fromNow()}</span>
      </div>
      <div
        className="ml-[53px]"
        onClick={() => {
          push(`/posts/${publication?.id}`);
          Leafwatch.track(PUBLICATION.OPEN);
        }}
      >
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <>
            <PublicationBody publication={publication} />
            {showActions && <PublicationActions publication={publication} />}
            {showModActions && <ModAction publication={publication} />}
          </>
        )}
      </div>
    </article>
  );
};

export default SinglePublication;
