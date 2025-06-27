import { Typography } from "@ensdomains/thorin"

import { Helper } from "@ensdomains/thorin"

export const ChangeAddressView = ({
  subtitle,
  subtitle2,
  helperText,
}: {
  subtitle: React.ReactNode
  subtitle2: React.ReactNode
  helperText: React.ReactNode
}) => {
  return (
    <>
      {subtitle && <Typography textAlign='center'>{subtitle}</Typography>}
      {subtitle2 && <Typography textAlign='center'>{subtitle2}</Typography>}
      <Helper alert='info' alignment='vertical' textAlign={"center"}>
        {helperText}
      </Helper>
    </>
  )
}
