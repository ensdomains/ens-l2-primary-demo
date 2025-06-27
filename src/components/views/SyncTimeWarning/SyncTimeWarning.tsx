import { useTransactionStore, ViewToViewProps } from "@/stores/transactionStore"
import { Button, Dialog, Typography } from "@ensdomains/thorin"
import { ViewBase } from "../../../stores/transactionStore"
import { isValidPrimaryNameOptionId, isViewBase } from "@/utils/predicates"
import { primaryNameOptions } from "@/constants/primaryNameOptions"
import { P } from "ts-pattern"

export interface SyncTimeWarningView extends ViewBase {
  name: "sync-time-warning"
  type: "info"
  primaryNameOptionId: number
}

export const isSyncTimeWarning = (view: unknown): view is SyncTimeWarningView =>
  isViewBase(view) && view.name === "sync-time-warning"

export const isValidSyncTimeWarningView = P.intersection(
  {
    name: "sync-time-warning",
    type: "info",
    primaryNameOptionId: isValidPrimaryNameOptionId,
  },
  P.when(
  (view: unknown) =>
    isSyncTimeWarning(view) &&
    primaryNameOptions.find((option) => option.id === view.primaryNameOptionId)?.chain.chainType === 'l2',
))

export const filterUnneededWarning = (view: ViewBase, _: number  , array: ViewBase[]) => {
  if (view.name !== "sync-time-warning") return true
  return array.findIndex((v) => v.name === "set-primary-name") >= 0 
}

export const SyncTimeWarning = ({
  primaryNameOption,
}: ViewToViewProps<SyncTimeWarningView>) => {
  const { increment } = useTransactionStore()

  return (
    <>
      <Dialog.Heading title='This change is not immediate' alert='warning' />
      <Dialog.Content>
        <Typography textAlign='center'>
          {`${primaryNameOption?.name} takes up to ${primaryNameOption.chain.syncTime} to sync with ${primaryNameOption.chain.name}. Your Primary Name change will not take affect until ${primaryNameOption.chain.name} completes it's next sync.`}
        </Typography>
      </Dialog.Content>
      <Dialog.Footer 
        trailing={<Button onClick={increment}>I understand</Button>}
      />
    </>
  )
}
