import { commonVars } from '@ensdomains/thorin';
import { style } from '@vanilla-extract/css';

export const layout = style({
  display: 'flex',
  flexDirection: 'column',
  gap: commonVars.space['4'],
});