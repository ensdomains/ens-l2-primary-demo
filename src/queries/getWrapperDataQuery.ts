import { getWrapperData } from "@ensdomains/ensjs/public"
import { queryOptions } from "@tanstack/react-query"
import { ClientWithEns } from "@ensdomains/ensjs/contracts"
import { ConfigWithEns } from "@/query/query"
import { ethereum } from "@/constants/chains"

export const getWrapperDataQueryKey = (name?: string) => ["getWrapperData", name]

export const getWrapperDataQuery = (
  config: ConfigWithEns,
  { name, enabled = true }: { name?: string; enabled?: boolean },
) => {
  return queryOptions({
    queryKey: getWrapperDataQueryKey(name),
    queryFn: ({ queryKey: [, _name] }) => {
      if (!_name) return null
      const client = config.getClient({ chainId: ethereum.id }) as unknown as ClientWithEns
      return getWrapperData(client, { name: _name })
    },
    enabled: !!name && enabled,
  })
}
