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
import { primaryNameOptions } from "../../primaryOptions";

type GetPrimaryNameParameters = {
  address: Address;
};

type GetPrimaryNameSourceType = string | null;

type UsePrimaryNameSourceParameters = PartialBy<
  GetPrimaryNameParameters,
  "address"
> & {
  primaryNameOptionId: number,
};

type UsePrimaryNameSourceReturnType = GetPrimaryNameSourceType;

type UsePrimaryNameSourceConfig = QueryConfig<
  UsePrimaryNameSourceReturnType,
  Error,
  UsePrimaryNameSourceReturnType,
  QueryKey<UsePrimaryNameSourceParameters>
>;

type QueryKey<TParams extends UsePrimaryNameSourceParameters> = CreateQueryKey<
  TParams,
  "getPrimaryNameSource",
  "standard"
>;

export type UsePrimaryNameSourceFn = (config: ConfigWithEns) => <TParams extends UsePrimaryNameSourceParameters>(params: QueryFunctionContext<QueryKey<TParams>>) => Promise<string | null>

export const usePrimaryNameSource = <TParams extends UsePrimaryNameSourceParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  primaryNameOptionId,
  ...params
}: TParams & UsePrimaryNameSourceConfig) => {

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

  const query = useQuery(preparedOptions);

  return query;
};
