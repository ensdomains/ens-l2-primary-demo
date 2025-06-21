import {
  useTransactionStore,
  ViewBase,
  ViewToViewProps,
} from "../../../stores/transactionStore"
import { TransactionView } from "@/components/views/TransactionView/TransactionView"
import { useSetRecord } from "../../../hooks/send-transactions/useSetRecord"
import { SyncWalletAndNetworkView } from "../SyncAddressAndNetworkView/SyncAddressAndNetworkView"
import { shortenAddress } from "../../../utils/address"
import { match, P } from "ts-pattern"
import { Address } from "viem"
import { NameData } from "@/hooks/useNameData"
import { isValidPrimaryNameOptionId, isViewBase } from "@/utils/predicates"
import { isValidNameData, isValidAddress } from "@/utils/predicates"
import { primaryNameOptions } from "@/constants/primaryNameOptions"
import { nameDataHasRecord } from "@/utils/nameData"

export interface SetRecordView extends ViewBase {
  name: "set-record"
  type: "transaction"
  nameData: NameData
  targetAddress: Address
  primaryNameOptionId: number
}

export const isSetRecordView = (view: unknown): view is SetRecordView =>
  isViewBase(view) && view.name === "set-record"

export const isValidSetRecordView = P.intersection({
  name: "set-record",
  type: "transaction",
  nameData: isValidNameData,
  targetAddress: isValidAddress,
  primaryNameOptionId: isValidPrimaryNameOptionId,
}, P.when((view) => {
  if (!isSetRecordView(view)) return false
  const primaryOption = primaryNameOptions.find((option) => option.id === view.primaryNameOptionId)!
  console.log("nameDataHasRecord", {
    nameData: view.nameData,
    coinType: primaryOption.chain.coinType,
    value: view.targetAddress,
  })
  return !nameDataHasRecord({
    nameData: view.nameData,
    coinType: primaryOption.chain.coinType,
    value: view.targetAddress,
  })
}))

export const SetRecordView = ({
  nameData,
  targetAddress,
  primaryNameOption,
}: ViewToViewProps<SetRecordView>) => {
  const { increment, decrement } = useTransactionStore()

  const { status,  execute, reset } = useSetRecord(
    {
      nameData: nameData,
      coinType: primaryNameOption.chain.coinType,
      targetAddress,
      resolverAddress: nameData.resolverAddress,
    },
  )
  console.log("status", status)

  return match(status)
    .with("loading", () => <div>Loading</div>)
    .with("syncAddressOrChain", () => (
      <SyncWalletAndNetworkView
        requiredAddress={nameData.ownership.owner}
        requiredChainId={primaryNameOption.chain.id}
        title={`Update ${primaryNameOption?.name} address`}
        subtitle={
          <span>
            To use this name as your Primary Name, you must update the{" "}
            <b>{primaryNameOption.chain.name} record</b> to this address.
          </span>
        }
        subtitle2={
          <span>
            Please connect with{" "}
            <b>{shortenAddress(nameData.ownership.owner)}</b> to complete this
            transaction.
          </span>
        }
        helperText={
          <span>
            You must connect with{" "}
            <b>{shortenAddress(nameData.ownership.owner)}</b> to complete this
            transaction.
          </span>
        }
      />
    ))
    .otherwise((_status) => (
      <TransactionView
        status={_status}
        items={[
          {
            type: "name",
            value: nameData?.name,
          },
          {
            type: "action",
            value: `Update ${primaryNameOption.chain.name} address record`,
          },
          {
            type: "address",
            value: shortenAddress(targetAddress),
          },
        ]}
        onSubmit={() => {
          execute()
        }}
        onRetry={() => {
          console.log("onRetry")
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
