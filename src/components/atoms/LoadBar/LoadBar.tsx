import { AeroplaneSVG, CheckSVG, commonVars } from "@ensdomains/thorin"
import {
  container,
  innerContainer,
  iconContainer,
  aeroplaneIcon,
  tickIcon,
} from "./LoadBar.css"
import { match, P } from "ts-pattern"
import { useEffect } from "react"
import { useTransactionProgressValue } from "@/hooks/useTransactionProgressValue"

export type Status =
  | "preparing"
  | "prepared"
  | "confirmInWallet"
  | "sent"
  | "confirmed"
  | "failed"

export const LoadBar = ({ status }: { status: Status }) => {
  const value = useTransactionProgressValue({ status })

  const containerVariant = match(status)
    .with("failed", () => "failed" as const)
    .otherwise(() => "normal" as const)

  const innerContainerVariant = match(status)
    .with("confirmed", () => "confirmed" as const)
    .with("sent", () => "sent" as const)
    .with(
      P.union("confirmInWallet", "preparing", "prepared"),
      () => "idle" as const,
    )
    .with("failed", () => "failed" as const)
    .otherwise(() => "idle" as const)

  useEffect(() => {})

  return (
    <div className={container[containerVariant]}>
      <div
        className={innerContainer[innerContainerVariant]}
        style={{ width: `calc(${commonVars.space["9"]} + ${value}%)` }}
      >
        <div className={iconContainer}>
          {status === "confirmed" ? (
            <CheckSVG className={tickIcon} />
          ) : (
            <AeroplaneSVG className={aeroplaneIcon} />
          )}
        </div>
      </div>
    </div>
  )
}
