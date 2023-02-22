import { Box, BoxProps, Image, ImageProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

type ParagraphWithImgProps = BoxProps & {
  children: ReactNode;
  src: string;
  alt: string;
  direction?: 'left' | 'right';
  imgProps?: ImageProps;
};

export const ParagraphWithImg = ({
  children,
  src,
  alt,
  direction = 'right',
  imgProps,
  ...rest
}: ParagraphWithImgProps) => (
  <Box alignItems="center" justifyContent="center" {...rest}>
    <Image
      src={src}
      alt={alt}
      float={direction}
      m={direction === 'right' ? '0 0 10px 10px' : '0 10px 10px 0'}
      {...imgProps}
    />
    {children}
  </Box>
);
