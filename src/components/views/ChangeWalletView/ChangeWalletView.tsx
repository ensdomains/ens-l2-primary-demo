import { Button, Dialog } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Address } from "viem"
import { useAccount } from "wagmi"

export const ChangeWalletView = ({
  requiredAddress,
}: {
  requiredAddress: Address
}) => {
  const { address, connector } = useAccount()

  const { openConnectModal } = useConnectModal()

  console.log("openConnectModal", openConnectModal, address, connector)
  return (
    <>
      <Dialog.Heading title='Change Wallet' />
      <Dialog.Content>
        <div>
          <div>
            <div>Name</div>
            <div>dom.eth</div>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Footer
        leading={<Button colorStyle='accentSecondary'>Back</Button>}
        trailing={
          <Button
            colorStyle='accentPrimary'
            onClick={() => {
              alert("switch")
              openConnectModal?.()
            }}
          >
            Switch Wallet
          </Button>
        }
      />
    </>
  )
}
