import { useGroupQuery } from "@hey/indexer";
import { H4, Spinner } from "@hey/ui";
import type { FC } from "react";
import { useCreateGroupStore } from "./CreateGroup";

const Minting: FC = () => {
  const { setScreen, transactionHash, setGroupAddress } = useCreateGroupStore();

  useGroupQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.group) {
        setGroupAddress(data.group.address);
        setScreen("success");
      }
    },
    pollInterval: 3000,
    skip: !transactionHash,
    variables: { request: { txHash: transactionHash } }
  });

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>We are preparing your group!</H4>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
    </div>
  );
};

export default Minting;
