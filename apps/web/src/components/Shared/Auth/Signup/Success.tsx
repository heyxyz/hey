import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { useSwitchAccountMutation } from "@hey/indexer";
import { H4 } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { signIn } from "src/store/persisted/useAuthStore";
import { useSignupStore } from ".";

const Success: FC = () => {
  const { reload } = useRouter();
  const { accountAddress, onboardingToken } = useSignupStore();
  const [switchAccount] = useSwitchAccountMutation();

  const handleAuth = async () => {
    try {
      const auth = await switchAccount({
        context: { headers: { "X-Access-Token": onboardingToken } },
        variables: { request: { account: accountAddress } }
      });

      if (auth.data?.switchAccount.__typename === "AuthenticationTokens") {
        const accessToken = auth.data?.switchAccount.accessToken;
        const refreshToken = auth.data?.switchAccount.refreshToken;
        const idToken = auth.data?.switchAccount.idToken;
        signIn({ accessToken, idToken, refreshToken });
        return reload();
      }

      return toast.error(Errors.SomethingWentWrong);
    } catch {}
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>Waaa-hey! You got your account!</H4>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        Welcome to decentralised social where everything is sooooooooooooo much
        better! 🎉
      </div>
      <img
        alt="Dizzy emoji"
        className="mx-auto mt-8 size-14"
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
      />
      <i className="ld-text-gray-500 mt-8">
        We are taking you to {APP_NAME}...
      </i>
    </div>
  );
};

export default Success;
