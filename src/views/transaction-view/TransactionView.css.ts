import { modeVars } from "@ensdomains/thorin"
import { commonVars } from "@ensdomains/thorin"
import { style } from "@vanilla-extract/css"

export const transactionView = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
})

// Detail item
export const detailItem = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: commonVars.space['3'],
  border: `1px solid ${modeVars.color.border}`,
  borderRadius: commonVars.radii.large,
  padding: commonVars.space['4'],
  background: modeVars.color.background,
  width: commonVars.space.full
})

export const detailItemLabel = style({
  textTransform: 'capitalize',
  width: commonVars.space['16'],
})

export const footer = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "stretch",
  gap: commonVars.space['3'],

})
