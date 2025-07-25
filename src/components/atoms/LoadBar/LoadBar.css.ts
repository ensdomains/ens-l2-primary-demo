import { commonVars, modeVars } from '@ensdomains/thorin';
import { style, styleVariants } from '@vanilla-extract/css';

export const containerBase = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: commonVars.space['9'],
  borderRadius: commonVars.radii.full,
});

export const container = styleVariants({
  normal: [containerBase, {
    background: modeVars.color.accentSurface,
  }],
  failed: [containerBase, {
    background: modeVars.color.redSurface,
  }],
})

export const innerContainerBase = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  background: modeVars.color.accentPrimary,
  height: commonVars.space['9'],
  // animation: `${fly} 45s linear forwards`,
  borderRadius: commonVars.radii.full,
  width: commonVars.space['9'],
  transition: 'width 0.3s linear',
  maxWidth: '100%',
});

export const innerContainer = styleVariants({
  idle: [innerContainerBase, {
    animationPlayState: 'paused',
  }],
  sent: [innerContainerBase, {
    animationPlayState: 'running',
  }],
  confirmed: [innerContainerBase, {
    animationDelay: '-40s',
    background: modeVars.color.greenPrimary,
  }],
  failed: [innerContainerBase, {
    background: modeVars.color.redPrimary,
  }],
});

export const iconContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: commonVars.space['9'],
  height: commonVars.space['9'],
});

export const aeroplaneIcon = style({
  display: 'block',
  width: commonVars.space['4'],
  height: commonVars.space['4'],
  color: modeVars.color.background,
});


export const tickIcon = style({
  display: 'block',
  width: commonVars.space['4'],
  height: commonVars.space['4'],
  color: modeVars.color.background,
});
