import { modeVars } from "@ensdomains/thorin";
import { keyframes, style } from "@vanilla-extract/css"

const shimmer = keyframes({
  '0%': {
    left: '-150px',
  },
  '100%': {
    left: '100%',
  },
});

export const skeleton = style({
  position: 'relative',
  background: modeVars.color.greySurface,
  overflow: 'hidden',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-150px',
      width: '150px',
      height: '100%',
      background: `linear-gradient(90deg, ${modeVars.color.greySurface} 0%, ${modeVars.color.greyLight} 50%, ${modeVars.color.greySurface} 100%)`,
      animation: `${shimmer} 1.5s infinite`,
    }
  }
})