import { Button, ButtonProps, LeftArrowSVG } from "@ensdomains/thorin"
import * as styles from "./ButtonWithBackButton.css"

export type ButtonWithBackButtonProps = ButtonProps & {
  onBack?: () => void
}

export const ButtonWithBackButton = ({
  onBack,
  ...buttonProps
}: ButtonWithBackButtonProps) => {
  return (
    <div className={styles.container}>
      <Button
        colorStyle="accentSecondary"
        shape="square"
        onClick={onBack}>
        <LeftArrowSVG style={{ width: "1rem", height: "1rem" }} />      
      </Button>
      <Button {...buttonProps} />
    </div>
  )
}