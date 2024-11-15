import { useChainId, useChains } from "wagmi";
import type { L1Chain } from "../wagmi";

export const useSourceChainId = () => {
  const chainId = useChainId();
  const chains = useChains();

  const currentChain = chains.find((c) => c.id === chainId)!;
  const sourceChain = currentChain?.sourceId
    ? chains.find((c) => c.id === currentChain.sourceId)!
    : currentChain;

  return sourceChain.id as L1Chain["id"];
};
