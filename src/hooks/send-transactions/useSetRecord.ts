import { type Address, encodeFunctionData, namehash } from "viem"
import {
  useConfig,
  usePrepareTransactionRequest,
  useSendTransaction,
  // useWaitForTransactionReceipt,
} from "wagmi"
import { ethereum } from "../../constants/chains"
import { publicResolverSetAddrSnippet } from "@ensdomains/ensjs/contracts"
import { useTransactionStore } from "@/stores/transactionStore"
import { useCheckAddressAndChain } from "../useCheckAddressAndChain"
import { NameData } from "../useNameData"
import { calculateTransactionStatus } from "@/utils/calculateTransactionStatus"
import { useQueryClient } from "@tanstack/react-query"

export const useSetRecord = ({
  nameData,
  coinType,
  targetAddress,
  resolverAddress,
}: {
  nameData: NameData
  coinType: number
  targetAddress: Address
  resolverAddress: Address
}) => {

  const {
    addTransaction,
    getCurrentViewPosition,
    getCurrentTransaction,
    updateView,
  } = useTransactionStore()

  const isAddressAndChainValid =
    useCheckAddressAndChain({
      address: nameData.ownership.owner,
      chainId: ethereum.id,
    })

  const config = useConfig()
  const queryClient = useQueryClient()

  const {
    data: preparedRequest,
    error: prepareError,
    isLoading: isPrepareLoading,
    refetch: refetchPrepare,
  } = usePrepareTransactionRequest({
    to: resolverAddress,
    chainId: ethereum.id,
    data: encodeFunctionData({
      abi: publicResolverSetAddrSnippet,
      functionName: "setAddr",
      args: [namehash(nameData.name), BigInt(coinType), targetAddress],
    }),
    query: {
      enabled: isAddressAndChainValid,
    }
  })

  const position = getCurrentViewPosition()
  const {
    sendTransaction,
    isPending,
    // isSuccess,
    // data: hash,
    error: sendError,
    reset: resetSend,
  } = useSendTransaction({
    mutation: {
      onSuccess: (data: `0x${string}`) => {
        if (!position) return
        addTransaction(position, {
          transaction: {
            status: "sent",
            hash: data,
          },
          config,
          queryClient,
        })
      },
    },
  })

  // const { data: transactionReceipt } = useWaitForTransactionReceipt({
  //   hash,
  //   chainId: ethereum.id,
  // })

  const execute = () =>
    sendTransaction({ ...preparedRequest, to: resolverAddress })

  const currentTransaction = getCurrentTransaction()
  
  const status = calculateTransactionStatus({
    isLoading: false,
    isOutOfSync: !isAddressAndChainValid,
    isPreparing: isPrepareLoading,
    isPrepared: !!preparedRequest,
    isPending: isPending,
    isSent: currentTransaction?.status === "sent",
    isConfirmed: currentTransaction?.status === "confirmed",
    isError:
      currentTransaction?.status === "failed" || !!prepareError || !!sendError,
  })

  return {
    status,
    execute,
    reset: () => {
      refetchPrepare()
      resetSend()
      updateView(position, {
        transaction: undefined,
      })
    },
    error: prepareError || sendError,
  }
}
