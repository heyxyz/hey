import { useAccountQuery } from "@hey/indexer";
import { H4, Spinner } from "@hey/ui";
import type { FC } from "react";
import { useSignupStore } from ".";

const Minting: FC = () => {
  const { choosedHandle, setAccountAddress, setScreen, transactionHash } =
    useSignupStore();

  useAccountQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.account) {
        setAccountAddress(data.account.address);
        setScreen("success");
      }
    },
    pollInterval: 3000,
    skip: !transactionHash,
    variables: { request: { username: { localName: choosedHandle } } }
  });

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>We are preparing your account!</H4>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
    </div>
  );
};

export default Minting;
