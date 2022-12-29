import UserProfile from '@components/Shared/UserProfile';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import type { LensterPublication } from '@generated/types';
import { Analytics } from '@lib/analytics';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import PublicationMenu from './Actions/Menu';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import Source from './Source';

interface Props {
  publication: LensterPublication;
}

const ThreadBody: FC<Props> = ({ publication }) => {
  const { push } = useRouter();
  const { allowed: staffMode } = useStaffMode();
  const isMirror = publication.__typename === 'Mirror';
  const profile = isMirror ? publication?.mirrorOf?.profile : publication?.profile;
  const timestamp = isMirror ? publication?.mirrorOf?.createdAt : publication?.createdAt;

  return (
    <article>
      <div className="flex justify-between space-x-1.5">
        <span onClick={(event) => event.stopPropagation()}>
          <UserProfile
            profile={profile ?? publication?.collectedBy?.defaultProfile}
            timestamp={timestamp}
            showStatus
          />
        </span>
        <div className="flex items-center space-x-1">
          {staffMode && <Source publication={publication} />}
          <PublicationMenu publication={publication} />
        </div>
      </div>
      <div className="flex">
        <div className="mr-8 ml-5 bg-gray-300 border-gray-300 dark:bg-gray-700 dark:border-gray-700 border-[0.8px] -my-[3px]" />
        <div
          className="pt-4 pb-5 !w-[85%] sm:w-full"
          onClick={() => {
            const selection = window.getSelection();
            if (!selection || selection.toString().length === 0) {
              Analytics.track(PUBLICATION.OPEN);
              push(`/posts/${publication?.id}`);
            }
          }}
        >
          {publication?.hidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <PublicationActions publication={publication} />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default ThreadBody;
