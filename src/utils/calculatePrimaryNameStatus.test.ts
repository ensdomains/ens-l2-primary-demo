import { describe, it, expect } from "vitest"
import { calculatePrimaryNameStatus } from "./calculatePrimaryNameStatus"

const something = [
  [{
    isLoading: true,
    isFetching: true,
    isConfirming: true,
    isResolved: true,
    isSourced: true,
    isRecordSet: true,
    isMatching: true,
  }, "confirming"],
  [{
    isLoading: true,
    isFetching: true,
    isConfirming: false,
    isResolved: true,
    isSourced: true,
    isRecordSet: true,
    isMatching: true,
  }, "loading"],
  [{
    isLoading: false,
    isFetching: true,
    isConfirming: false,
    isResolved: true,
    isSourced: true,
    isRecordSet: true,
    isMatching: true,
  }, "fetching"],
  [{
    isLoading: false,
    isFetching: false,
    isConfirming: false,
    isResolved: true,
    isSourced: true,
    isMatching: true,
    isRecordSet: true,
  }, "active"],
  [{
    isLoading: false,
    isFetching: false,
    isConfirming: false,
    isResolved: true,
    isSourced: false,
    isMatching: false,
    isRecordSet: true,
  }, "inherited"],
  [{
    isLoading: false,
    isFetching: false,
    isConfirming: false,
    isResolved: true,
    isSourced: true,
    isMatching: false,
    isRecordSet: true,
  }, "syncing"],
  [{
    isLoading: false,
    isFetching: false,
    isConfirming: false,
    isResolved: true,
    isSourced: true,
    isMatching: false,
    isRecordSet: true,
  }, "syncing"],
  [{
    isLoading: false,
    isFetching: false,
    isConfirming: false,
    isResolved: false,
    isSourced: true,
    isMatching: false,
    isRecordSet: false,
  }, "incomplete"],
  [{
    isLoading: false,
    isFetching: false,
    isConfirming: false,
    isResolved: false,
    isSourced: false,
    isMatching: false,
    isRecordSet: false,
  }, "none-set"], 
  [{
    isLoading: false,
    isFetching: false,
    isConfirming: false,
    isResolved: false,
    isSourced: false,
    isMatching: true,
    isRecordSet: false,
  }, "none-set"], 
] as const
describe("calculatePrimaryNameStatus", () => {
  something.forEach(([input, expected]) => {
    it(`should return the correct status for ${JSON.stringify(input)}`, () => {
      expect(calculatePrimaryNameStatus(input)).toBe(expected)
    })
  })
})