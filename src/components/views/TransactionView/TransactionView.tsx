import {
  Dialog,
  Helper,
  Typography,
} from "@ensdomains/thorin"
import walletIcon from "@/assets/wallet.svg"
import {
  detailItem,
  detailItemLabel,
  transactionMessage,
} from "./TransactionView.css"
import { LoadBar, Status } from "@/components/atoms/LoadBar/LoadBar"
import { match, P } from "ts-pattern"
import { useTransactionStore } from "@/stores/transactionStore"
import { getPreTransactionError } from "@/utils/error"
import { ButtonWithBackButton } from "@/components/molecules/ButtonWithBackButton/ButtonWithBackButton"

const DetailItem = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => {
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
  items,
  status,
  error,
  onSubmit,
  onRetry,
  onNext,
  onBack,
}: {
  status: Status
  error?: Error | null
  items: {
    type: "address" | "name" | "action" | "records"
    value: string
  }[]
  onSubmit: () => void
  onRetry: () => void
  onNext: () => void
  onBack: () => void
}) => {
  const { hasNext } = useTransactionStore()

  const buttonProps = match(status)
    .with("confirmed", () => ({
      onClick: onNext,
      disabled: false,
      children: hasNext() ? "Next" : "Done",
    }))
    .with(P.union("preparing"), () => ({
      onClick: onSubmit,
      disabled: true,
      children: "Preparing...",
    }))
    .with(P.union("confirmInWallet"), () => ({
      onClick: onSubmit,
      disabled: true,
      children: "Confirm in Wallet",
    }))
    .with(P.union("prepared"), () => ({
      onClick: onSubmit,
      disabled: false,
      children: "Open Wallet",
    }))
    .with("sent", () => ({
      onClick: onSubmit,
      disabled: true,
      loading: true,
      children: "Sent",
    }))
    .with("failed", () => ({
      onClick: onRetry,
      disabled: false,
      children: "Retry",
      colorStyle: "redPrimary",
    }))
    .exhaustive()

  const errorMsg = getPreTransactionError({ error })

  return (
    <>
      <Dialog.Heading title='Confirm Details' />
      <Dialog.Content>
        <img src={walletIcon} alt='wallet' />
        <div className={transactionMessage}>
          <Typography fontVariant='body' color='textPrimary'>
            Double check these details before confirming in your wallet.
          </Typography>
        </div>
        <LoadBar status={status} />
        {items.map(({ type, value }) => (
          <DetailItem key={type} label={type}>
            {value}
          </DetailItem>
        ))}
        {errorMsg && (
          <Helper alert='error'>
            <Typography fontVariant='body' color='textPrimary'>
              {errorMsg.message}
            </Typography>
          </Helper>
        )}
      </Dialog.Content>
      <Dialog.Footer
        trailing={<ButtonWithBackButton {...buttonProps} onBack={onBack} />}
      />
    </>
  )
}
