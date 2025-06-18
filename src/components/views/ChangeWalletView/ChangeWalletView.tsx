import { useTransactionStore } from "@/stores/transactionStore"
import {
  Button,
  Dialog,
  Helper,
  Typography,
  LeftArrowSVG,
} from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"

export const ChangeWalletView = ({
  title,
  subtitle,
  subtitle2,
  helperText,
  onBack,
}: {
  title: string
  subtitle?: React.ReactNode
  subtitle2?: React.ReactNode
  helperText: React.ReactNode
  onBack?: () => void
}) => {

  const { decrement } = useTransactionStore()
  const { openConnectModal } = useConnectModal()

  return (
    <>
      <Dialog.Heading title={title} />
      <Dialog.Content>
        {subtitle && <Typography textAlign='center'>{subtitle}</Typography>}
        {subtitle2 && <Typography textAlign='center'>{subtitle2}</Typography>}
        <Helper alert='info' alignment='vertical' textAlign={"center"}>
          <Typography>{helperText}</Typography>
        </Helper>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle='accentSecondary' shape='square' onClick={decrement}>
            <LeftArrowSVG style={{ width: "1rem", height: "1rem" }} />
          </Button>
        }
        trailing={
          <Button
            colorStyle='accentPrimary'
            onClick={() => {
              openConnectModal?.()
            }}
          >
            Switch connection
          </Button>
        }
      />
    </>
  )
}
