import { getChainContractAddress, parseAbi } from "viem"
import { readContract } from "viem/actions"
import { getReverseNodeHash } from "../../../utils/name"
import type { UseSourcePrimaryNameFn } from "../useSourcePrimaryName"
import { ethereum } from "@/constants/chains"

const ensRegistryAbi = parseAbi([
  "function resolver(bytes32 node) external view returns (address)",
])

export const getPrimaryNameSource: UseSourcePrimaryNameFn =
  (config) => async (params) => {
    const {
      queryKey: [{ address }],
    } = params
    if (!address) return null

    const client = config.getClient({ chainId: ethereum.id })
    const currentChain = config.chains.find((c) => c.id === ethereum.id)
    if (!currentChain) return null

    const reverseResolver = await readContract(client, {
      address: getChainContractAddress({
        chain: currentChain,
        contract: "ensRegistry",
      }),
      abi: ensRegistryAbi,
      functionName: "resolver",
      args: [getReverseNodeHash(address, { ns: "addr" })],
    })

    // Wrapping in a try catch becase readContract will throw if name does not exist
    try {
      const name = await readContract(client, {
        address: reverseResolver,
        abi: parseAbi([
          "function name(bytes32 node) public view returns (string)",
        ]),
        functionName: "name",
        args: [getReverseNodeHash(address, { ns: "addr" })],
      })
      return name
    } catch {
      return null
    }
  }
