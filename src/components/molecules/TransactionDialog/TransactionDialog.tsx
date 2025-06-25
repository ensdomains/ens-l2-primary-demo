import { Dialog } from "@ensdomains/thorin"
import {
  isValidSelectAddressView,
  SelectAddressView,
} from "@/components/views/SelectAddressView/SelectAddressView"
import {
  isValidSelectNameView,
  SelectNameView,
} from "@/components/views/SelectNameView/SelectNameView"
import { useTransactionStore } from "../../../stores/transactionStore"
import { match, P } from "ts-pattern"
import {
  isValidSetRecordView,
  SetRecordView,
} from "@/components/views/SetRecordView/SetRecordView"
import {
  isValidSetPrimaryNameView,
  SetPrimaryNameView,
} from "@/components/views/SetPrimaryNameView/SetPrimaryNameView"
import { primaryNameOptions } from "@/constants/primaryNameOptions"
import {
  DeletePrimaryNameView,
  isValidDeletePrimaryNameView,
} from "../../views/DeletePrimaryNameView/DeletePrimaryNameView"
import {
  isValidSyncTimeWarningView,
  SyncTimeWarning,
} from "../../views/SyncTimeWarning/SyncTimeWarning"
import {
  isValidSelectNameWithChainsView,
  SelectNameWithChainsView,
} from "../../views/SelectNameWithChainsView/SelectNameWithChainsView"
import {
  isValidSetRecordsView,
  SetRecordsView,
} from "../../views/SetRecordsView/SetRecordsView"
import {
  isValidSelectAddressWithChainsView,
  SelectAddressWithChainsView,
} from "../../views/SelectAddressWithChainsView/SelectAddressWithChainsView"

const getPrimaryNameOption = (primaryNameOptionId: number) =>
  primaryNameOptions.find((option) => option.id === primaryNameOptionId)!

export const TransactionDialog = () => {
  const { dismiss, getCurrentView } = useTransactionStore()
  const flow = useTransactionStore(( state) => state.currentKey ? state.flows[state.currentKey] : null)
 
  const { view } = getCurrentView()

  return (
    <Dialog
      open={!!view}
      onClose={() => dismiss()}
      onDismiss={() => dismiss()}
      variant='blank'
    >
      {match(view)
        .with(P.nullish, () => null)
        .with(isValidSelectNameView, ({ primaryNameOptionId, ...props }) => (
          <SelectNameView
            {...props}
            primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
          />
        ))
        .with(
          isValidSelectNameWithChainsView,
          ({ primaryNameOptionId, ...props }) => (
            <SelectNameWithChainsView
              {...props}
              primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
            />
          ),
        )
        .with(isValidSelectAddressView, ({ primaryNameOptionId, ...props }) => (
          <SelectAddressView
            {...props}
            primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
          />
        ))
        .with(
          isValidSelectAddressWithChainsView,
          ({ primaryNameOptionId, ...props }) => (
            <SelectAddressWithChainsView
              {...props}
              primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
            />
          ),
        )
        .with(
          isValidSetPrimaryNameView,
          ({ primaryNameOptionId, ...props }) => (
            <SetPrimaryNameView
              {...props}
              primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
            />
          ),
        )
        .with(isValidSetRecordView, ({ primaryNameOptionId, ...props }) => (
          <SetRecordView
            {...props}
            primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
          />
        ))
        .with(isValidSetRecordsView, ({ primaryNameOptionId, ...props }) => (
          <SetRecordsView
            {...props}
            primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
          />
        ))
        .with(
          isValidSyncTimeWarningView,
          ({ primaryNameOptionId, ...props }) => (
            <SyncTimeWarning
              {...props}
              primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
            />
          ),
        )
        .with(
          isValidDeletePrimaryNameView,
          ({ primaryNameOptionId, ...props }) => (
            <DeletePrimaryNameView
              {...props}
              primaryNameOption={getPrimaryNameOption(primaryNameOptionId)}
            />
          ),
        )
        .otherwise(({ name }) => (
          <div>No flow: {name}</div>
        ))}
    </Dialog>
  )
}
