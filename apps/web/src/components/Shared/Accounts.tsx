import type { Profile } from "@hey/lens";
import type { FC, ReactNode } from "react";
import FallbackAccountName from "./FallbackAccountName";

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

  const accountOne = profiles[0];
  const accountTwo = profiles[1];
  const accountThree = profiles[2];

  if (profiles.length === 1) {
    return (
      <Wrapper>
        <FallbackAccountName account={accountOne} />
      </Wrapper>
    );
  }

  const andSep = " and ";

  if (profiles.length === 2) {
    return (
      <Wrapper>
        <FallbackAccountName account={accountOne} separator={andSep} />
        <FallbackAccountName account={accountTwo} />
      </Wrapper>
    );
  }

  if (profiles.length >= 3) {
    const additionalCount = profiles.length - 3;

    return (
      <Wrapper>
        <FallbackAccountName account={accountOne} separator=", " />
        <FallbackAccountName
          account={accountTwo}
          separator={additionalCount === 0 ? andSep : ", "}
        />
        <FallbackAccountName
          account={accountThree}
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
