import {
  useTransactionStore,
  ViewBase,
  ViewToViewProps,
} from "../../../stores/transactionStore"
import { TransactionView } from "@/components/views/TransactionView/TransactionView"
import { SyncWalletAndNetworkView } from "../SyncAddressAndNetworkView/SyncAddressAndNetworkView"
import { useSetPrimaryName } from "../../../hooks/send-transactions/useSetPrimaryName"
import { shortenAddress } from "../../../utils/address"
import { match } from "ts-pattern"
import { Address } from "viem"
import { NameData } from "@/hooks/useNameData"
import {
  isValidAddress,
  isValidNameData,
  isValidPrimaryNameOptionId,
  isViewBase,
} from "@/utils/predicates"
import { P } from "ts-pattern"

export const isSetPrimaryNameView = (
  view: unknown,
): view is SetPrimaryNameView => isViewBase(view) && view.name === "set-primary-name"

export const isValidSetPrimaryNameView = P.intersection(
  {
    name: "set-primary-name",
    type: "transaction",
    nameData: isValidNameData,
    targetAddress: isValidAddress,
    primaryNameOptionId: isValidPrimaryNameOptionId,
  },
  P.when(
    (view: unknown) =>{
      return isSetPrimaryNameView(view) && view.nameData?.name !== view.sourceValue}
  ),
)

export interface SetPrimaryNameView extends ViewBase {
  name: "set-primary-name"
  type: "transaction"
  nameData: NameData
  targetAddress: Address
  primaryNameOptionId: number
  sourceValue?: string
}

export const SetPrimaryNameView = ({
  nameData,
  targetAddress,
  primaryNameOption,
  transaction,
}: ViewToViewProps<SetPrimaryNameView>) => {
  const {
    increment,
    decrement,
  } = useTransactionStore()

  const { status, execute, error, reset } = useSetPrimaryName({
    targetAddress: targetAddress,
    primaryNameOption,
    nameData,
  })

  return match(transaction?.status ?? status)
    .with("loading", () => <div>Loading...</div>)
    .with(P.union("syncAddress", "syncChain"), (status) => {
      return (
        <SyncWalletAndNetworkView
          status={status}
          requiredAddress={targetAddress}
          requiredChainId={primaryNameOption.chain.id}
          title={`Set ${primaryNameOption?.name} primary name`}
          subtitle={
            <span>
              To set <b>{primaryNameOption?.name}</b> as your Primary Name, you
              must update the&nbsp;
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
          onBack={() => {
            decrement()
          }}
        />
      )
    })
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
            type: "name",
            value: nameData.name,
          },
          {
            type: "action",
            value: `Set ${primaryNameOption?.name} primary name`,
          },
        ]}
        onSubmit={() => {
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
