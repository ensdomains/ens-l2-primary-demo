import { commonVars, modeVars } from "@ensdomains/thorin"
import { style } from "@vanilla-extract/css"

export const divider = style({
  borderTop: `1px solid ${modeVars.color.border}`,
  width: commonVars.space.full
})