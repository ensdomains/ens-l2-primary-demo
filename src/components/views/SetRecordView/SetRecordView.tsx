import { TransactionViewProps, useTransactionStore } from "../../../stores/transactionStore"
import { TransactionView } from "../../../views/transaction-view/TransactionView"
import { primaryNameOptions } from "../../../primaryOptions"
import { useSendSetRecordTransaction } from "../../../hooks/useSendSetRecordTransaction"
import { useAccount } from "wagmi"
import { ChangeWalletView } from "../ChangeWalletView/ChangeWalletView"
import { shortenAddress } from "../../../utils/address"

export const SetRecordView = ({
  nameData,
  targetAddress,
  targetChainId,
  primaryNameOptionId,
}: TransactionViewProps) => {
  const primaryNameOption = primaryNameOptions.find(
    (option) => option.id === primaryNameOptionId,
  )

  const { increment } = useTransactionStore()
  const { address } = useAccount()
  console.log("address", address)

  console.log("setREcordView params", {
    nameData,
    targetAddress,
    targetChainId,
    primaryNameOptionId,
  })

  const { status, prepare, execute, switchChain } = useSendSetRecordTransaction(
    {
      name: nameData?.name,
      coinType: primaryNameOption?.chain.coinType,
      targetAddress,
      resolverAddress: nameData?.resolverAddress,
    },
  )
  console.log("status", status)

  const canSubmit = address === nameData?.ownership.owner
  if (!canSubmit) {
    return <ChangeWalletView requiredAddress={nameData?.ownership.owner} />
  }
  return (
    <TransactionView
      status={status}
      items={[
        {
          type: 'name',
          value: nameData?.name
        },
        {
          type: 'action',
          value: `Update ${primaryNameOption?.name} adress record`
        },
        {
          type: 'address',
          value: shortenAddress(targetAddress)
        },
      ]}
      onSubmit={() => {
        prepare()
        execute()
      }}
      onNext={() => {
        increment()
      }}
    />
  )
}
