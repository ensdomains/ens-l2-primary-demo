import { Button, Dialog } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useEffect } from "react"
import { useAccount } from "wagmi"

export const SyncWalletView = ({
  targetAddress = "0x17Deb4f8ede708CD65F17D1B1bBefffc93623030",
}: {
  targetAddress: string
}) => {


  const { openConnectModal } = useConnectModal()
  const { address , connector } = useAccount()

  useEffect(() => {
    if (address === targetAddress) alert('Connected')
    else {
      connector?.disconnect?.()
    }
  }, [address, targetAddress])

  return (
    <>
      <Dialog.Heading title='Sync Wallet' />
      <Dialog.Content>
        <div>Sync Wallet</div>
      </Dialog.Content>
      <Dialog.Footer
        trailing={
          <Button
            colorStyle='accentSecondary'
            onClick={() => openConnectModal?.()}
          >
            Connect
          </Button>
        }
      />
    </>
  )
}
