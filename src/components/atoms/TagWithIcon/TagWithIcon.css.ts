import { commonVars } from "@ensdomains/thorin"
import { style } from "@vanilla-extract/css"

export const tagWithIcon = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  position: 'relative',
  cursor: 'pointer',
})

export const tagWithIconIcon = style({
  width: commonVars.space[3],
  height: commonVars.space[3],
})
