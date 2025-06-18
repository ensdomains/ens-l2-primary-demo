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

  const { addTransaction, getCurrentViewPosition, getCurrentTransaction } = useTransactionStore()

  const { data: isAddressAndChainValid, isLoading: isCheckLoading } =
    useCheckAddressAndChain({
      address: nameData.ownership.owner,
      chainId: ethereum.id,
    })

  const config = useConfig()

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

  // const { data: transactionReceipt } = useWaitForTransactionReceipt({
  //   hash,
  //   chainId: ethereum.id,
  // })

  const execute = () =>
    sendTransaction({ ...preparedRequest, to: resolverAddress })

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

  return {
    status,
    execute,
    reset: () => {
      refetchPrepare()
    },
    error: prepareError || sendError,
  }
}