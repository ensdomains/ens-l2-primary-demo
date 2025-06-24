import { match, P } from "ts-pattern"

export type PrimaryNameStatus =
  | "loading"
  | "fetching"
  | "confirming"
  | "active"
  | "inherited"
  | "syncing"
  | "incomplete"
  | "none-set"

export const calculatePrimaryNameStatus = ({
  isLoading,
  isFetching,
  isConfirming,
  isResolved,
  isSourced,
  isMatching,
  isRecordSet,
}: {
  isLoading: boolean
  isFetching: boolean
  isConfirming: boolean
  isResolved: boolean
  isSourced: boolean
  isMatching: boolean
  isRecordSet: boolean
}): PrimaryNameStatus =>
  match({
    isLoading,
    isFetching,
    isConfirming,
    isResolved,
    isSourced,
    isMatching,
    isRecordSet,
  })
    .with(
      {
        isConfirming: true,
      },
      () => "confirming" as const,
    )
    .with(
      {
        isLoading: true,
      },
      () => "loading" as const,
    )
    .with(
      {
        isFetching: true,
      },
      () => "fetching" as const,
    )
    .with({ isResolved: true, isSourced: true, isMatching: true }, () => "active" as const)
    .with({ isResolved: true, isSourced: false }, () => "inherited" as const)
    .with(
      { isResolved: P.boolean, isSourced: true, isMatching: false, isRecordSet: true },
      () => "syncing" as const,
    )
    .with(
      { isResolved: P.boolean, isSourced: true, isRecordSet: false },
      () => "incomplete" as const,
    )
    .with({ isResolved: false, isSourced: false }, () => "none-set" as const)
    // This cannot happen since is matching requires both is resolved and is sourced to be true.
    // The closest value is syncing. 
    .with({ isResolved: false, isSourced: true, isMatching: true }, () => "syncing" as const)
    .exhaustive()
