import { useEffect, useState } from "react"

export const useCopied = () => {
  const [copied, setCopied] = useState(false)

  const copy = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(true)
  }

  useEffect(() => {
    let timeout: number
    if (copied) {
      timeout = window.setTimeout(() => setCopied(false), 1500)
    }
    return () => clearTimeout(timeout)
  }, [copied])

  return { copy, copied }
}