import { commonVars } from "@ensdomains/thorin"
import { style } from "@vanilla-extract/css"

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  width: commonVars.space.full,
  gap: commonVars.space['4'],
})

export const loading = style({
  height: commonVars.space['20'],
  width: commonVars.space.full,
  borderRadius: commonVars.radii.large,
})