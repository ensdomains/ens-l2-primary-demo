import React, { useEffect } from 'react'
import { useConfig } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useTransactionStore } from '@/stores/transactionStore'

export const TransactionStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useConfig()
  const queryClient = useQueryClient()
  const { setConfig, setQueryClient, syncAllTransactions } = useTransactionStore()

  useEffect(() => {
    setConfig(config)
  }, [config, setConfig])

  useEffect(() => {
    setQueryClient(queryClient)
  }, [queryClient, setQueryClient])

  useEffect(() => {
    const interval = setInterval(() => {
      syncAllTransactions()
    }, 15000)
    return () => clearInterval(interval)
  }, [syncAllTransactions])

  return <>{children}</>
} 