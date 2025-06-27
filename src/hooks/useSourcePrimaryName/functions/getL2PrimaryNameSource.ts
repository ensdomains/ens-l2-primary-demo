import { getChainContractAddress, parseAbi } from "viem"
import { readContract } from "viem/actions"
import { UseSourcePrimaryNameFn } from "../useSourcePrimaryName"

const standaloneReverseRegistrarAbi = parseAbi([
  "function nameForAddr(address addr) external view returns (string)",
]);

type GetL2PrimaryNameFn = (chainId: number) => UseSourcePrimaryNameFn

export const getL2PrimaryNameSource: GetL2PrimaryNameFn = (chainId) => 
  (config) =>
  async ({ queryKey: [{ address }] }) => {
    if (!address) throw new Error("address is required")

    const currentChain = config.chains.find((c) => c.id === chainId)
    if (!currentChain) throw new Error("chain not found")

    console.warn("DIRECT QUERY L2", currentChain.name)
    const registrarAddress = getChainContractAddress({
      chain: currentChain,
      contract: "l2ReverseRegistrar",
    })
    console.warn("UsePrimaryName: registrar address", registrarAddress)
    const client = config.getClient({ chainId: currentChain.id })
    return readContract(client, {
      address: registrarAddress,
      abi: standaloneReverseRegistrarAbi,
      functionName: "nameForAddr",
      args: [address],
    })
  }
