import { Button, Dialog} from "@ensdomains/thorin"
import WalletSVG from '../../../../assets/wallet.svg'
import { LoadBar, Status } from "../../LoadBar/LoadBar"

export const TransactionView = ({
  status, 
 onSubmit,
}: {
  status: Status
  onSubmit: () => void
}) => {
  return (
    <>
      <Dialog.Heading title='Confirm Details' />
      <Dialog.Content>
         <img src={WalletSVG} alt="Wallet" />
        <div>Double check these details before confirming in your wallet.</div>
        <div>status: {status}</div>
        <LoadBar status={status || "idle"} />
        <div>
          <div>
            <div>
              Name
            </div>
            <div>
              dom.eth
            </div>
          </div>
          <div>
            <div>
              Name
            </div>
            <div>
              dom.eth
            </div>
          </div>
        </div> 
      </Dialog.Content>
      <Dialog.Footer
        leading={<Button colorStyle='accentSecondary'>Back</Button>}
        trailing={<Button colorStyle='accentPrimary' disabled onClick={onSubmit}>Open Wallet</Button>}
      />
    </>
  )
}