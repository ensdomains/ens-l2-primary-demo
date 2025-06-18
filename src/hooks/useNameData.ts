import { type QueryFunctionContext, useQuery } from "@tanstack/react-query"
import {
  encodeFunctionData,
  namehash,
  type Address,
  getChainContractAddress,
  parseAbi,
  decodeFunctionResult,
} from "viem"
import { prepareQueryOptions } from "../query/prepareQueryOptions"
import type { ConfigWithEns, CreateQueryKey, QueryConfig } from "../query/query"
import { useQueryOptions } from "./useQueryOptions"
import { getOwner, GetOwnerReturnType } from "@ensdomains/ensjs/public"
import { ethereum } from "../constants/chains"
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { readContract } from "viem/actions"
import { dnsEncodeName } from "../utils/name"
import { chains } from "../constants/chains"
import { ClientWithEns } from "@ensdomains/ensjs/contracts"
import { normalizeAddress } from "@/utils/address"

export type NameData = {
  name: string
  ownership: NonNullable<GetOwnerReturnType>
  coins: {
    id: number
    coinType: number
    value: Address
  }[]
  resolverAddress: Address
}

type GetNameDataParameters = {
  name?: string
}

type GetNameDataReturnType = NameData | null

type UseNameDataParameters = GetNameDataParameters

export type UseNameDataReturnType = GetNameDataReturnType

type UseNameDataConfig = QueryConfig<
  UseNameDataReturnType,
  Error,
  UseNameDataReturnType,
  QueryKey<UseNameDataParameters>
>

type QueryKey<TParams extends UseNameDataParameters> = CreateQueryKey<
  TParams,
  "getNameData",
  "standard"
>

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

export const getNameDataQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseNameDataParameters>({
    queryKey: [{ name, ...params }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) return null

    const chainId = ethereum.id
    const client = config.getClient({ chainId }) as unknown as ClientWithEns

    const ownership = await getOwner(client, { name: name })
    if (
      !ownership ||
      ownership.owner === EMPTY_ADDRESS ||
      ownership.registrant === EMPTY_ADDRESS
    )
      return null

    const calls = chains.map((chain) =>
      chain.coinType === 60
        ? encodeFunctionData({
            abi: ADDR_ABI,
            functionName: "addr",
            args: [namehash(name)],
          })
        : encodeFunctionData({
            abi: PROFILE_ABI,
            functionName: "addr",
            args: [namehash(name), BigInt(chain.coinType)],
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
        dnsEncodeName(name),
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
      name,
      ownership,
      coins,
      resolverAddress,
    } as NameData
  }

export const useNameData = <TParams extends UseNameDataParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  name,
  ...params
}: TParams & UseNameDataConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params, name },
    scopeKey,
    functionName: "getNameData",
    queryDependencyType: "standard",
    queryFn: getNameDataQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    gcTime,
    enabled: enabled && !!name,
  })

  return useQuery(preparedOptions)
}
