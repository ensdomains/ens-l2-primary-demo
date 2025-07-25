import { commonVars } from '@ensdomains/thorin';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  display: 'flex',
  gap: commonVars.space['2'],
});