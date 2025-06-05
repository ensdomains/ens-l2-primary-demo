import { Typography } from "@ensdomains/thorin"
import { useTransactionStore } from "../../stores/transactionStore"
import { TransactionView } from "../transaction-view/TransactionView"
import { useSetName } from "../../hooks/useSetName"
import { SyncWalletView } from "../sync-wallet/SyncWalletView"
export const SetNameView = () => {
  const { targetAddress: walletAddress } = useTransactionStore()
  const { execute, status, prepare, switchChain } = useSetName({
    targetChain: 11155111,
    walletAddress,
    name: 'davidchu.eth',
  })
  return <SyncWalletView/>
  return <div>
    <div> {walletAddress}</div>
    <Typography fontVariant="bodyBold" color="textPrimary">Set Name</Typography>
    <Typography fontVariant="body" color="textSecondary">{walletAddress}</Typography>
    { status}
    <TransactionView address={walletAddress} name="Set Name" onSubmit={() => {
      // prepare()
      switchChain()
      // execute()
    }} />
  </div>
}