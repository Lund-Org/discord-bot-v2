import { AspectRatio } from '@chakra-ui/react';

export const Video = ({
  src,
  type,
  isCentered,
}: {
  src: string;
  type: string;
  isCentered: boolean;
}) => (
  <AspectRatio ratio={16 / 9} maxW="800px" mx={isCentered ? 'auto' : ''}>
    <video controls width="100%">
      <source src={src} type={type} />
    </video>
  </AspectRatio>
);
