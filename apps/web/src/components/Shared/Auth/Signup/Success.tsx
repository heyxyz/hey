import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { useSwitchAccountMutation } from "@hey/indexer";
import { Button, H4, Spinner } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "src/store/persisted/useAuthStore";
import { useSignupStore } from ".";

const Success: FC = () => {
  const { reload } = useRouter();
  const { accountAddress, onboardingToken } = useSignupStore();
  const [isLoading, setIsLoading] = useState(false);

  const [switchAccount] = useSwitchAccountMutation();

  const handleSign = async () => {
    try {
      setIsLoading(true);

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

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>Waaa-hey! You got your profile!</H4>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        Welcome to decentralised social where everything is sooooooooooooo much
        better! 🎉
      </div>
      <img
        alt="Dizzy emoji"
        className="mx-auto mt-8 size-14"
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
      />
      <Button
        className="mt-5"
        disabled={isLoading}
        icon={
          isLoading ? (
            <Spinner className="mr-0.5" size="xs" />
          ) : (
            <img
              alt="Lens Logo"
              className="h-3"
              height={12}
              src="/lens.svg"
              width={19}
            />
          )
        }
        onClick={handleSign}
      >
        Sign in with Lens
      </Button>
    </div>
  );
};

export default Success;
