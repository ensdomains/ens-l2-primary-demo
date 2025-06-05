import { getChainContractAddress, parseAbi } from "viem";
import { readContract } from "viem/actions";
import { getReverseNamespace } from "../../../utils/name";
import { namehash } from "viem";
import type { UsePrimaryNameSourceFn } from "../usePrimaryNameSource";

const ensRegistryAbi = parseAbi([
  "function resolver(bytes32 node) external view returns (address)",
]);

const standaloneReverseRegistrarAbi = parseAbi([
  "function nameForAddr(address addr) external view returns (string)",
]);

type GetL1PrimaryNameSourceFn = (ns: 'addr' | 'default') => UsePrimaryNameSourceFn

export const getL1PrimaryNameSource: GetL1PrimaryNameSourceFn = (ns) => (config) => async({ queryKey: [{ address}, chainId]}) => {
  if (!address) throw new Error("address is required");
  const client = config.getClient({ chainId})
  const currentChain = config.chains.find((c) => c.id === chainId);
  if (!currentChain) throw new Error("chain not found");
  const defaultRegistrarAddress = await readContract(client, {
    address: getChainContractAddress({
      chain: currentChain,
      contract: "ensRegistry",
    }),
    abi: ensRegistryAbi,
    functionName: "resolver",
    args: [namehash(getReverseNamespace({ ns }))],
  });
  return readContract(client, {
    address: defaultRegistrarAddress,
    abi: standaloneReverseRegistrarAbi,
    functionName: "nameForAddr",
    args: [address],
  });
}