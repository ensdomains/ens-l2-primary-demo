import { Button, Dialog, Typography } from "@ensdomains/thorin"
import walletIcon from "../../assets/wallet.svg"
import { detailItem, detailItemLabel, footer } from "./TransactionView.css"
import { Address } from "viem"
import { LoadBar, Status } from "../../components/LoadBar/LoadBar"
import { match, P } from "ts-pattern"

const DetailItem = ({ label, children }: { label: string, children: React.ReactNode }) => {
  return (
    <div className={detailItem}>
      <div className={detailItemLabel}>
        <Typography fontVariant='body' color='greyPrimary'>
          {label}
        </Typography>
      </div>
      <div>
        <Typography fontVariant='bodyBold' color='textPrimary'>
          {children}
        </Typography>
      </div>
    </div>
  )
}

export const TransactionView = ({
  address,
  name,
  items,
  onSubmit,
  onNext,
  status
}: {
  address: Address
  name: string
  onSubmit: () => void
  onNext: () => void
  status: Status
  items: {
    type: 'address' | 'name' | 'action'
    value: string
  }[]
}) => {

  const buttonProps = match(status)
  .with(P.union('confirmed', 'confirmed'), () => ({
    onClick: onNext,
    disabled: false,
    children: 'Next'
  }))
  .with(P.union('preparing', 'preparing'), () => ({
    onClick: onSubmit,
    disabled: false,
    children: 'Preparing...'
  }))
  .with(P.union('confirmInWallet', 'switchChain'), () => ({
    onClick: onSubmit,
    disabled: false,
    children: 'Confirm in Wallet'
  }))
  .with(P.union('sent', 'prepared', 'idle'), () => ({
    onClick: onSubmit,
    disabled: false,
    children: 'Open Wallet'
  }))
  .otherwise(() => ({
    onClick: onSubmit,
    disabled: false,
    children: 'Open Wallet'
  }))

  return (
    <>
      <Dialog.Heading title='Confirm Details' />
      <Dialog.Content>
        <img src={walletIcon} alt='wallet' />
        <div>Double check these details before confirming in your wallet.</div>
        <LoadBar status={status} />
        { items.map(({ type, value}) => <DetailItem key={type} label={type}>{value}</DetailItem>)}
      </Dialog.Content>
      <Dialog.Footer
        leading={<Button colorStyle='accentSecondary'>Back</Button>}
        trailing={<Button {...buttonProps} />}
      />
    </>
  )
}
