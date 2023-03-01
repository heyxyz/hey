import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import useLoginFlow from '@components/utils/hooks/useLoginFlow';
import { StarIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { Profile } from 'lens';
import dynamic from 'next/dynamic';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message={t`Loading super follow`} />
});

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
  again?: boolean;
}

const SuperFollow: FC<Props> = ({ profile, setFollowing, showText = false, again = false }) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { showLoginFlow } = useLoginFlow();

  return (
    <>
      <Button
        className="!px-3 !py-1.5 text-sm"
        variant="super"
        outline
        onClick={() => {
          if (!currentProfile) {
            showLoginFlow();
            return;
          }
          setShowFollowModal(!showFollowModal);
          Mixpanel.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        aria-label="Super Follow"
        icon={<StarIcon className="h-4 w-4" />}
      >
        {showText && t`Super follow`}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={formatHandle(profile?.handle)} prefix="@" /> {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="h-5 w-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(false)}
      >
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
          again={again}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
