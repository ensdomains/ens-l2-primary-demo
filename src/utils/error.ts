import { match, P } from 'ts-pattern'
import {
  BaseError,
} from 'viem'


export const getPreTransactionError = ({ error }: { error?: Error | null }) => {
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