import { getChainContractAddress, parseAbi } from "viem";
import { readContract } from "viem/actions";
import { getReverseNodeHash } from "../../../utils/name";
import type { UseSourcePrimaryNameFn } from "../useSourcePrimaryName";

const ensRegistryAbi = parseAbi([
  "function resolver(bytes32 node) external view returns (address)",
]);

export const getPrimaryNameSource: UseSourcePrimaryNameFn = (config) => async(params) => {
  const { queryKey: [{ address}, chainId]} = params
  if (!address) throw new Error("address is required");
  const client = config.getClient({ chainId})
  const currentChain = config.chains.find((c) => c.id === chainId);
  if (!currentChain) throw new Error("chain not found");

  const reverseResolver = await readContract(client, {
    address: getChainContractAddress({
      chain: currentChain,
      contract: "ensRegistry",
    }),
    abi: ensRegistryAbi,
    functionName: "resolver",
    args: [getReverseNodeHash(address, { ns: 'addr' })],
  });

  return readContract(client, {
    address: reverseResolver,
    abi: parseAbi(['function name(bytes32 node) public view returns (string)']),
    functionName: "name",
    args: [getReverseNodeHash(address, { ns: 'addr' })],
  })
}