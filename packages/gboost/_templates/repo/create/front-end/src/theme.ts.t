---
to: front-end/src/theme.ts
---

import { createTheme, config } from "gb-lib/front/stitches.config";
// import {
//   crimson,
//   crimsonA,
//   indigo,
//   indigoA,
//   mauve,
//   mauveA,
// } from "@radix-ui/colors";

// Example Theme
export const theme = createTheme({
  ...config.theme,
  colors: {
    ...config.theme.colors,
    // First, select a primary and secondary colors: https://www.radix-ui.com/docs/colors/palette-composition/composing-a-palette#choosing-a-brand-scale
    // explicitly typing out colors improves DX via TS intellisense
    // primary1: crimson.crimson1,
    // primary2: crimson.crimson2,
    // primary3: crimson.crimson3,
    // primary4: crimson.crimson4,
    // primary5: crimson.crimson5,
    // primary6: crimson.crimson6,
    // primary7: crimson.crimson7,
    // primary8: crimson.crimson8,
    // primary9: crimson.crimson9,
    // primary10: crimson.crimson10,
    // primary11: crimson.crimson11,
    // primary12: crimson.crimson12,
    // primaryA1: crimsonA.crimsonA1,
    // primaryA2: crimsonA.crimsonA2,
    // primaryA3: crimsonA.crimsonA3,
    // primaryA4: crimsonA.crimsonA4,
    // primaryA5: crimsonA.crimsonA5,
    // primaryA6: crimsonA.crimsonA6,
    // primaryA7: crimsonA.crimsonA7,
    // primaryA8: crimsonA.crimsonA8,
    // primaryA9: crimsonA.crimsonA9,
    // primaryA10: crimsonA.crimsonA10,
    // primaryA11: crimsonA.crimsonA11,
    // primaryA12: crimsonA.crimsonA12,
    // secondary1: indigo.indigo1,
    // secondary2: indigo.indigo2,
    // secondary3: indigo.indigo3,
    // secondary4: indigo.indigo4,
    // secondary5: indigo.indigo5,
    // secondary6: indigo.indigo6,
    // secondary7: indigo.indigo7,
    // secondary8: indigo.indigo8,
    // secondary9: indigo.indigo9,
    // secondary10: indigo.indigo10,
    // secondary11: indigo.indigo11,
    // secondary12: indigo.indigo12,
    // secondaryA1: indigoA.indigoA1,
    // secondaryA2: indigoA.indigoA2,
    // secondaryA3: indigoA.indigoA3,
    // secondaryA4: indigoA.indigoA4,
    // secondaryA5: indigoA.indigoA5,
    // secondaryA6: indigoA.indigoA6,
    // secondaryA7: indigoA.indigoA7,
    // secondaryA8: indigoA.indigoA8,
    // secondaryA9: indigoA.indigoA9,
    // secondaryA10: indigoA.indigoA10,
    // secondaryA11: indigoA.indigoA11,
    // secondaryA12: indigoA.indigoA12,
    // Next, select matching gray scale: https://www.radix-ui.com/docs/colors/palette-composition/composing-a-palette#choosing-a-gray-scale
    // gray1: mauve.mauve1,
    // gray2: mauve.mauve2,
    // gray3: mauve.mauve3,
    // gray4: mauve.mauve4,
    // gray5: mauve.mauve5,
    // gray6: mauve.mauve6,
    // gray7: mauve.mauve7,
    // gray8: mauve.mauve8,
    // gray9: mauve.mauve9,
    // gray10: mauve.mauve10,
    // gray11: mauve.mauve11,
    // gray12: mauve.mauve12,
    // grayA1: mauveA.mauveA1,
    // grayA2: mauveA.mauveA2,
    // grayA3: mauveA.mauveA3,
    // grayA4: mauveA.mauveA4,
    // grayA5: mauveA.mauveA5,
    // grayA6: mauveA.mauveA6,
    // grayA7: mauveA.mauveA7,
    // grayA8: mauveA.mauveA8,
    // grayA9: mauveA.mauveA9,
    // grayA10: mauveA.mauveA10,
    // grayA11: mauveA.mauveA11,
    // grayA12: mauveA.mauveA12,
    // optionally change success, info, warn, and error colors which are set
    // by default to green, blue, yellow, and red
  },
});
