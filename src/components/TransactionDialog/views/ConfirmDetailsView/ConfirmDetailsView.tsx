import { Button, Dialog} from "@ensdomains/thorin"
import WalletSVG from '../../../../assets/wallet.svg'
import { useSyncName } from "../../../../hooks/useSyncName"
import { base, ethereum } from "../../../../chains2"
import { LoadBar } from "../../../LoadBar/LoadBar"

export const ConfirmDetailsView = () => {
  const { status, prepare, execute } = useSyncName({
    targetChain: ethereum,
    targetAddress: "0x17Deb4f8ede708CD65F17D1B1bBefffc93623030"
  })

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
        trailing={<Button colorStyle='accentPrimary' disabled onClick={() => {
          prepare()
          execute()
        }}>Open Wallet</Button>}
      />
    </>
  )
}