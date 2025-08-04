import { useQueries } from "@tanstack/react-query"
import { useConfig } from "wagmi"
import { getOwnerQuery } from "@/queries/getOwnerQuery"
import { getExpiryQuery } from "@/queries/getExpiryQuery"
import { getWrapperDataQuery } from "@/queries/getWrapperDataQuery"
import { getBlockQuery } from "@/queries/getBlockQuery"
import { GetOwnerReturnType, GetWrapperDataReturnType, GetExpiryReturnType, GetAddressRecordReturnType } from "@ensdomains/ensjs/public"
import { getValidationQuery, GetValidationReturnType } from "@/queries/getValidationQuery"
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { GetBlockReturnType } from "wagmi/actions"
import { getAddressRecordQuery } from "@/queries/getAddressRecordQuery"

export type RegistrationStatus =
  | 'invalid'
  | 'registered'
  | 'gracePeriod'
  | 'available'
  | 'short'
  | 'imported'
  | 'owned'
  | 'notImported'
  | 'notOwned'
  | 'unsupportedTLD'
  | 'offChain'
  | 'desynced'

export const getRegistrationStatus = ({
  block,
  validation,
  ownerData,
  wrapperData,
  expiryData,
  addrData,
  supportedTLD,
  name,
}: {
  block?: GetBlockReturnType
  validation?: GetValidationReturnType
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  expiryData?: GetExpiryReturnType
  addrData?: GetAddressRecordReturnType
  supportedTLD?: boolean | null
  name?: string
}): RegistrationStatus | undefined => {
  if (!block || !validation) return 
  if (name === '[root]') return 'owned'

  if (validation.isETH && validation.is2LD && validation.isShort) {
    return 'short'
  }

  if (!ownerData && ownerData !== null && !wrapperData) return 'invalid'

  if (!validation.isETH && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (validation.isETH && validation.is2LD) {
    const timestamp = Number(block.timestamp) * 1000
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (expiryData && expiryData.expiry) {
      const { expiry: _expiry, gracePeriod } = expiryData
      const expiry = new Date(_expiry.date)

      if (expiry.getTime() > timestamp) {
        if (
          ownerData &&
          ownerData.owner === EMPTY_ADDRESS &&
          ownerData.ownershipLevel === 'nameWrapper'
        ) {
          return 'desynced'
        }
        return 'registered'
      }
      if (expiry.getTime() + gracePeriod * 1000 > timestamp) {
        return 'gracePeriod'
      }
    }
    return 'available'
  }
  if (ownerData && !!ownerData.owner && ownerData.owner !== EMPTY_ADDRESS) {
    if (validation.is2LD) {
      return 'imported'
    }
    return 'owned'
  }
  if (validation.type === 'name' && !validation.is2LD) {
    // more than 2 labels

    if (addrData?.value && addrData.value !== EMPTY_ADDRESS) {
      return 'offChain'
    }
    return 'notOwned'
  }

  if (
    addrData?.value &&
    addrData.value !== '0x0000000000000000000000000000000000000020' &&
    addrData.value !== EMPTY_ADDRESS
  ) {
    return 'imported'
  }

  return 'notImported'
}


export const useRegistrationStatus = ({ name }: { name?: string }) => {
  const config = useConfig()
  return useQueries({
    queries: [
      getOwnerQuery(config, { name }),
      getWrapperDataQuery(config, {
        name,
      }),
      getExpiryQuery(config, {
        name,
      }),
      getBlockQuery(config),
      getValidationQuery({
        name,
      }),
      getAddressRecordQuery(config, {
        name,
      }),
    ],
    combine: (results) => {
      return {
        data: getRegistrationStatus({
          ownerData: results[0].data,
          wrapperData: results[1].data,
          expiryData: results[2].data,
          block: results[3].data,
          validation: results[4].data,
          addrData: results[5].data,
        }),
        isLoading: results.some((result) => result.isLoading),
        isFetching: results.some((result) => result.isFetching),
        isError: results.some((result) => result.isError),
      }
    },
  })
}
