import { style } from '@vanilla-extract/css';
import { commonVars, modeVars } from '@ensdomains/thorin';

export const container = style({
  height: commonVars.space[8],
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: commonVars.space[8],
});

export const title = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: commonVars.space[2],
});

export const icon = style({
  width: commonVars.space[8],
  height: commonVars.space[8],
});

// No Name Set
export const noneSet = style({
  borderRadius: commonVars.radii.large,
  borderColor: modeVars.color.border,
  borderWidth: commonVars.borderWidths['1x'],
  borderStyle: 'solid',
  background: modeVars.color.backgroundPrimary,
  color: modeVars.color.textSecondary,
  height: commonVars.space['12'],
  padding: `${commonVars.space['2']} ${commonVars.space['4']}`,
  display: 'flex',
  alignItems: 'center',
});

export const loadingItem = style({
  height: commonVars.space['12'],
  width: commonVars.space.full,
  borderRadius: commonVars.radii.large,
})

// Name RecordItem
export const recordItemContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'stretch',
  gap: commonVars.space['2'],
})

export const recordItemContentContainer = style({
  height: commonVars.space['12'],
  borderRadius: commonVars.radii.large,
  borderColor: modeVars.color.border,
  borderWidth: commonVars.borderWidths['1x'],
  borderStyle: 'solid',
  background: modeVars.color.backgroundPrimary,
  color: modeVars.color.textSecondary,
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: commonVars.space['2'],  
  padding: commonVars.space['2'],
  cursor: 'pointer',
  transition: 'background 0.30s ease-in-out',
  ':hover': {
    background: modeVars.color.backgroundSecondary,
  },
})

export const recordItemContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: commonVars.space['2'],
})

export const recordItemText = style({
  display: 'flex',
  flexDirection: 'column',
})

export const recordItemIcon = style({
  display: 'block',
  width: commonVars.space['3'],
  height: commonVars.space['3'],
})

export const recordItemActionIcon = style({
  display: 'block',
  width: commonVars.space['3'],
  height: commonVars.space['3'],
})

// Label
export const labelContainer = style({
  height: commonVars.space['5'],
  color: modeVars.color.textSecondary,
  fontSize: commonVars.fontSizes.body,
  fontWeight: commonVars.fontWeights.bold,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const contentContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: commonVars.space['2'],
})

// Supported Chains
export const supportedChainsContainer = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: commonVars.space['2'],
})

export const supportedChainItemContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: commonVars.space['2'],
  border: `1px solid ${modeVars.color.border}`,
  borderRadius: commonVars.radii.large,
  padding: `${commonVars.space['1']} ${commonVars.space['2']}`,
})

export const supportedChainItemIcon = style({
  width: commonVars.space['3'],
  height: commonVars.space['3'],
})