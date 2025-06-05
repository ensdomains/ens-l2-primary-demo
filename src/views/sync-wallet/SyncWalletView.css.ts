import { commonVars, modeVars } from "@ensdomains/thorin";
import { style } from "@vanilla-extract/css";

export const connectorOptionContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
  height: commonVars.space['12'],
  width: commonVars.space['full'],
  border: `1px solid ${modeVars.color.border}`,
  borderRadius: commonVars.radii.small,
  padding: commonVars.space['4'],
  background: modeVars.color.background,
  cursor: 'pointer',
  ':hover': {
    background: modeVars.color.backgroundHover,
  },
})

export const connectorOptionImage = style({
  width: commonVars.space['8'],
  height: commonVars.space['8'],
  borderRadius: commonVars.radii.small,
})
