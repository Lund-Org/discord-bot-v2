import { defineStyleConfig } from '@chakra-ui/react';

const variants = {
  h1: {
    fontSize: '2.5rem',
    lineHeight: '3.5rem',
    my: '15px',
  },
  h2: {
    fontSize: '2.25rem',
    lineHeight: '3.25rem',
    my: '12px',
  },
  h3: {
    fontSize: '2rem',
    lineHeight: '3rem',
    my: '10px',
  },
  h4: {
    fontSize: '1.75rem',
    lineHeight: '2.75rem',
    my: '7px',
  },
  h5: {
    fontSize: '1.5rem',
    lineHeight: '2.5rem',
    my: '3px',
  },
  h6: {
    fontSize: '1.25rem',
    lineHeight: '2.25rem',
  },
};

export type HeadingVariant = keyof typeof variants;

export const Heading = defineStyleConfig({
  baseStyle: {
    color: 'gray.100',
    fontWeight: 700,
  },
  variants,
});
