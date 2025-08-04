import { queryOptions } from "@tanstack/react-query"
import { ConfigWithEns } from "@/query/query"
import { getBlock } from "wagmi/actions"

export const getBlockQueryKey = () => ["getBlock"]

export const getBlockQuery = (
  config: ConfigWithEns,
  { enabled }: { enabled?: boolean } = { enabled: true },
) => {
  return queryOptions({
    queryKey: getBlockQueryKey(),
    queryFn: () => getBlock(config),
    enabled: !!enabled,
  })
} 
