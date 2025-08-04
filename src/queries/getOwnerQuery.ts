import { getOwner } from "@ensdomains/ensjs/public"
import { queryOptions } from "@tanstack/react-query"
import { ClientWithEns } from "@ensdomains/ensjs/contracts"
import { ConfigWithEns } from "@/query/query"
import { ethereum } from "@/constants/chains"

export const getOwnerQueryKey = (name?: string) => ["getOwner", name]

export const getOwnerQuery = (
  config: ConfigWithEns,
  { name, enabled = true }: { name?: string; enabled?: boolean },
) => {
  return queryOptions({
    queryKey: getOwnerQueryKey(name),
    queryFn: ({ queryKey: [, _name] }) => {
      if (!_name) return null
      const client = config.getClient({ chainId: ethereum.id }) as unknown as ClientWithEns
      return getOwner(client, { name: _name })
    },
    enabled: !!name && enabled,
  })
}
