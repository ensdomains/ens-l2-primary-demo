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
import { getRecords } from "@ensdomains/ensjs/public";
import { evmChainIdToCoinType } from "@ensdomains/address-encoder/utils";

type GetL2ProfileRecordsParameters = {
  name: string;
};
type GetL2ProfileRecordsReturnType =  { coins: { id: number, name: string, value: Address}[]};

type UseL2ProfileRecordsParameters = GetL2ProfileRecordsParameters;


export type UseL2ProfileRecordsReturnType = GetL2ProfileRecordsReturnType;

type UsePrimaryNameConfig = QueryConfig<
  UseL2ProfileRecordsReturnType,
  Error,
  UseL2ProfileRecordsReturnType,
  QueryKey<UseL2ProfileRecordsParameters>
>;

type QueryKey<TParams extends UseL2ProfileRecordsParameters> = CreateQueryKey<
  TParams,
  "getL2ProfileRecords",
  "standard"
>;

export const getPrimaryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseL2ProfileRecordsParameters>({
    queryKey: [
      {
        name,
        ...params
      },
      chainId_,
    ],
  }: QueryFunctionContext<QueryKey<TParams>>) => {

    const chainId = 11155111;
    const client = config.getClient({ chainId })

    const coins = config.chains.map((c) => evmChainIdToCoinType(c.id))

    const records = await getRecords(client, {
      name: 'davidchu.eth',
      coins,
    })
    return records;
  };

export const useL2ProfileRecords = <TParams extends UseL2ProfileRecordsParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UsePrimaryNameConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params },
    scopeKey,
    functionName: "getL2ProfileRecords",
    queryDependencyType: "standard",
    queryFn: getPrimaryNameQueryFn,
  });

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    gcTime,
    staleTime,
  });

  const query = useQuery(preparedOptions);

  return query;
};
