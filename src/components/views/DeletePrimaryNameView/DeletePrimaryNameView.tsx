import {
  useTransactionStore,
  ViewToViewProps,
  ViewBase,
} from "../../../stores/transactionStore"
import { TransactionView } from "@/components/views/TransactionView/TransactionView"
import { SyncWalletAndNetworkView } from "../SyncAddressAndNetworkView/SyncAddressAndNetworkView"
import { useSetPrimaryName } from "../../../hooks/send-transactions/useSetPrimaryName"
import { shortenAddress } from "../../../utils/address"
import { match } from "ts-pattern"
import { NameData } from "@/hooks/useNameData"
import { Address } from "viem"
import { isValidPrimaryNameOptionId, isValidAddress, isValidNameData } from "@/utils/predicates"

export interface DeletePrimaryNameView extends ViewBase {
  name: "delete-primary-name"
  type: "transaction"
  nameData: NameData
  targetAddress: Address
  primaryNameOptionId: number
}

export const isValidDeletePrimaryNameView = {
  name: "delete-primary-name",
  type: "transaction",
  nameData: isValidNameData,
  targetAddress: isValidAddress,
  primaryNameOptionId: isValidPrimaryNameOptionId,
} as const

export const DeletePrimaryNameView = ({
  targetAddress,
  nameData,
  primaryNameOption,
}: ViewToViewProps<DeletePrimaryNameView>) => {

  const { increment, decrement } = useTransactionStore()

  const { status, execute, error, reset } = useSetPrimaryName({
    targetAddress,
    primaryNameOption,
    nameData: null,
  })

  return match(status)
    .with("loading", () => <div>Loading</div>)
    .with("syncAddressOrChain", () => (
      <SyncWalletAndNetworkView
        requiredAddress={targetAddress}
        requiredChainId={primaryNameOption.chain.id}
        title={`Delete ${primaryNameOption?.name} primary name`}
        subtitle={
          <span>
            To remove <b>{nameData.name}</b> as your Primary Name, you must
            update the&nbsp;
            <b>{primaryNameOption.chain.name} record</b> to this address.
          </span>
        }
        subtitle2={
          <span>
            Please connect with&nbsp;
            <b>{shortenAddress(targetAddress)}</b> to complete this transaction.
          </span>
        }
        helperText={
          <span>
            Please connect with <b>{shortenAddress(targetAddress)}</b> to
            complete this transaction.
          </span>
        }
      />
    ))
    .otherwise((_status) => (
      <TransactionView
        status={_status}
        error={error}
        items={[
          {
            type: "address",
            value: shortenAddress(targetAddress),
          },
          {
            type: "action",
            value: `Delete ${primaryNameOption?.name} primary name`,
          },
        ]}
        onSubmit={() => {
          // prepare()
          execute()
        }}
        onRetry={() => {
          reset()
        }}
        onNext={() => {
          increment()
        }}
        onBack={() => {
          decrement()
        }}
      />
    ))
}
