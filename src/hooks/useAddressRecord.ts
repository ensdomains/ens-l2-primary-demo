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
import { ethereum } from "../chains2";

type GetAddressRecordParameters = {
  name: string;
  coinType: number;
};

type GetAddressRecordReturnType =  Address | null;

type UseAddressRecordParameters = GetAddressRecordParameters;

export type UseAddressRecordReturnType = GetAddressRecordReturnType;

type UsePrimaryNameConfig = QueryConfig<
  UseAddressRecordReturnType,
  Error,
  UseAddressRecordReturnType,
  QueryKey<UseAddressRecordParameters>
>;

type QueryKey<TParams extends UseAddressRecordParameters> = CreateQueryKey<
  TParams,
  "getAddressRecord",
  "standard"
>;

export const getAddressRecordQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseAddressRecordParameters>({
    queryKey: [
      {
        name,
        coinType,
      },
    ],
  }: QueryFunctionContext<QueryKey<TParams>>) => {

    const chainId = ethereum.id;
    const client = config.getClient({ chainId })
    const records = await getRecords(client, {
      name,
      coins: [coinType],
    })
    return records?.coins[0]?.value as Address || null;
  };

export const useAddressRecord = <TParams extends UseAddressRecordParameters>({
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
    functionName: "getAddressRecord",
    queryDependencyType: "standard",
    queryFn: getAddressRecordQueryFn,
  });

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    gcTime,
    staleTime,
    enabled: enabled && !!params.name && !!params.coinType,
  });

  return useQuery(preparedOptions);
};
