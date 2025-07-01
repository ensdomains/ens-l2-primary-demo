import { type QueryFunctionContext, useQuery } from "@tanstack/react-query";
import {
  decodeFunctionResult,
  encodeFunctionData,
  getChainContractAddress,
  parseAbi,
} from "viem";
import { prepareQueryOptions } from "@/query/prepareQueryOptions";
import type {
  ConfigWithEns,
  CreateQueryKey,
  PartialBy,
  QueryConfig,
} from "@/query/query";
import { useQueryOptions } from "@/hooks/useQueryOptions";
import { parseAvatarRecord } from "viem/ens";
import { readContract } from "viem/actions";
import { namehash } from "viem";
import { ethereum } from "@/constants/chains";
import { dnsEncodeName } from "@/utils/name";

type GetEnsAvatarParameters = {
  name: string;
};

type GetEnsAvatarReturnType = string | null;

type UseEnsAvatarParameters = PartialBy<
  GetEnsAvatarParameters,
  "name"
> 

type UseEnsAvatarReturnType = GetEnsAvatarReturnType;

type UseEnsAvatarConfig = QueryConfig<
  UseEnsAvatarReturnType,
  Error,
  UseEnsAvatarReturnType,
  QueryKey<UseEnsAvatarParameters>
>;

type QueryKey<TParams extends UseEnsAvatarParameters> = CreateQueryKey<
  TParams,
  "getEnsAvatar",
  "standard"
>;

const PROFILE_ABI = parseAbi([
  "function addr(bytes32, uint256 coinType) external view returns (bytes)",
  "function text(bytes32, string key) external view returns (string)",
  "function name(bytes32) external view returns (string)",
])

const universalResolverResolveAbi = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "name",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "resolve",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
]

export const getEnsAvatar = (config: ConfigWithEns) => async <TParams extends UseEnsAvatarParameters>(params: QueryFunctionContext<QueryKey<TParams>>) => {
  const { name } = params.queryKey[0]
  if (!name) return null

  const client = config.getClient({ chainId: ethereum.id })
  const data = await readContract(client, {
    address: getChainContractAddress({
      chain: ethereum,
      contract: "ensUniversalResolver",
    }),
    abi: universalResolverResolveAbi,
    functionName: "resolve",
    args: [dnsEncodeName(name), encodeFunctionData({
      abi: PROFILE_ABI,
      functionName: "text",
      args: [namehash(name), "avatar"],
    })],
  })

  const [encodedAvatarRecord] = data as [`0x${string}`]
  if (!encodedAvatarRecord) return null

  const avatarData = decodeFunctionResult({
    abi: PROFILE_ABI,
    functionName: "text",
    data: encodedAvatarRecord,
  })

  const avatar = await parseAvatarRecord(client, {
    record: avatarData,
    gatewayUrls: {
      ipfs: "https://ipfs.euc.li",
    },
  })

  return avatar
}

export const useEnsAvatar = <TParams extends UseEnsAvatarParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseEnsAvatarConfig) => {

  const initialOptions = useQueryOptions({
    params: { ...params },
    scopeKey,
    functionName: "getEnsAvatar",
    queryDependencyType: "standard",
    queryFn: getEnsAvatar,
  });

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    gcTime,
    enabled: enabled && !!params.name,
  });

  const query = useQuery({...preparedOptions,});

  return query;
};
