import { match, P } from 'ts-pattern'
import {
  BaseError,
  decodeErrorResult,
  EstimateGasExecutionError,
  formatEther,
  RawContractError,
} from 'viem'

type ReadableErrorType = 'insufficientFunds' | 'contract' | 'unknown'
type ReadableError = {
  message: string
  type: ReadableErrorType
}

export const getPreTransactionError = ({
  error,
  transactionError,
  requestError,
}: {
  error?: Error | null
  transactionError?: Error | null
  requestError?: Error | null
}) => {
  return match({ err: error })
    .with({ err: P.nullish }, () => null)
    .with({ err: P.not(P.instanceOf(BaseError)) }, ({ err }) => {
      return {
        message: 'message' in err! ? err.message : 'transaction.error.unknown',
        type: 'unknown' as const,
      }
    })
    .otherwise(({ err }) => {
      return {
        message: (err as BaseError).shortMessage,
        type: 'unknown' as const,
      }
    })
}