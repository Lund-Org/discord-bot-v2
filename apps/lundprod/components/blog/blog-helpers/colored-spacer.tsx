import { Box, BoxProps } from '@chakra-ui/react';

type ColoredSpacerProps = {
  spacerBorder?: string;
} & BoxProps;

export const ColoredSpacer = ({
  spacerBorder = 'var(--chakra-colors-orange-400)',
  ...rest
}: ColoredSpacerProps) => (
  <Box
    h="10px"
    bg={`repeating-linear-gradient(-45deg,hsla(0,0%,100%,0),hsla(0,0%,100%,0) 6px,${spacerBorder} 0,${spacerBorder} 8px)`}
    {...rest}
  />
);
