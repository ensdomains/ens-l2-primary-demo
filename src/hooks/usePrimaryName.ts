import { type QueryFunctionContext, useQuery } from "@tanstack/react-query";
import {
  type Address,
  decodeFunctionResult,
  encodeFunctionData,
  getChainContractAddress,
  namehash,
  parseAbi,
  zeroAddress,
} from "viem";
import { getEnsName, readContract } from "viem/actions";
import { prepareQueryOptions } from "../query/prepareQueryOptions";
import type {
  ConfigWithEns,
  CreateQueryKey,
  PartialBy,
  QueryConfig,
} from "../query/query";
import {
  dnsEncodeName,
  getReverseNamespace,
  getReverseNode,
} from "../utils/name";
import type { SupportedChain } from "../wagmi";
import { useQueryOptions } from "./useQueryOptions";

type GetPrimaryNameParameters = {
  address: Address;
  directQuery?: boolean;
  forceDefault?: boolean;
};
type GetPrimaryNameReturnType = string | null;

type UsePrimaryNameParameters = PartialBy<
  GetPrimaryNameParameters,
  "address"
> & {
  allowMismatch?: boolean;
  chainId?: SupportedChain["id"];
};

type UsePrimaryNameReturnType = GetPrimaryNameReturnType;

type UsePrimaryNameConfig = QueryConfig<
  UsePrimaryNameReturnType,
  Error,
  UsePrimaryNameReturnType,
  QueryKey<UsePrimaryNameParameters>
>;

type QueryKey<TParams extends UsePrimaryNameParameters> = CreateQueryKey<
  TParams,
  "getPrimaryName",
  "standard"
>;

const standaloneReverseRegistrarAbi = parseAbi([
  "function nameForAddr(address addr) external view returns (string)",
]);
const reverseResolverAbi = parseAbi([
  "function name(bytes32 node) external view returns (string memory)",
]);
const l1ResolverAbi = parseAbi([
  "function resolve(bytes calldata name, bytes calldata data) external view returns (bytes)",
]);
const ensRegistryAbi = parseAbi([
  "function resolver(bytes32 node) external view returns (address)",
]);

export const getPrimaryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UsePrimaryNameParameters>({
    queryKey: [
      {
        address,
        chainId: chainIdOverride,
        directQuery,
        forceDefault,
        ...params
      },
      chainId_,
    ],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!address) throw new Error("address is required");

    const chainId = chainIdOverride ?? chainId_;
    const currentChain = config.chains.find((c) => c.id === chainId);

    if (!currentChain) throw new Error("chain not found");

    if (!currentChain?.sourceId) {
      console.log("trying to read ens name");
      const client = config.getClient({ chainId });
      if (!forceDefault) return getEnsName(client, { address, ...params });

      console.log("trying to read default resolver");
      const defaultRegistrarAddress = await readContract(client, {
        address: getChainContractAddress({
          chain: currentChain,
          contract: "ensRegistry",
        }),
        abi: ensRegistryAbi,
        functionName: "resolver",
        args: [namehash(getReverseNamespace({ ns: "default" }))],
      });
      console.log("default registrar", defaultRegistrarAddress);
      return readContract(client, {
        address: defaultRegistrarAddress,
        abi: standaloneReverseRegistrarAbi,
        functionName: "nameForAddr",
        args: [address],
      });
    }

    const reverseNode = getReverseNode(address, {
      chainId: currentChain.id,
    });

    if (directQuery) {
      const registrarAddress = getChainContractAddress({
        chain: currentChain,
        contract: "l2ReverseRegistrar",
      });
      const client = config.getClient({ chainId: currentChain.id });
      return readContract(client, {
        address: registrarAddress,
        abi: standaloneReverseRegistrarAbi,
        functionName: "nameForAddr",
        args: [address],
      });
    }

    const targetChain = config.chains.find(
      (c) => c.id === currentChain?.sourceId
    );
    if (!targetChain) throw new Error("target chain not found");
    const client = config.getClient({ chainId: targetChain.id });
    console.log("before");

    const resolver = await readContract(client, {
      address: getChainContractAddress({
        chain: targetChain,
        contract: "ensRegistry",
      }),
      abi: ensRegistryAbi,
      functionName: "resolver",
      args: [namehash(getReverseNamespace({ chainId: currentChain.id }))],
    });

    console.log("target resolver", resolver);

    const calldata = encodeFunctionData({
      abi: reverseResolverAbi,
      functionName: "name",
      args: [namehash(reverseNode)],
    });
    const result = await readContract(client, {
      address: resolver,
      abi: l1ResolverAbi,
      functionName: "resolve",
      args: [dnsEncodeName(reverseNode), calldata],
    });
    const name = decodeFunctionResult({
      abi: reverseResolverAbi,
      functionName: "name",
      data: result,
    });

    if (!name) return null;

    return name;
  };

export const usePrimaryName = <TParams extends UsePrimaryNameParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  allowMismatch = false,
  ...params
}: TParams & UsePrimaryNameConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params, allowMismatch },
    scopeKey,
    functionName: "getPrimaryName",
    queryDependencyType: "standard",
    queryFn: getPrimaryNameQueryFn,
  });

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.address && params.address !== zeroAddress,
    gcTime,
    staleTime,
  });

  const query = useQuery(preparedOptions);

  return query;
};
