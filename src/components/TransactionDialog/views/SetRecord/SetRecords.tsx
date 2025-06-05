import { Button } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useState } from "react"
import { Dialog, Input } from "@ensdomains/thorin"

export const SetRecordView = () => {
  const [targetAddress, setTargetAddress] = useState<string>("")
  const { openConnectModal } = useConnectModal()
  return (
    <>
   <Dialog.Heading title="Set address" />
  <Dialog.Content>
    <Input label="Address" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} />
    <Button colorStyle="accentSecondary" onClick={() => openConnectModal?.()}>
      Connect
    </Button>
  </Dialog.Content>
  <Dialog.Footer trailing={<Button colorStyle="accentSecondary">Next</Button>} />
    </>
  )
}