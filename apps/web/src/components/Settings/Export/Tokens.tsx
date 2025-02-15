import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { useAuthenticateMutation, useChallengeMutation } from "@hey/indexer";
import { Button, Card, CardHeader, H6 } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";
import { useAccount, useSignMessage } from "wagmi";

const Tokens: FC = () => {
  const { accessToken, idToken, refreshToken } = hydrateAuthTokens();
  const [builderToken, setBuilderToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signMessageAsync } = useSignMessage({ mutation: { onError } });
  const [loadChallenge] = useChallengeMutation();
  const [authenticate] = useAuthenticateMutation();

  const handleGenerateBuilderToken = async () => {
    try {
      setIsLoading(true);
      await handleWrongNetwork();

      const challenge = await loadChallenge({
        variables: { request: { builder: { address } } }
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

      if (auth.data?.authenticate.__typename === "AuthenticationTokens") {
        setBuilderToken(auth.data?.authenticate.accessToken);
      }
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Your temporary access token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
          onClick={() => {
            toast.success("Copied to clipboard");
            navigator.clipboard.writeText(accessToken as string);
          }}
          type="button"
        >
          <H6>{accessToken}</H6>
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary refresh token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
          onClick={() => {
            toast.success("Copied to clipboard");
            navigator.clipboard.writeText(refreshToken as string);
          }}
          type="button"
        >
          <H6>{refreshToken}</H6>
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary id token" />
        <button
          className="m-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
          type="button"
          onClick={() => {
            toast.success("Copied to clipboard");
            navigator.clipboard.writeText(idToken as string);
          }}
        >
          <H6>{idToken}</H6>
        </button>
      </Card>
      <Card>
        <CardHeader title="Your temporary builder token" />
        <div className="m-5">
          <Button onClick={handleGenerateBuilderToken} disabled={isLoading}>
            Generate builder token
          </Button>
          {builderToken && (
            <button
              className="mt-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
              type="button"
              onClick={() => {
                toast.success("Copied to clipboard");
                navigator.clipboard.writeText(builderToken as string);
              }}
            >
              <H6>{builderToken}</H6>
            </button>
          )}
        </div>
      </Card>
    </>
  );
};

export default Tokens;
