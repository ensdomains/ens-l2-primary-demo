import { type QueryFunctionContext, useQuery } from "@tanstack/react-query"
import {
  encodeFunctionData,
  getChparseAbi,
  ainContractAddress,
  namehash,
  type Address,
  getChainContractAddress,
  parseAbi,
  decodeFunctionResult,
} from "viem"
import { prepareQueryOptions } from "../query/prepareQueryOptions"
import type { ConfigWithEns, CreateQueryKey, QueryConfig } from "../query/query"
import { useQueryOptions } from "./useQueryOptions"
import {
  getOwner,
  GetOwnerReturnType,
  getRecords,
} from "@ensdomains/ensjs/public"
import { base, ethereum, l2Chains } from "../chains2"
import { EMPTY_ADDRESS, normalise } from "@ensdomains/ensjs/utils"
import { match, P } from "ts-pattern"
import { readContract } from "viem/actions"
import {
  publicResolverMultiAddrSnippet,
  publicResolverSingleAddrSnippet,
  universalResolverResolveArraySnippet,
} from "@ensdomains/ensjs/contracts"
import { dnsEncodeName } from "../utils/name"
import { baseSepolia } from "viem/chains"
import { chains } from "../chains2"
import { decodeFunctionResult } from 'viem';

type GetNameDataParameters = {
  name: string
}

export type NameData = {
  name: string
  ownership: GetOwnerReturnType | null
  coins: {
    id: number
    value: Address
  }[]
  resolverAddress: Address
}

type GetNameDetailsReturnType = NameData | null

type UseNameDetailsParameters = GetNameDataParameters

export type UseNameDetailsReturnType = GetNameDetailsReturnType

type UseNameDataConfig = QueryConfig<
  UseNameDetailsReturnType,
  Error,
  UseNameDetailsReturnType,
  QueryKey<UseNameDetailsParameters>
>

type QueryKey<TParams extends UseNameDetailsParameters> = CreateQueryKey<
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
  async <TParams extends UseNameDetailsParameters>({
    queryKey: [{ name: name__, ...params }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    const chainId = ethereum.id
    const client = config.getClient({ chainId })

    const name = normalise(name__)
    const ownership = await getOwner(client, { name: name })
    console.log("ownership", name, ownership)
    if (
      !ownership ||
      ownership.owner === EMPTY_ADDRESS ||
      ownership.registrant === EMPTY_ADDRESS
    )
      return null

 
    const calls = chains.map((chain) => chain.coinType === 60 ? encodeFunctionData({
      abi: ADDR_ABI,
      functionName: "addr",
      args: [namehash(name)],
    }) : encodeFunctionData({
      abi: PROFILE_ABI,
      functionName: "addr",
      args: [namehash(name), BigInt(chain.coinType)],
    }))

    const calls2 = [
      encodeFunctionData({
        abi: ADDR_ABI,
        functionName: "addr",
        args: [namehash(name)],
      }),
      ...l2Chains.map((chain) => encodeFunctionData({
        abi: PROFILE_ABI,
        functionName: "addr",
        args: [namehash(name), BigInt(chain.coinType)],
      })),
    ]

    const encodedMulticallResults = await readContract(client, {
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

    console.log('encodedMulticallResults', encodedMulticallResults)

    const decodedMulticallResult = decodeFunctionResult({
      abi: RESOLVE_MULTICALL,
      functionName: "multicall",
      data: encodedMulticallResults[0],
    })

    console.log('decodedMulticallResult', decodedMulticallResult)

    const encodedAddrResults = decodedMulticallResult[0]
    const resolverAddress = encodedMulticallResults[1]

console.log('encodedAddrResults', encodedAddrResults)
    const coins = chains.map((chain, i) => chain.coinType === 60 ? {
      id: chain.id, 
      value: decodeFunctionResult({
      abi: ADDR_ABI,
      functionName: "addr",
      data: decodedMulticallResult[i],
    })} : {
      id: chain.id,
      value: decodeFunctionResult({
      abi: PROFILE_ABI,
      functionName: "addr",
      data: decodedMulticallResult[i],
    })})

    return {
      name,
      ownership,
      coins,
      resolverAddress,
    }
  }

export const useNameData = <TParams extends UseNameDetailsParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  name: name__,
  ...params
}: TParams & UseNameDataConfig) => {
  const name = match(name__)
    .with(
      P.when((name) => !!name === false),
      () => "",
    )
    .with(
      P.when((name) => name.indexOf(".") === -1),
      (name) => `${name}.eth`,
    )
    .otherwise((name) => name)

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
    staleTime,
    enabled: enabled && name.length > 4,
  })

  return useQuery(preparedOptions)
}
