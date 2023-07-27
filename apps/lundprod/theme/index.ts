import { extendTheme, theme as chakraTheme } from '@chakra-ui/react';

import * as components from './components';

export const theme = extendTheme({
  ...chakraTheme,
  components: {
    ...chakraTheme.components,
    ...components,
  },
});
