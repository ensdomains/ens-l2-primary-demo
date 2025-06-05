import { TransactionViewProps, useTransactionStore } from "../../../stores/transactionStore"
import { TransactionView } from "../../../views/transaction-view/TransactionView"
import { useAccount } from "wagmi"
import { ChangeWalletView } from "../ChangeWalletView/ChangeWalletView"
import { useSendSetPrimaryNameTransaction } from "../../../hooks/useSendTransaction/useSendSetPrimaryNameTransaction"
import { primaryNameOptions } from "../../../primaryOptions"
import { shortenAddress } from '../../../utils/address';

export const SetPrimaryNameView = ({
  nameData,
  targetAddress,
  targetChainId,
  primaryNameOptionId,
}: TransactionViewProps) => {
  const { increment } = useTransactionStore()
  const { address } = useAccount()
 
  const primaryNameOption = primaryNameOptions.find(p => p.id === primaryNameOptionId)

  const { status, prepare, execute, switchChain } = useSendSetPrimaryNameTransaction(
    {
      primaryNameOptionId,
      name: nameData?.name,
    },
  )
  console.log('status', status)

  const canSubmit = address === targetAddress
  if (!canSubmit) {
    return <ChangeWalletView requiredAddress={targetAddress} />
  }
  return (
    <TransactionView
      status={status}
      items={[
        {
          type: 'address',
          value: shortenAddress(targetAddress)
        },
        {
          type: 'name',
          value: nameData?.name
        },
        {
          type: 'action',
          value: `Set ${primaryNameOption?.name} primary name`
        },
      ]}
      onSubmit={() => {
        switchChain()
        prepare()
        execute()
      }}
      onNext={() => {
        increment()
      }}
    />
  )
}
