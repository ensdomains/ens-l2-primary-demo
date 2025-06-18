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

// const setNameAbi = parseAbi(["function setName(string memory name)"])

export const useSetPrimaryName = ({
  targetAddress,
  primaryNameOption,
  name,
}: {
  targetAddress: Address
  name: string
  primaryNameOption: PrimaryOption
}) => {
  const reverseRegistarAddress = primaryNameOption.reverseRegistarAddress

  const { addTransaction, getCurrentViewPosition, updateView, getCurrentTransaction } = useTransactionStore()

  const { data: isAddressAndChainValid, isLoading: isCheckLoading } = useCheckAddressAndChain({
    address: targetAddress,
    chainId: primaryNameOption?.chain.id,
  })

  const config = useConfig()

  console.log("useSetPrimaryName",{
    name,
    to: reverseRegistarAddress,
    chainId: primaryNameOption?.chain.id,
    data: encodeFunctionData({
      abi: reverseRegistrarSetNameSnippet,
      args: [name],
    })
  })

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
      args: [name],
    }),
  })

  const position = getCurrentViewPosition()
  const {
    sendTransaction,
    isPending,
    // isSuccess,
    // data: hash,
    error: sendError,
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
    isLoading: isCheckLoading,
    isOutOfSync: !isAddressAndChainValid,
    isPreparing: isPrepareLoading,
    isPrepared: !!preparedRequest,
    isPending: isPending,
    isSent: currentTransaction?.status === "sent",
    isConfirmed: currentTransaction?.status === "confirmed",
    isError: currentTransaction?.status === "failed" || !!prepareError || !!sendError,
  })

  const error = prepareError || sendError

  return {
    status,
    error,
    execute,
    reset: () => {
      refetch()
      updateView(position, {
        transaction: undefined
      })
    },
  }
}
