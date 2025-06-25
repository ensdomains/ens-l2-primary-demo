import { getChainContractAddress, parseAbi } from "viem";
import { readContract } from "viem/actions";
import { getReverseNamespace } from "../../../utils/name";
import { namehash } from "viem";
import type { UseSourcePrimaryNameFn } from "../useSourcePrimaryName";
import { ethereum } from "@/constants/chains";

const ensRegistryAbi = parseAbi([
  "function resolver(bytes32 node) external view returns (address)",
]);

const standaloneReverseRegistrarAbi = parseAbi([
  "function nameForAddr(address addr) external view returns (string)",
]);

export const getDefaultPrimaryNameSource: UseSourcePrimaryNameFn = (config) => async(params) => {
  const { queryKey: [{ address}]} = params
  if (!address) throw new Error("address is required");
  const client = config.getClient({ chainId: ethereum.id})
  const currentChain = config.chains.find((c) => c.id === ethereum.id);
  if (!currentChain) throw new Error("chain not found");
  const defaultRegistrarAddress = await readContract(client, {
    address: getChainContractAddress({
      chain: currentChain,
      contract: "ensRegistry",
    }),
    abi: ensRegistryAbi,
    functionName: "resolver",
    args: [namehash(getReverseNamespace({ ns: 'default' }))],
  });

  return readContract(client, {
    address: defaultRegistrarAddress,
    abi: standaloneReverseRegistrarAbi,
    functionName: "nameForAddr",
    args: [address],
  });
}