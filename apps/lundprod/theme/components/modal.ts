import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialogContainer: {
    maxH: '100dvh',
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});
