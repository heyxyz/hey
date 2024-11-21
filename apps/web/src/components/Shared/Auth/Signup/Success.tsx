import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { AUTH } from "@hey/data/tracking";
import { useAuthenticateMutation, useChallengeLazyQuery } from "@hey/lens";
import { Button, H4, Spinner } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "src/store/persisted/useAuthStore";
import { useAccount, useSignMessage } from "wagmi";
import { useSignupStore } from ".";

const Success: FC = () => {
  const { reload } = useRouter();
  const { accountId } = useSignupStore();
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signMessageAsync } = useSignMessage({ mutation: { onError } });

  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: "no-cache"
  });
  const [authenticate] = useAuthenticateMutation();

  const handleSign = async () => {
    try {
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { for: accountId, signedBy: address } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth profile and set cookies
      const auth = await authenticate({
        variables: { request: { id: challenge.data.challenge.id, signature } }
      });
      const accessToken = auth.data?.authenticate.accessToken;
      const refreshToken = auth.data?.authenticate.refreshToken;
      const identityToken = auth.data?.authenticate.identityToken;
      signIn({ accessToken, identityToken, refreshToken });
      Leafwatch.track(AUTH.LOGIN, { accountId: accountId, source: "signup" });
      reload();
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
