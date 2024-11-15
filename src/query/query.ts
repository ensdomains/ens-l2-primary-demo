import type {
  QueryKey,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { Account, Address, Client, Transport } from "viem";
import type { Register } from "wagmi";
import type { SupportedChain } from "../wagmi";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ConnectorClientWithEns = Client<Transport, SupportedChain, Account>;
export type ConfigWithEns = Register["config"];
export type ClientWithEns = ReturnType<ConfigWithEns["getClient"]>;

export type QueryConfig<
  TData,
  TError,
  TSelectData = TData,
  TQueryKey extends QueryKey = QueryKey,
> = Pick<
  UseQueryOptions<TData, TError, TSelectData, TQueryKey>,
  "gcTime" | "enabled" | "staleTime"
> & {
  /** Scope the cache to a given context. */
  scopeKey?: string;
};
export type InfiniteQueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseInfiniteQueryOptions<TData, TError, TSelectData>,
  "gcTime" | "enabled" | "staleTime"
> & {
  /** Scope the cache to a given context. */
  scopeKey?: string;
};
export type BaseQueryKeyParameters = {
  chainId: number;
  address: Address | undefined;
};
export type QueryDependencyType = "standard" | "graph" | "independent";
export type CreateQueryKey<
  TParams extends {},
  TFunctionName extends string,
  TQueryDependencyType extends QueryDependencyType,
> = TQueryDependencyType extends "graph"
  ? readonly [
      params: TParams,
      chainId: SupportedChain["id"],
      address: Address | undefined,
      scopeKey: string | undefined,
      functionName: TFunctionName,
      graphKey: "graph",
    ]
  : readonly [
      params: TParams,
      chainId: TQueryDependencyType extends "independent"
        ? undefined
        : SupportedChain["id"],
      address: TQueryDependencyType extends "independent"
        ? undefined
        : Address | undefined,
      scopeKey: string | undefined,
      functionName: TFunctionName,
    ];
export type GenericQueryKey<
  TQueryDependencyType extends QueryDependencyType = QueryDependencyType,
> = CreateQueryKey<object, string, TQueryDependencyType>;

/**
 * Makes {@link TKeys} optional in {@link TType} while preserving type inference.
 */
// s/o trpc (https://github.com/trpc/trpc/blob/main/packages/server/src/types.ts#L6)
export type PartialBy<TType, TKeys extends keyof TType> = Partial<
  Pick<TType, TKeys>
> &
  Omit<TType, TKeys>;
