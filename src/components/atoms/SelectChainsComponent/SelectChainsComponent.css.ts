import { commonVars, modeVars } from "@ensdomains/thorin"
import { globalStyle, style, styleVariants } from "@vanilla-extract/css"

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 16,
  width: commonVars.space.full
})

// chain option

export const chainOption = style({
  display: "flex",
  alignItems: "center",
  gap: commonVars.space['2'],
  padding: commonVars.space['4'],
  border: `1px solid ${modeVars.color.border}`,
  borderRadius: commonVars.radii.large,
  transition: "all 0.3s ease-in-out",
})

export const chainOptionVariant = styleVariants({
  unchecked: [chainOption, {
    background: modeVars.color.background,
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-1px)",
    }
  }],
  checked: [chainOption, {
    background: modeVars.color.accentSurface,
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-1px)",
    }
  }],
  uncheckedDisabled: [chainOption, {
    background: modeVars.color.greySurface,
    cursor: "not-allowed",
    pointerEvents: "none",
  }],
  checkedDisabled: [chainOption, {
    background: modeVars.color.greySurface,
    cursor: "not-allowed",
  }]
})

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: 16,
})

export const iconContainer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: commonVars.space['7'],
  height: commonVars.space['7'],
  borderRadius: commonVars.radii.full,
  border: `1px solid ${modeVars.color.border}`,
})

export const icon = style({
  width: commonVars.space['7'],
  height: commonVars.space['7'],
  transition: "all 0.3s ease-in-out",
})

export const iconVariant = styleVariants({
  checked: [icon, {
    filter: "grayscale(0%)",
    opacity: 1,
  }],
  unchecked: [icon, {
    opacity: 0,
    filter: 'grayscale(100%)',
  }],
  checkedDisabled: [icon, {
    filter: "grayscale(100%)",
    opacity: 0.5,
  }],
  uncheckedDisabled: [icon, {
    filter: "grayscale(100%)",
    opacity: 0,
  }]
})

globalStyle(`${chainOptionVariant['unchecked']}:hover ${icon}`, {
    opacity: 1,
    filter: "grayscale(100%)",
})
