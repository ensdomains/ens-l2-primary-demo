import { useTransactionStore } from "@/stores/transactionStore"
import { useEffect } from "react"

export const TransactionStoreWatcher = ({ children }: { children: React.ReactNode }) => {
  const { transactions } = useTransactionStore()

  useEffect(() => {
    console.warn('transactions', transactions)
  }, [transactions])

  return (
    <>
      {children}
    </>
  )
}