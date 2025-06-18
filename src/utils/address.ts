import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { Address, getAddress } from "viem"

export const shortenAddress = (address: Address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const normalizeAddress = (address: Address): Address => {
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