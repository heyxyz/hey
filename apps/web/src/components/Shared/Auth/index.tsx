import Login from "@components/Shared/Auth/Login";
import { APP_NAME } from "@hey/data/constants";
import type { FC } from "react";
import { useState } from "react";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useAccount } from "wagmi";
import AuthMessage from "./AuthMessage";
import Signup from "./Signup";
import { SignupMessage } from "./Signup/ChooseUsername";

const NotConnected = ({ isLogin }: { isLogin?: boolean }) => (
  <AuthMessage
    description="Connect with our wallet provider to access your account."
    title={`${isLogin ? "Login" : "Signup"} to ${APP_NAME}.`}
  />
);

const Auth: FC = () => {
  const { authModalType } = useAuthModalStore();
  const [hasAccounts, setHasAccounts] = useState(true);
  const { isConnected } = useAccount();

  return (
    <div className="m-5">
      {authModalType === "signup" ? (
        <div className="space-y-5">
          {!isConnected && <NotConnected />}
          <Signup />
        </div>
      ) : (
        <div className="space-y-5">
          {isConnected ? (
            hasAccounts ? (
              <AuthMessage
                description={`${APP_NAME} uses this signature to verify that you're the owner of this address.`}
                title="Please sign the message."
              />
            ) : (
              <SignupMessage />
            )
          ) : (
            <NotConnected isLogin />
          )}
          <Login setHasAccounts={setHasAccounts} />
        </div>
      )}
    </div>
  );
};

export default Auth;
