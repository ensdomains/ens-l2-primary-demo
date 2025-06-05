import { Button } from "@ensdomains/thorin";

import { Dialog } from "@ensdomains/thorin"
import { SetRecordView } from "./views/SetRecord/SetRecords"
import { SyncWalletView } from "./views/SyncWalletView/SyncWalletView";
import { ConfirmDetailsView } from "./views/ConfirmDetailsView/ConfirmDetailsView";

export const TransactionDialog = () => {

  return  <Dialog open={true} onClose={() => {}} onDismiss={() => {}} variant="blank">
    {/* <SyncWalletView /> */}
    <ConfirmDetailsView />
  {/* <SetRecordView /> */}
</Dialog>
}