import { Text } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

export const Spoiler = ({ children }: { children: ReactNode }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <Text
      as="span"
      px={2}
      bg="gray.900"
      cursor={isRevealed ? 'cursor' : 'pointer'}
      color={isRevealed ? 'inherit' : 'gray.900'}
      onClick={() => setIsRevealed(true)}
    >
      {children}
    </Text>
  );
};
