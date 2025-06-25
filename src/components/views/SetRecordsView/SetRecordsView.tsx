import {
  ViewToViewProps,
  useTransactionStore,
  ViewBase,
} from "../../../stores/transactionStore"
import { TransactionView } from "@/components/views/TransactionView/TransactionView"
import { SyncWalletAndNetworkView } from "../SyncAddressAndNetworkView/SyncAddressAndNetworkView"
import { shortenAddress } from "../../../utils/address"
import { match, P } from "ts-pattern"
import { useSetRecords } from "@/hooks/send-transactions/useSetRecords"
import { Address } from "viem"
import { NameData } from "@/hooks/useNameData"
import {
  isValidNameData,
  isValidAddress,
  isViewBase,
  isValidPrimaryNameOptionId,
} from "@/utils/predicates"
import { chains } from "@/constants/chains"

export interface SetRecordsView extends ViewBase {
  name: "set-records"
  type: "transaction"
  nameData: NameData
  coinTypes: number[]
  targetAddress: Address
  primaryNameOptionId: number
}

export const isSetRecordsView = (view: unknown): view is SetRecordsView =>
  isViewBase(view) && view.name === "set-records"

export const isValidSetRecordsView = P.intersection(
  {
    name: "set-records",
    type: "transaction",
    nameData: isValidNameData,
    targetAddress: isValidAddress,
    primaryNameOptionId: isValidPrimaryNameOptionId,
    coinTypes: P.array(P.number),
  },
  P.when((view) => isSetRecordsView(view) && view.coinTypes.length > 0),
)

export const SetRecordsView = ({
  nameData,
  targetAddress,
  primaryNameOption,
  coinTypes,
}: ViewToViewProps<SetRecordsView>) => {
  const { increment, decrement } = useTransactionStore()

  const { status, execute, error, reset } = useSetRecords({
    nameData: nameData,
    coinTypes,
    targetAddress,
    resolverAddress: nameData.resolverAddress,
  })

  return match(status)
    .with("loading", () => <div>Loading</div>)
    .with("syncAddressOrChain", () => (
      <SyncWalletAndNetworkView
        requiredAddress={nameData.ownership.owner}
        requiredChainId={primaryNameOption.chain.id}
        title={`Update ${primaryNameOption?.name} address`}
        subtitle={
          <span>
            To use this name as your Primary Name, you must update the&nbsp;
            <b>{primaryNameOption.chain.name} record</b> to this address.
          </span>
        }
        subtitle2={
          <span>
            Please connect with&nbsp;
            <b>{shortenAddress(nameData.ownership.owner)}</b> to complete this
            transaction.
          </span>
        }
        helperText={
          <span>
            You must connect with&nbsp;
            <b>{shortenAddress(nameData.ownership.owner)}</b> to complete this
            transaction.
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
            type: "name",
            value: nameData.name,
          },
          {
            type: "action",
            value: `Update address records`,
          },
          {
            type: "records",
            value: coinTypes.map((coinType) => chains.find((chain) => chain.coinType  === coinType)?.name ?? '').join(', '),
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
