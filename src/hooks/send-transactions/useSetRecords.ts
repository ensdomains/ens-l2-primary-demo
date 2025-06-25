import { type Address } from "viem"
import {
  useConfig,
  usePrepareTransactionRequest,
  useSendTransaction,
} from "wagmi"
import { ethereum } from "../../constants/chains"
import { useTransactionStore } from "@/stores/transactionStore"
import { useCheckAddressAndChain } from "../useCheckAddressAndChain"
import { NameData } from "../useNameData"
import { setRecords } from "@ensdomains/ensjs/wallet"
import { calculateTransactionStatus } from "@/utils/calculateTransactionStatus"

export const useSetRecords = ({
  nameData,
  coinTypes,
  targetAddress,
  resolverAddress,
}: {
  nameData: NameData
  coinTypes: number[]
  targetAddress: Address
  resolverAddress: Address
}) => {
  
  const {
    addTransaction,
    getCurrentViewPosition,
    getCurrentTransaction,
    updateView,
  } = useTransactionStore()

  const currentTransaction = getCurrentTransaction()

  const isAddressAndChainValid =
    useCheckAddressAndChain({
      address: nameData.ownership.owner,
      chainId: ethereum.id,
    })

  const config = useConfig()
  const client = config.getClient({ chainId: ethereum.id })

  const {
    data: preparedRequest,
    error: prepareError,
    isLoading: isPrepareLoading,
    refetch: refetchPrepare,
  } = usePrepareTransactionRequest({
    chainId: ethereum.id,
    ...setRecords.makeFunctionData(client as any, {
      name: nameData.name,
      coins: coinTypes.map((coinType) => ({
        coin: coinType,
        value: targetAddress,
      })),
      resolverAddress,
    }),
    query: {
      enabled: isAddressAndChainValid,
    }
  })

  const position = getCurrentViewPosition()
  const {
    sendTransaction,
    isPending,
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
    error: prepareError || sendError,
    reset: () => {
      refetchPrepare()
      resetSend()
      updateView(position, {
        transaction: undefined,
      })
    },
  }
}
