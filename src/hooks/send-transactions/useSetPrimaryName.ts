import { type Address, encodeFunctionData, parseAbi } from "viem"
import {
  useConfig,
  usePrepareTransactionRequest,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi"
import { PrimaryOption } from "../../constants/primaryNameOptions"
import { useTransactionStore } from "@/stores/transactionStore"
import { useCheckAddressAndChain } from "../useCheckAddressAndChain"
import { calculateTransactionStatus } from "@/utils/calculateTransactionStatus"

const setNameAbi = parseAbi(["function setName(string memory name)"])

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

  const { addTransaction, getCurrentViewPosition, updateView } = useTransactionStore()

  const { data: isAddressAndChainValid, isLoading: isCheckLoading } = useCheckAddressAndChain({
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
    chainId: primaryNameOption?.chain.id,
    data: encodeFunctionData({
      abi: setNameAbi,
      args: [name],
    }),
  })

  const position = getCurrentViewPosition()
  const {
    sendTransaction,
    isPending,
    isSuccess,
    data: hash,
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

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash,
    chainId: primaryNameOption?.chain.id,
  })

  const execute = async () =>
    sendTransaction({
      ...preparedRequest,
      to: primaryNameOption.reverseRegistarAddress,
    })

  const status = calculateTransactionStatus({
    isLoading: isCheckLoading,
    isOutOfSync: !isAddressAndChainValid,
    isPreparing: isPrepareLoading,
    isPrepared: !!preparedRequest,
    isPending: isPending,
    isSent: isSuccess,
    isConfirmed: !!transactionReceipt,
    isError: !!prepareError || !!sendError,
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
