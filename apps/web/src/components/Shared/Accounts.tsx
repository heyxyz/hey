import FallbackProfileName from "@components/Shared/FallbackProfileName";
import type { Profile } from "@hey/lens";
import type { FC, ReactNode } from "react";

interface AccountsProps {
  context?: string;
  profiles: Profile[];
}

const Accounts: FC<AccountsProps> = ({ context, profiles }) => {
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <>
      {children}
      {context && <span> {context}</span>}
    </>
  );

  const profileOne = profiles[0];
  const profileTwo = profiles[1];
  const profileThree = profiles[2];

  if (profiles.length === 1) {
    return (
      <Wrapper>
        <FallbackProfileName profile={profileOne} />
      </Wrapper>
    );
  }

  const andSep = " and ";

  if (profiles.length === 2) {
    return (
      <Wrapper>
        <FallbackProfileName profile={profileOne} separator={andSep} />
        <FallbackProfileName profile={profileTwo} />
      </Wrapper>
    );
  }

  if (profiles.length >= 3) {
    const additionalCount = profiles.length - 3;

    return (
      <Wrapper>
        <FallbackProfileName profile={profileOne} separator=", " />
        <FallbackProfileName
          profile={profileTwo}
          separator={additionalCount === 0 ? andSep : ", "}
        />
        <FallbackProfileName
          profile={profileThree}
          separator={
            additionalCount > 0 && (
              <span className="whitespace-nowrap">
                {andSep}
                {additionalCount} {additionalCount === 1 ? "other" : "others"}
              </span>
            )
          }
        />
      </Wrapper>
    );
  }

  return null;
};

export default Accounts;