import { type QueryFunctionContext, useQuery } from "@tanstack/react-query";
import {
  type Address,
} from "viem";
import { prepareQueryOptions } from "../query/prepareQueryOptions";
import type {
  ConfigWithEns,
  CreateQueryKey,
  QueryConfig,
} from "../query/query";
import { useQueryOptions } from "./useQueryOptions";
import { getOwner, GetOwnerReturnType, getRecords } from "@ensdomains/ensjs/public";
import { coinTypeToEvmChainId, evmChainIdToCoinType } from "@ensdomains/address-encoder/utils";
import { SupportedChain } from "../wagmi";
import { ethereum } from "../chains2";
import { P } from "ts-pattern";
import { match } from "ts-pattern";
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils";

type GetNameDetailsParameters = {
  name: string;
  coinType: number;
};

type NameDetails = {
  name: string
  owner: GetOwnerReturnType | null
  records: {
    coins: {
      id: number,
      name: string,
      value: Address
    }[]
  }
  chains: Array<SupportedChain & {
    id: number,
    value: Address | null
  }>}

type GetNameDetailsReturnType =  NameDetails | null

type UseNameDetailsParameters = GetNameDetailsParameters;


export type UseNameDetailsReturnType = GetNameDetailsReturnType;

type UseNameDetailsConfig = QueryConfig<
  UseNameDetailsReturnType,
  Error,
  UseNameDetailsReturnType,
  QueryKey<UseNameDetailsParameters>
>;

type QueryKey<TParams extends UseNameDetailsParameters> = CreateQueryKey<
  TParams,
  "getNameDetails",
  "standard"
>;

export const getPrimaryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseNameDetailsParameters>({
    queryKey: [
      {
        name,
        coinType,
      },
    ],
  }: QueryFunctionContext<QueryKey<TParams>>) => {

    const chainId = ethereum.id;
    const client = config.getClient({ chainId })

    const ownership = await getOwner(client, { name: name })
    console.log("owner", ownership)

    if (!ownership || ownership.owner === EMPTY_ADDRESS) return null

    const chains = config.chains
    const records = await getRecords(client, {
      name: name,
      coins: [coinType],
    })
    const coins = chains.map((chain) => ({
      ...chain,
      value: records.coins.find((coin) => coinTypeToEvmChainId(coin.id ) === chain.id)?.value || null
    }))

    return {
      name,
      owner: ownership,
      records,
      chains: coins,
    };
  };

export const useNameDetails = <TParams extends UseNameDetailsParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  name: name__,
  ...params
}: TParams & UseNameDetailsConfig) => {

  const name = match(name__)
    .with(P.nullish, () => '')
    .with(P.when((name) => name.indexOf('.') === -1), (name) => `${name}.eth`)
    .otherwise((name) => name)

  const initialOptions = useQueryOptions({
    params: { ...params, name },
    scopeKey,
    functionName: "getNameDetails",
    queryDependencyType: "standard",
    queryFn: getPrimaryNameQueryFn,
  });

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    gcTime,
    staleTime,
    enabled: enabled && !!name && name.length >= 3,
  });

  const query = useQuery(preparedOptions);

  return query;
};
