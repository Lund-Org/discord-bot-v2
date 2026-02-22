import { AspectRatio } from '@chakra-ui/react';

export const Video = ({
  src,
  type,
  isCentered,
  external = false,
}: {
  src: string;
  type: string;
  isCentered: boolean;
  external?: boolean;
}) => (
  <AspectRatio ratio={16 / 9} maxW="800px" mx={isCentered ? 'auto' : ''}>
    <video controls width="100%">
      <source
        src={
          external ||
          src?.startsWith(process.env.NEXT_PUBLIC_CDN_URL || '') ||
          src?.startsWith(process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '')
            ? src
            : `${process.env.NEXT_PUBLIC_CDN_URL}${src}`
        }
        type={type}
      />
    </video>
  </AspectRatio>
);
