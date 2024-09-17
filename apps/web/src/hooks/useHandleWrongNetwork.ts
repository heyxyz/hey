import { CHAIN } from "src/constants";
import { useConnections, useSwitchChain } from "wagmi";

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections();
  const { switchChainAsync } = useSwitchChain();

  const handleWrongNetwork = async () => {
    if (!activeConnection[0]) {
      return;
    }

    if (activeConnection[0]?.chainId !== CHAIN.id) {
      return await switchChainAsync({ chainId: CHAIN.id });
    }

    return;
  };

  return handleWrongNetwork;
};

export default useHandleWrongNetwork;
