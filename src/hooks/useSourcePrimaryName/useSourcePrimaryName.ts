import { type QueryFunctionContext, useQuery } from "@tanstack/react-query";
import {
  type Address,
  zeroAddress,
} from "viem";
import { prepareQueryOptions } from "../../query/prepareQueryOptions";
import type {
  ConfigWithEns,
  CreateQueryKey,
  PartialBy,
  QueryConfig,
} from "../../query/query";
import { useQueryOptions } from "../useQueryOptions";
import { primaryNameOptions } from "../../constants/primaryNameOptions";

type GetSourcePrimaryNameParameters = {
  address: Address;
};

type GetSourcePrimaryNameType = string | null;

type UseSourcePrimaryNameParameters = PartialBy<
  GetSourcePrimaryNameParameters,
  "address"
> & {
  primaryNameOptionId: number,
};

type UseSourcePrimaryNameReturnType = GetSourcePrimaryNameType;

type UseSourcePrimaryNameConfig = QueryConfig<
  UseSourcePrimaryNameReturnType,
  Error,
  UseSourcePrimaryNameReturnType,
  QueryKey<UseSourcePrimaryNameParameters>
>;

type QueryKey<TParams extends UseSourcePrimaryNameParameters> = CreateQueryKey<
  TParams,
  "getPrimaryNameSource",
  "standard"
>;

export type UseSourcePrimaryNameFn = (config: ConfigWithEns) => <TParams extends UseSourcePrimaryNameParameters>(params: QueryFunctionContext<QueryKey<TParams>>) => Promise<string | null>

export const useSourcePrimaryName = <TParams extends UseSourcePrimaryNameParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  primaryNameOptionId,
  ...params
}: TParams & UseSourcePrimaryNameConfig) => {

  const primaryOption = primaryNameOptions.find((option) => option.id === primaryNameOptionId)

  const initialOptions = useQueryOptions({
    params: { ...params, primaryNameOptionId },
    scopeKey,
    functionName: "getPrimaryNameSource",
    queryDependencyType: "standard",
    queryFn: primaryOption?.sourceQuery,
  });

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    gcTime,
    staleTime,
    enabled: enabled && !!params.address && params.address !== zeroAddress,
  });

  const query = useQuery({...preparedOptions,});

  return query;
};
