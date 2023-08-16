import { AdjustmentsIcon } from '@heroicons/react/solid';
import { ACCESS_WORKER_URL } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import type { Profile } from '@lenster/lens';
import { Spinner, Toggle } from '@lenster/ui';
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
  const [isTrustedMember, setIsTrustedMember] = useState(false);

  const getAccess = async () => {
    try {
      const response = await axios(`${ACCESS_WORKER_URL}/rights/${profile.id}`);
      const { data } = response;

      setIsVerified(data.result?.is_verified || false);
      setIsStaff(data.result?.is_staff || false);
      setIsGardener(data.result?.is_gardener || false);
      setIsTrustedMember(data.result?.is_trusted_member || false);

      return data.success;
    } catch (error) {
      return false;
    }
  };

  const { data: access } = useQuery(
    ['getAccess', profile.id],
    () => getAccess().then((res) => res),
    { enabled: Boolean(profile.id) }
  );

  const updateAccess = async (type: AccessType) => {
    toast.promise(
      axios.post(`${ACCESS_WORKER_URL}/rights`, {
        id: profile.id,
        ...(type === Type.VERIFIED && { isVerified: !isVerified }),
        ...(type === Type.STAFF && { isStaff: !isStaff }),
        ...(type === Type.GARDENER && { isGardener: !isGardener }),
        ...(type === Type.TUSTED_MEMBER && {
          isTrustedMember: !isTrustedMember
        }),
        accessToken: localStorage.getItem(Localstorage.AccessToken)
      }),
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
            setIsTrustedMember(!isTrustedMember);
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
        <AdjustmentsIcon className="h-5 w-5" />
        <div className="text-lg font-bold">
          <Trans>Access</Trans>
        </div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        {access ? (
          <Wrapper title={<Trans>Verified member</Trans>}>
            <Toggle setOn={() => updateAccess(Type.VERIFIED)} on={isVerified} />
          </Wrapper>
        ) : (
          <Wrapper title={<Trans>Verified member</Trans>}>
            <Spinner size="xs" />
          </Wrapper>
        )}
        {access ? (
          <Wrapper title={<Trans>Staff member</Trans>}>
            <Toggle setOn={() => updateAccess(Type.STAFF)} on={isStaff} />
          </Wrapper>
        ) : (
          <Wrapper title={<Trans>Staff member</Trans>}>
            <Spinner size="xs" />
          </Wrapper>
        )}
        {access ? (
          <Wrapper title={<Trans>Gardener member</Trans>}>
            <Toggle setOn={() => updateAccess(Type.GARDENER)} on={isGardener} />
          </Wrapper>
        ) : (
          <Wrapper title={<Trans>Gardener member</Trans>}>
            <Spinner size="xs" />
          </Wrapper>
        )}
        {access ? (
          <Wrapper title={<Trans>Trusted member</Trans>}>
            <Toggle
              setOn={() => updateAccess(Type.TUSTED_MEMBER)}
              on={isTrustedMember}
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
