import { commonVars, modeVars } from "@ensdomains/thorin";
import { globalStyle, style } from "@vanilla-extract/css"

globalStyle(':root', {
  vars: {
    '--box-shadow-color': `rgba(0, 0, 0, 0.2)`
  }
})

globalStyle('html[data-theme="dark"]', {
  vars: {
    '--box-shadow-color': `rgba(255, 255, 255, 0.2)`
  }
})

export const anchorWrapper = style({
  position: 'relative',
  display: 'inline-block',
  cursor: 'pointer',
});

export const tooltipContainer = style({
  position: 'absolute',
  width: '200px',
  bottom: 'calc(100% + 10px)',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: modeVars.color.background,
  padding: `${commonVars.space['2']} ${commonVars.space['4']}`,
  borderRadius: commonVars.radii.large,
  zIndex: 1000,
  boxShadow: `0 2px 4px 0px var(--box-shadow-color)`,
});

export const tooltipArrowShadow = style({
  position: 'absolute',
  top: 'calc(100% + 1px)',
  left: '50%',
  transform: 'translateX(-50%)',
  borderLeft: '8px solid transparent',
  borderRight: '8px solid transparent',
  borderTop: `8px solid ${modeVars.color.greyLight}`,
  zIndex: -1,
});

export const tooltipArrow = style({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '0',
  height: '0',
  borderLeft: '8px solid transparent',
  borderRight: '8px solid transparent',
  borderTop: `8px solid ${modeVars.color.background}`,
});

export const tooltipText = style({
  // optional for finer styling
});

