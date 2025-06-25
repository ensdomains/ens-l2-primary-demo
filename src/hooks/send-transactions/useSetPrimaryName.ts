import { type Address, encodeFunctionData } from "viem"
import {
  useConfig,
  usePrepareTransactionRequest,
  useSendTransaction,
  // useWaitForTransactionReceipt,
} from "wagmi"
import { PrimaryOption } from "../../constants/primaryNameOptions"
import { useTransactionStore } from "@/stores/transactionStore"
import { useCheckAddressAndChain } from "../useCheckAddressAndChain"
import { calculateTransactionStatus } from "@/utils/calculateTransactionStatus"
import { reverseRegistrarSetNameSnippet } from "@ensdomains/ensjs/contracts"
import { NameData } from "../useNameData"
import { useQueryClient } from "@tanstack/react-query"

export const useSetPrimaryName = ({
  nameData,
  targetAddress,
  primaryNameOption,
}: {
  nameData: NameData | null
  targetAddress: Address
  primaryNameOption: PrimaryOption
}) => {
  const reverseRegistarAddress = primaryNameOption.reverseRegistarAddress

  const { addTransaction, getCurrentViewPosition, updateView, getCurrentTransaction } = useTransactionStore()

  const queryClient = useQueryClient()

  const isAddressAndChainValid = useCheckAddressAndChain({
    address: targetAddress,
    chainId: primaryNameOption?.chain.id,
  })

  const config = useConfig()

  const {
    data: preparedRequest,
    isLoading: isPrepareLoading,
    error: prepareError,
    refetch,
  } = usePrepareTransactionRequest({
    to: reverseRegistarAddress,
    chainId: primaryNameOption.chain.id,
    data: encodeFunctionData({
      abi: reverseRegistrarSetNameSnippet,
      args: [nameData?.name ?? ""],
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

  // TODO: REmove this if we are not using it
  // const { data: transactionReceipt } = useWaitForTransactionReceipt({
  //   hash,
  //   chainId: primaryNameOption?.chain.id,
  // })

  const execute = async () => {
    if (!preparedRequest) return
    sendTransaction(preparedRequest)
  }

  const currentTransaction = getCurrentTransaction()
  const status = calculateTransactionStatus({
    isLoading: false,
    isOutOfSync: !isAddressAndChainValid,
    isPreparing: isPrepareLoading,
    isPrepared: !!preparedRequest,
    isPending: isPending,
    isSent: currentTransaction?.status === "sent",
    isConfirmed: currentTransaction?.status === "confirmed",
    isError: currentTransaction?.status === "failed" || !!prepareError || !!sendError,
  })

  return {
    status,
    error: prepareError || sendError,
    execute,
    reset: () => {
      refetch()
      resetSend()
      updateView(position, {
        transaction: undefined
      })
    },
  }
}
