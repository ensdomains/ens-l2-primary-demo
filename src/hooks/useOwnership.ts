import { type QueryFunctionContext, useQuery } from "@tanstack/react-query"
import { encodeFunctionData, namehash, type Address, getChainContractAddress, parseAbi, decodeFunctionResult } from "viem"
import { prepareQueryOptions } from "../query/prepareQueryOptions"
import type { ConfigWithEns, CreateQueryKey, QueryConfig } from "../query/query"
import { useQueryOptions } from "./useQueryOptions"
import {
  getOwner,
  GetOwnerReturnType,
  getRecords,
} from "@ensdomains/ensjs/public"
import { base, ethereum } from "../chains2"
import { EMPTY_ADDRESS, normalise } from "@ensdomains/ensjs/utils"
import { match, P } from "ts-pattern"
import { readContract } from "viem/actions"
import { ClientWithEns, publicResolverMultiAddrSnippet, publicResolverSingleAddrSnippet, universalResolverResolveArraySnippet } from "@ensdomains/ensjs/contracts"
import { dnsEncodeName } from "../utils/name"
import { baseSepolia } from "viem/chains"

type GetNameDataParameters = {
  name: string
}

export type NameData = {
  name: string
  ownership: GetOwnerReturnType | null
  coins: {
    id: number
    value: Address
  }[],
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


export const getOwnershipQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseNameDetailsParameters>({
    queryKey: [{ name: name__, ...params }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {

    const chainId = ethereum.id
    const client = config.getClient({ chainId })

    const ownership = await getOwner(client, { name: name })
    if (
      !ownership ||
      ownership.owner === EMPTY_ADDRESS ||
      ownership.registrant === EMPTY_ADDRESS
    )
      return null


    return {
      name,
      ownership,
      coins,
      resolverAddress: records.resolverAddress,
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
    .with(P.when((name) => !!name === false), () => '')
    .with(P.when((name) => name.indexOf(".") === -1), (name) => `${name}.eth`)
    .otherwise((name) => name)

  const initialOptions = useQueryOptions({
    params: { ...params, name },
    scopeKey,
    functionName: "getNameData",
    queryDependencyType: "standard",
    queryFn: getOwnership,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    gcTime,
    staleTime,
    enabled: enabled &&name.length > 4,
  })

  return useQuery(preparedOptions)
}
