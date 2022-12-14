import { Box, Image } from '@chakra-ui/react';

type CardProps = {
  imageUrl: string;
  type: 'basic' | 'gold';
};

const Card = ({ imageUrl, type = 'basic' }: CardProps) => {
  const filename = `${type}-${imageUrl}`;

  return (
    <Box>
      <Image src={`/card-images/${filename}`} alt={filename} mx="auto" />
    </Box>
  );
};

export default Card;
