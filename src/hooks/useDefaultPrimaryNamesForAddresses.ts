import { useQueries } from "@tanstack/react-query"
import { Address } from "viem"
import { getDefaultPrimaryNameSource } from "./useSourcePrimaryName/functions/getDefaultPrimaryName"
import { ethereum } from "@/constants/chains"
import { useConfig } from "wagmi"

export const useDefaultPrimaryNamesForAddresses = ({addresses}: {addresses: Address[]}) => {
  const config = useConfig()
  return useQueries({
    queries: addresses.map((address) => ({
      queryKey: [{ address, primaryNameOptionId: 0}, ethereum.id, address, undefined, 'getPrimaryNameSource'] as const,
      queryFn: getDefaultPrimaryNameSource(config),
      select: (data: unknown) => {
        return {
          name: data as string,
          address
        }
      }
    }))
  })
}