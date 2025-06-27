import { style } from '@vanilla-extract/css';
import { commonVars, modeVars } from '@ensdomains/thorin';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: commonVars.space['6'],
  width: '100%',
});

export const header = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: modeVars.color.background,
  borderRadius: commonVars.radii.card,
  border: `1px solid ${modeVars.color.border}`,
}); 

export const listHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${modeVars.color.border}`,
  padding: commonVars.space['6'],
});

export const listHeaderActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: commonVars.space['2'],
});


export const listItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  padding: commonVars.space['4'],
  gap: commonVars.space['4'],
  selectors: {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${modeVars.color.border}`,
    },
  },
});
