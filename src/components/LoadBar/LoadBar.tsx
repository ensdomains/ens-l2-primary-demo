import { AeroplaneSVG, CheckSVG } from "@ensdomains/thorin"
import { container, innerContainer, iconContainer, aeroplaneIcon, tickIcon } from "./LoadBar.css"
import { match, P } from "ts-pattern"

export type Status =
  | "confirmed"
  | "sent"
  | "confirmInWallet"
  | "preparing"
  | "switchChain"
  | "prepared"
  | "idle"

export const LoadBar = ({ status = "idle" }: { status: Status }) => {
  const innerContainerVariant = match(status)
    .with("confirmed", () => "confirmed" as const)
    .with("sent", () => "sent" as const)
    .with(
      P.union("confirmInWallet", "preparing", "prepared", "switchChain", "idle"),
      () => "idle" as const,
    )
    .otherwise(() => "idle" as const)

  return (
    <div className={container}>
      <div className={innerContainer[innerContainerVariant]}>
        <div className={iconContainer}>
          { status === "confirmed" ? (
            <CheckSVG className={tickIcon}/>
          ) : (
            <AeroplaneSVG className={aeroplaneIcon}/>
          )}
        </div>
      </div>
    </div>
  )
}
