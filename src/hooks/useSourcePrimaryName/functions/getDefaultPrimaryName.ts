import { parseAbi } from "viem";
import { readContract } from "viem/actions";
import type { UseSourcePrimaryNameFn } from "../useSourcePrimaryName";
import { ethereum } from "@/constants/chains";

const standaloneReverseRegistrarAbi = parseAbi([
  "function nameForAddr(address addr) external view returns (string)",
]);

export const getDefaultPrimaryNameSource: UseSourcePrimaryNameFn = (config) => async(params) => {
  const { queryKey: [{ address}]} = params
  if (!address) throw new Error("address is required");
  const client = config.getClient({ chainId: ethereum.id})

  return readContract(client, {
    address: '0x4F382928805ba0e23B30cFB75fC9E848e82DFD47',
    abi: standaloneReverseRegistrarAbi,
    functionName: "nameForAddr",
    args: [address],
  });
}