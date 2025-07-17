import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { Address, getAddress } from "viem"

export const shortenAddress = (address: string = '', length = 5) => {
  const normalizedAddress = normalizeAddress(address)
  return `${normalizedAddress.slice(0, length)}...${normalizedAddress.slice(-length)}`
}

export const normalizeAddress = (address: string = ''): Address => {
  try {
    return getAddress(address)
  } catch {
    return EMPTY_ADDRESS
  }
}

export const isValidAddress = (address: string): address is Address => {
  try {
    return getAddress(address) !== EMPTY_ADDRESS
  } catch {
    return false
  }
}