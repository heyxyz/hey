import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import type { Profile } from '@hey/lens';
import { Spinner, Toggle } from '@hey/ui';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const Wrapper = ({
  children,
  title
}: {
  children: ReactNode;
  title: ReactNode;
}) => (
  <span className="flex items-center space-x-2 text-sm">
    <span>{children}</span>
    <span>{title}</span>
  </span>
);

enum Type {
  VERIFIED = 'VERIFIED',
  STAFF = 'STAFF',
  GARDENER = 'GARDENER',
  TUSTED_MEMBER = 'TUSTED_MEMBER'
}

type AccessType = keyof typeof Type;

interface RankProps {
  profile: Profile;
}

const Access: FC<RankProps> = ({ profile }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isGardener, setIsGardener] = useState(false);
  const [isLensMember, setIsLensMember] = useState(false);

  const getPreferences = async () => {
    try {
      const response = await axios.get(
        `${PREFERENCES_WORKER_URL}/get/${profile.id}`
      );
      const { data } = response;

      setIsVerified(data.result?.is_verified || false);
      setIsStaff(data.result?.is_staff || false);
      setIsGardener(data.result?.is_gardener || false);
      setIsLensMember(data.result?.is_lens_member || false);

      return data.success;
    } catch (error) {
      return false;
    }
  };

  const { data: preferences } = useQuery(
    ['preferences', profile.id],
    () => getPreferences().then((res) => res),
    { enabled: Boolean(profile.id) }
  );

  const staffUpdatePreferences = async (type: AccessType) => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/update`,
        {
          id: profile.id,
          ...(type === Type.VERIFIED && { isVerified: !isVerified }),
          ...(type === Type.STAFF && { isStaff: !isStaff }),
          ...(type === Type.GARDENER && { isGardener: !isGardener }),
          ...(type === Type.TUSTED_MEMBER && {
            isLensMember: !isLensMember
          }),
          updateByAdmin: true
        },
        {
          headers: {
            'X-Access-Token': localStorage.getItem(Localstorage.AccessToken)
          }
        }
      ),
      {
        loading: t`Updating access...`,
        success: () => {
          if (type === Type.VERIFIED) {
            setIsVerified(!isVerified);
          } else if (type === Type.STAFF) {
            setIsStaff(!isStaff);
          } else if (type === Type.GARDENER) {
            setIsGardener(!isGardener);
          } else if (type === Type.TUSTED_MEMBER) {
            setIsLensMember(!isLensMember);
          }

          return t`Access updated`;
        },
        error: t`Error updating access`
      }
    );
  };

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <div className="text-lg font-bold">
          <Trans>Access</Trans>
        </div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        {preferences ? (
          <Wrapper title={<Trans>Verified member</Trans>}>
            <Toggle
              setOn={() => staffUpdatePreferences(Type.VERIFIED)}
              on={isVerified}
            />
          </Wrapper>
        ) : (
          <Wrapper title={<Trans>Verified member</Trans>}>
            <Spinner size="xs" />
          </Wrapper>
        )}
        {preferences ? (
          <Wrapper title={<Trans>Staff member</Trans>}>
            <Toggle
              setOn={() => staffUpdatePreferences(Type.STAFF)}
              on={isStaff}
            />
          </Wrapper>
        ) : (
          <Wrapper title={<Trans>Staff member</Trans>}>
            <Spinner size="xs" />
          </Wrapper>
        )}
        {preferences ? (
          <Wrapper title={<Trans>Gardener member</Trans>}>
            <Toggle
              setOn={() => staffUpdatePreferences(Type.GARDENER)}
              on={isGardener}
            />
          </Wrapper>
        ) : (
          <Wrapper title={<Trans>Gardener member</Trans>}>
            <Spinner size="xs" />
          </Wrapper>
        )}
        {preferences ? (
          <Wrapper title={<Trans>Lens Team member</Trans>}>
            <Toggle
              setOn={() => staffUpdatePreferences(Type.TUSTED_MEMBER)}
              on={isLensMember}
            />
          </Wrapper>
        ) : (
          <Wrapper title={<Trans>Trusted member</Trans>}>
            <Spinner size="xs" />
          </Wrapper>
        )}
      </div>
    </>
  );
};

export default Access;
