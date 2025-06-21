import { chains } from "@/constants/chains"
import { shortenAddress } from "@/utils/address"
import { Dialog, Typography } from "@ensdomains/thorin"
import { Address } from "viem"

export const ChangeChainView = ({
  requiredChainId,
  requiredAddress,
}: {
  requiredChainId: number
  requiredAddress: Address
}) => {
  const network =
    chains.find((chain) => chain.id === requiredChainId)?.name || "unknown"
  return (
    <>
      <Dialog.Content>
        <Typography fontVariant='body' textAlign='center'>
          Please connect to <b>{shortenAddress(requiredAddress)}</b> on&nbsp;
          <b>{network}</b> to complete this transaction. You may need to switch
          to a wallet that supports {network}.
        </Typography>
      </Dialog.Content>
    </>
  )
}
