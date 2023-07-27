import { extendTheme, theme as chakraTheme } from '@chakra-ui/react';

import * as components from './components';

export const theme = extendTheme({
  ...chakraTheme,
  config: {
    ...chakraTheme.config,
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    ...chakraTheme.components,
    ...components,
  },
});
