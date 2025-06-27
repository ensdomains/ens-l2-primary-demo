import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { normalizeAddress } from "./address"
import { describe, it, expect } from "vitest"

describe('normalizeAddress', () => {
  it('should normalize an address', () => {
    expect(normalizeAddress('0x')).toBe(EMPTY_ADDRESS)
  })
})