import { useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { type Address, encodeFunctionData, namehash, parseAbi } from "viem"
import {
  useAccount,
  usePrepareTransactionRequest,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi"
import type { ReverseNodeOptions } from "../utils/name"
import { ethereum } from "../chains2"
import { publicResolverSetAddrSnippet } from "@ensdomains/ensjs/contracts"

export const useSendSetRecordTransaction = ({
  name,
  coinType,
  targetAddress, 
  resolverAddress
}: {
  name: string
  coinType: number
  targetAddress: Address
  resolverAddress: Address
} & ReverseNodeOptions) => {
  const queryClient = useQueryClient()
  const { address, chainId: connectedChainId } = useAccount()

  console.log('resolverAddress', resolverAddress, coinType, targetAddress, address)

  const {
    data: preparedRequest,
    isLoading: isPrepareLoading,
    refetch,
  } = usePrepareTransactionRequest({
    to: resolverAddress,
    chainId: ethereum.id,
    data: encodeFunctionData({
      abi: publicResolverSetAddrSnippet,
      functionName: "setAddr",
      args: [namehash(name), BigInt(coinType), targetAddress],
    }),
    query: {
      enabled: false,
    },
  })

  console.log('preparedRequest', preparedRequest)

  const { switchChain } = useSwitchChain()

  const {
    sendTransaction,
    isPending,
    isSuccess,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess: (data: any) => {
        console.log("success", data)
      },
    },
  })

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash,
    chainId: ethereum.id,
  })

  const prepare = () => {
    queryClient.resetQueries({
      queryKey: ["prepareTransactionRequest"],
      exact: false,
    })
    refetch()
  }
  const execute = () =>
    sendTransaction({ ...preparedRequest, to: resolverAddress })

  const status = useMemo(() => {
    if (transactionReceipt) return "confirmed" as const
    if (isSuccess) return "sent" as const
    if (isPending) return "confirmInWallet" as const
    if (isPrepareLoading) return "preparing" as const
    if (preparedRequest) {
      if (connectedChainId !== ethereum.id) return "switchChain" as const
      return "prepared" as const
    }
    return null
  }, [
    isPrepareLoading,
    isPending,
    isSuccess,
    transactionReceipt,
    preparedRequest,
    connectedChainId,
  ])

  return {
    status,
    prepare,
    execute,
    switchChain: () => switchChain({ chainId: ethereum.id }),
  }
}
