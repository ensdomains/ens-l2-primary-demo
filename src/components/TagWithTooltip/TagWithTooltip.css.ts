import { style } from "@vanilla-extract/css"

export const tagWithTooltip = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  position: 'relative',
  cursor: 'pointer',
})

export const tagWithTooltipIcon = style({
  width: '14px',
  height: '14px'
})