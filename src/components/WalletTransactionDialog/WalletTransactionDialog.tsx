import { Dialog } from "@ensdomains/thorin"
import { SelectNameView } from "../../views/select-name/SelectNameView"
import { useTransactionStore } from "../../stores/transactionStore"
import { match, P } from "ts-pattern"
import { SetRecordView } from "../views/SetRecordView/SetRecordView"
import { SetPrimaryNameView } from "../views/SetPrimaryNameView/SetPrimaryNameView"

export const WalletTransactionDialog = () => {
  const { dismiss, currentKey, flows } = useTransactionStore()

  const flow = currentKey ? flows[currentKey] : null

  console.log(flow)
  const { views, viewIndex, ...props } = flow || {}

  const view = views?.[viewIndex]
  console.log(view)
  return (
    <Dialog
      open={!!view}
      onClose={() => dismiss()}
      onDismiss={() => dismiss()}
      variant='blank'
    >
      {match(view)
        .with(P.nullish, () => null)
        .with("select-name", () => <SelectNameView {...props} />)
        .with("set-name", () => <SetPrimaryNameView {...props} />)
        .with("set-record", () => <SetRecordView {...props} />)
        .exhaustive()}
    </Dialog>
  )
}
