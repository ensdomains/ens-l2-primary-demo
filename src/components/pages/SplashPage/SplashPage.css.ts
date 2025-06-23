import { commonVars, modeVars } from "@ensdomains/thorin"
import { style } from "@vanilla-extract/css"

export const splashPage = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  '@media': {
    'screen and (min-width: 768px)': {
      padding: commonVars.space['8'],
    },
  },
})

export const card = style({
  padding: "1rem",
  borderRadius: commonVars.radii.large,
  backgroundColor: modeVars.color.background,
  display: "flex",
  flexDirection: "column",
  gap: commonVars.space['4'],
  '@media': {
    'screen and (min-width: 768px)': {
      padding: commonVars.space['8'],
    },
  },
})

export const chainIcons = style({
  display: "flex",
  flexDirection: "row",
  gap: commonVars.space['4'],
  justifyContent: "center",
  flexWrap: "wrap",
})

export const chainIcon = style({
  width: commonVars.space['10'],
  height: commonVars.space['10'],
  display: "block"
})