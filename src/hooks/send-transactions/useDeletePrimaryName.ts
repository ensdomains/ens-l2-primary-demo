import { type Address, encodeFunctionData, getChainContractAddress, namehash } from "viem"
import {
  usePrepareTransactionRequest,
  useSendTransaction,
  // useWaitForTransactionReceipt,
} from "wagmi"
import { PrimaryOption } from "../../constants/primaryNameOptions"
import { useTransactionStore } from "@/stores/transactionStore"
import { useCheckAddressAndChain } from "../useCheckAddressAndChain"
import { calculateTransactionStatus } from "@/utils/calculateTransactionStatus"
import {
  reverseRegistrarSetNameSnippet,
  registrySetResolverSnippet,
} from "@ensdomains/ensjs/contracts"
import { match, P } from "ts-pattern"
import { ethereum } from "@/constants/chains"
import { getReverseNode } from "@/utils/name"
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"

export const useDeletePrimaryName = ({
  targetAddress,
  primaryNameOption,
}: {
  targetAddress: Address
  primaryNameOption: PrimaryOption
}) => {
  const reverseRegistarAddress = primaryNameOption.reverseRegistarAddress

  const {
    addTransaction,
    getCurrentViewPosition,
    updateView,
    getCurrentTransaction,
  } = useTransactionStore()

  const { isAddressAndChainValid, isAddressValid, isChainValid } =
    useCheckAddressAndChain({
      address: targetAddress,
      chainId: primaryNameOption?.chain.id,
    })

  const {
    data: preparedRequest,
    isLoading: isPrepareLoading,
    error: prepareError,
    refetch,
  } = usePrepareTransactionRequest(
    match(primaryNameOption)
    .with({ chain: { id: P.when((id) => id === ethereum.id)}}, () => ({
      to: getChainContractAddress({
        chain: ethereum,
        contract: "ensRegistry",
      }),
      chainId: primaryNameOption.chain.id,
      data: encodeFunctionData({
        abi: registrySetResolverSnippet,
        args: [namehash(getReverseNode(targetAddress)), EMPTY_ADDRESS ],
      }),
      query: {
        enabled: isAddressAndChainValid,
      },
    }))
    .otherwise(() => ({
      to: reverseRegistarAddress,
      chainId: primaryNameOption.chain.id,
      data: encodeFunctionData({
        abi: reverseRegistrarSetNameSnippet,
        args: [""],
      }),
      query: {
        enabled: isAddressAndChainValid,
      },
    })),
  )

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
    isAddressOutOfSync: !isAddressValid,
    isChainOutOfSync: !isChainValid,
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
    error: prepareError || sendError,
    execute,
    reset: () => {
      refetch()
      resetSend()
      updateView(position, {
        transaction: undefined,
      })
    },
  }
}
