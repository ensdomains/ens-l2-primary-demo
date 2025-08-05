import { useQueries, useQueryClient } from "@tanstack/react-query"
import { type Address } from "viem"
import { GetOwnerReturnType } from "@ensdomains/ensjs/public"
import { getOwnerQuery, getOwnerQueryKey } from "@/queries/getOwnerQuery"
import { useConfig } from "wagmi"
import { getCoinsQuery } from "@/queries/getCoinsQuery"
import { match, P } from "ts-pattern"
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"

export type NameData = {
  name: string
  ownership: NonNullable<GetOwnerReturnType>
  coins: {
    id: number
    coinType: number
    value: Address
  }[]
  resolverAddress: Address
}

export const useNameData = ({
  name,
  enabled = true,
}: {
  name?: string
  enabled?: boolean
}) => {
  const config = useConfig()
  const queryClient = useQueryClient()
  return useQueries({
    queries: [
      getOwnerQuery(config, { name, enabled }),
      getCoinsQuery(config, {
        name,
        enabled: enabled && !!queryClient.getQueryData(getOwnerQueryKey(name)),
      }),
    ],
    combine: (results) => {
      return {
        data: match([name, results[0].data])
          .with([P.nullish, P._], () => null)
          .with([P._, P.nullish], () => null)
          .with([P.string, {}], ([name, ownership]) => ({
            name,
            ownership,
            coins: results[1].data?.coins || [],
            resolverAddress: results[1].data?.resolverAddress || EMPTY_ADDRESS,
          }))
          .exhaustive(),
        isLoading: results.some((d) => d.isLoading),
        isFetching: results.some((d) => d.isFetching),
        isError: results.some((d) => d.isError),
        error: results.find((d) => d.error)?.error,
      }
    },
  })
}
