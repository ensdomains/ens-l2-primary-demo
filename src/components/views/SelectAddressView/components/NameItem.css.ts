import { style } from '@vanilla-extract/css';
import { commonVars, modeVars } from '@ensdomains/thorin';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: commonVars.space['2'],
  padding: `${commonVars.space['2']} ${commonVars.space['4']}`,
  borderRadius: commonVars.radii.large,
  borderColor: modeVars.color.border,
  borderWidth: commonVars.borderWidths['1x'],
  borderStyle: 'solid',
  background: modeVars.color.backgroundPrimary,
  color: modeVars.color.textSecondary,
  height: commonVars.space['20'],
  cursor: 'pointer',
  transition: 'background 0.30s ease-in-out',
  ':hover': {
    background: modeVars.color.backgroundSecondary,
  },
});

export const content = style({
  display: 'flex',
  alignItems: 'center',
  gap: commonVars.space['2'],
  flex: 1,
});

export const text = style({
  display: 'flex',
  flexDirection: 'column',
});

export const icon = style({
  display: 'block',
  width: commonVars.space['4'],
  height: commonVars.space['4'],
});

export const actionIcon = style({
  display: 'block',
  width: commonVars.space['4'],
  height: commonVars.space['4'],
});

export const coinContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: commonVars.space['1'],
});
