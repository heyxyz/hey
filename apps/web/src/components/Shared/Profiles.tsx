import ProfileNameOrHandle from '@components/Shared/ProfileNameOrHandle';
import type { Profile } from '@hey/lens';
import { t } from '@lingui/macro';
import type { FC, ReactNode } from 'react';

interface ProfileCirclesProps {
  profiles: Profile[];
  context?: string;
}

const Profiles: FC<ProfileCirclesProps> = ({ profiles, context }) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <span>
      {children}
      {context ? <span> {context}</span> : null}
    </span>
  );

  const profileOne = profiles[0];
  const profileTwo = profiles[1];
  const profileThree = profiles[2];

  if (profiles?.length === 1) {
    return (
      <Wrapper>
        <ProfileNameOrHandle profile={profileOne} />
      </Wrapper>
    );
  }

  const andSep = () => {
    return ' ' + t`and` + ' ';
  };

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <ProfileNameOrHandle profile={profileOne} separator={andSep()} />
        <ProfileNameOrHandle profile={profileTwo} />
      </Wrapper>
    );
  }

  if (profiles?.length >= 3) {
    const calculatedCount = profiles.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <ProfileNameOrHandle profile={profileOne} separator=", " />
        <ProfileNameOrHandle
          profile={profileTwo}
          separator={isZero ? andSep() : ', '}
        />
        <ProfileNameOrHandle
          profile={profileThree}
          separator={
            !isZero ? (
              <span className="whitespace-nowrap">
                {andSep()}
                {calculatedCount} {calculatedCount === 1 ? t`other` : t`others`}
              </span>
            ) : null
          }
        />
      </Wrapper>
    );
  }

  return null;
};

export default Profiles;
