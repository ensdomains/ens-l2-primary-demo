import { match } from "ts-pattern"

export const calculateTransactionStatus = ({
  isLoading,
  isAddressOutOfSync,
  isChainOutOfSync,
  isPreparing,
  isPrepared,
  isPending,
  isSent,
  isConfirmed,
  isError
}: {
  isLoading: boolean
  isAddressOutOfSync: boolean
  isChainOutOfSync: boolean
  isPreparing: boolean
  isPrepared: boolean
  isPending: boolean
  isSent: boolean
  isConfirmed: boolean
  isError: boolean
}) =>
  match({
    isLoading,
    isAddressOutOfSync,
    isChainOutOfSync,
    isPreparing,
    isPrepared,
    isPending,
    isSent,
    isConfirmed,
    isError,
  })
    .with({ isLoading: true }, () => "loading" as const)
    .with({ isAddressOutOfSync: true }, () => "syncAddress" as const)
    .with({ isChainOutOfSync: true }, () => "syncChain" as const)
    .with({ isError: true }, () => "failed" as const)
    .with({ isConfirmed: true }, () => "confirmed" as const)
    .with({ isSent: true }, () => "sent" as const)
    .with({ isPending: true }, () => "confirmInWallet" as const)
    .with({ isPrepared: true }, () => "prepared" as const)
    .with({ isPreparing: true }, () => "preparing" as const)
    .otherwise(() => "loading" as const)
