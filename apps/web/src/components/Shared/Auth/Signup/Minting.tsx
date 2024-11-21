import { useProfileQuery } from "@hey/lens";
import { H4, Spinner } from "@hey/ui";
import type { FC } from "react";
import { useSignupStore } from ".";

const Minting: FC = () => {
  const { choosedHandle, setAccountId, setScreen, transactionHash } =
    useSignupStore();

  useProfileQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.profile) {
        setAccountId(data.profile.id);
        setScreen("success");
      }
    },
    pollInterval: 3000,
    skip: !transactionHash,
    variables: { request: { forHandle: choosedHandle } }
  });

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>We are preparing your profile!</H4>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
    </div>
  );
};

export default Minting;
