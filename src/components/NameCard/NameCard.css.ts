import { commonVars, modeVars } from "@ensdomains/thorin"
import { style } from "@vanilla-extract/css"

// Name Card Record Item
export const recordItemContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: commonVars.space['1'],
})

export const recordItemLabel = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: commonVars.space['2'],
  padding: `0 ${commonVars.space['2']}`,
})

export const recordItemValue = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: commonVars.space['2'],
  height: commonVars.space['8'],
  border: `1px solid ${modeVars.color.border}`,
  borderRadius: commonVars.radii.large,
  padding: `0 ${commonVars.space['2']}`,
})

export const recordItemLogo = style({
  width: commonVars.space['4'],
  height: commonVars.space['4'],
})

export const chainList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: commonVars.space['4'],
})