import { NameData } from "@/hooks/useNameData"
import { Address, isAddress } from "viem"

export const nameDataHasRecord = ({
  nameData,
  coinType,
  value,
}: {
  nameData?: NameData
  coinType: number
  value?: Address
}) => {
  if (!nameData || !value) return false
  return nameData.coins.some(
    (coin) => coin.coinType === coinType && coin.value === value,
  )
}

export const nameDataCoinsWithAddress = ({
  nameData,
  address,
}: {
  nameData?: NameData | null
  address: Address | string
}) => {
  if (!nameData || !isAddress(address)) return []
  return nameData.coins.filter((coin) => coin.value === address)
}

export const nameDataCoinTypesWithAddress = ({
  nameData,
  address,
}: {
  nameData?: NameData | null
  address: Address | string
}) => {
  if (!isAddress(address)) return []
  return nameDataCoinsWithAddress({ nameData, address }).map((coin) => coin.coinType)
}