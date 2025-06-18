import { Status } from "@/components/atoms/LoadBar/LoadBar";
import { useEffect, useState } from "react";

export const useTransactionProgressValue = ({ status}: {status: Status}) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (status === "prepared") {
      setValue(0)
    }
    if (status === "confirmed") {
      setValue(100)
    }
    if (status === "sent") {
      const interval = setInterval(() => setValue((_value) => Math.min(_value + 2, 80)), 300)
      return () => clearInterval(interval)
    }
  }, [status])

  return value
}