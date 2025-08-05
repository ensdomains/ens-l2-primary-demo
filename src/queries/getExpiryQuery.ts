import { getExpiry } from "@ensdomains/ensjs/public"
import { queryOptions } from "@tanstack/react-query"
import { ClientWithEns } from "@ensdomains/ensjs/contracts"
import { ConfigWithEns } from "@/query/query"
import { ethereum } from "@/constants/chains"

export const getExpiryQueryKey = (name?: string) => ["getExpiry", name]

export const getExpiryQuery = (
  config: ConfigWithEns,
  { name, enabled = true }: { name?: string; enabled?: boolean },
) => {
  return queryOptions({
    queryKey: getExpiryQueryKey(name),
    queryFn: ({ queryKey: [, _name] }) => {
      if (!_name) return null
      const client = config.getClient({ chainId: ethereum.id }) as unknown as ClientWithEns
      return getExpiry(client, { name: _name })
    },
    enabled: !!name && enabled,
  })
}
