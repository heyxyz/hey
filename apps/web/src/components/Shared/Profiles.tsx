import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import FallbackProfileName from '@components/Shared/FallbackProfileName';

interface ProfileCirclesProps {
  context?: string;
  profiles: Profile[];
}

const Profiles: FC<ProfileCirclesProps> = ({ context, profiles }) => {
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
        <FallbackProfileName profile={profileOne} />
      </Wrapper>
    );
  }

  const andSep = () => {
    return ' ' + 'and' + ' ';
  };

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <FallbackProfileName profile={profileOne} separator={andSep()} />
        <FallbackProfileName profile={profileTwo} />
      </Wrapper>
    );
  }

  if (profiles?.length >= 3) {
    const calculatedCount = profiles.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <FallbackProfileName profile={profileOne} separator=", " />
        <FallbackProfileName
          profile={profileTwo}
          separator={isZero ? andSep() : ', '}
        />
        <FallbackProfileName
          profile={profileThree}
          separator={
            !isZero ? (
              <span className="whitespace-nowrap">
                {andSep()}
                {calculatedCount} {calculatedCount === 1 ? 'other' : 'others'}
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
