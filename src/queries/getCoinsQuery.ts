import { queryOptions } from "@tanstack/react-query"
import { ClientWithEns } from "@ensdomains/ensjs/contracts"
import { ConfigWithEns } from "@/query/query"
import { chains, ethereum } from "@/constants/chains"
import { dnsEncodeName } from "@/utils/name"
import { normalizeAddress } from "@/utils/address"

import {
  encodeFunctionData,
  namehash,
  type Address,
  getChainContractAddress,
  parseAbi,
  decodeFunctionResult,
} from "viem"
import { readContract } from "viem/actions"

const resolveAbi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

const RESOLVE_MULTICALL = parseAbi([
  "function multicall(bytes[] calls) external view returns (bytes[])",
])

const ADDR_ABI = parseAbi([
  "function addr(bytes32) external view returns (address)",
])

const PROFILE_ABI = parseAbi([
  "function addr(bytes32, uint256 coinType) external view returns (bytes)",
  "function text(bytes32, string key) external view returns (string)",
  "function name(bytes32) external view returns (string)",
])

export const getCoinsQueryKey = (name?: string) => ["getCoins", name]

export const getCoinsQuery = (
  config: ConfigWithEns,
  { name, enabled = true }: { name?: string; enabled?: boolean },
) => {
  return queryOptions({
    queryKey: getCoinsQueryKey(name),
    queryFn: async ({ queryKey: [, _name] }) => {
      if (!_name) return null
      const client = config.getClient({ chainId: ethereum.id }) as unknown as ClientWithEns
      const calls = chains.map((chain) =>
        chain.coinType === 60
          ? encodeFunctionData({
              abi: ADDR_ABI,
              functionName: "addr",
              args: [namehash(_name)],
            })
          : encodeFunctionData({
              abi: PROFILE_ABI,
              functionName: "addr",
              args: [namehash(_name), BigInt(chain.coinType)],
            }),
      )
  
      const resp = await readContract(client, {
        address: getChainContractAddress({
          chain: ethereum,
          contract: "ensUniversalResolver",
        }),
        abi: resolveAbi,
        functionName: "resolve",
        args: [
          dnsEncodeName(_name),
          encodeFunctionData({
            abi: RESOLVE_MULTICALL,
            functionName: "multicall",
            args: [calls],
          }),
        ],
      })
      const [encodedMulticallResults, resolverAddress] = resp as [
        `0x${string}`,
        Address,
      ]
  
      const decodedMulticallResult = decodeFunctionResult({
        abi: RESOLVE_MULTICALL,
        functionName: "multicall",
        data: encodedMulticallResults,
      })
  
      const coins = chains.map((chain, i) =>
        chain.coinType === 60
          ? {
              id: chain.id,
              coinType: chain.coinType,
              value: normalizeAddress(
                decodeFunctionResult({
                  abi: ADDR_ABI,
                  functionName: "addr",
                  data: decodedMulticallResult[i],
                }),
              ),
            }
          : {
              id: chain.id,
              coinType: chain.coinType,
              value: normalizeAddress(
                decodeFunctionResult({
                  abi: PROFILE_ABI,
                  functionName: "addr",
                  data: decodedMulticallResult[i],
                }),
              ),
            },
      )
      return {
        name: _name,
        resolverAddress,
        coins,
      }
    },
    enabled: !!name && enabled,
  })
}
