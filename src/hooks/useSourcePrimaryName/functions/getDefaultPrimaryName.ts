import { parseAbi } from "viem"
import { readContract } from "viem/actions"
import type { UseSourcePrimaryNameFn } from "../useSourcePrimaryName"
import { ethereum } from "@/constants/chains"
import { getChainContractAddress } from "viem"

const standaloneReverseRegistrarAbi = parseAbi([
  "function nameForAddr(address addr) external view returns (string)",
])

export const getDefaultPrimaryNameSource: UseSourcePrimaryNameFn =
  (config) => async (params) => {
    try {
      const {
        queryKey: [{ address }],
      } = params
      if (!address) throw new Error("address is required")
      const client = config.getClient({ chainId: ethereum.id })

      const name = await readContract(client, {
        address: getChainContractAddress({
          chain: ethereum,
          contract: "ensDefaultReverseRegistrar",
        }),
        abi: standaloneReverseRegistrarAbi,
        functionName: "nameForAddr",
        args: [address],
      })
      return name
    } catch (error) {
      console.error(error)
      return null
    }
  }
