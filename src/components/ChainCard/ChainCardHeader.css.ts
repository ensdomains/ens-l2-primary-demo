import { style } from '@vanilla-extract/css';
import { commonVars } from '@ensdomains/thorin';

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
