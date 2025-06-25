import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { Address, getAddress } from "viem"

export const shortenAddress = (address: string = '') => {
  const normalizedAddress = normalizeAddress(address)
  return `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`
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