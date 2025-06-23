import { globalStyle } from '@vanilla-extract/css';
import { modeVars, commonVars } from '@ensdomains/thorin';

globalStyle(':root', {
      backgroundColor: modeVars.color.greySurface,
      margin: '0 auto',
      maxWidth: '620px',
      padding: commonVars.space['4'],
      fontFamily: commonVars.fonts.sans
    }
);
