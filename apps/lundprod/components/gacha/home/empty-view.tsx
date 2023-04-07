import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Heading, Image } from '@chakra-ui/react';

import { arrowRightUp } from '~/lundprod/assets';

export const EmptyView = () => (
  <Box px="10%" flex={1} pt="30px">
    <Box color="blue.300" ml="-40px">
      <Image
        src={arrowRightUp.src}
        alt="Indication filtre"
        transform="rotate(-90deg)"
        w="50px"
      />
    </Box>
    <Heading mb="80px">Filtre</Heading>
    <Heading>Choisis une carte</Heading>
    <Box color="blue.300" ml="-40px">
      <Image
        src={arrowRightUp.src}
        alt="Indication filtre"
        transform="rotate(-90deg) scale(-1, 1)"
        w="50px"
      />
    </Box>
    <Box fontSize="30px" textAlign="center" mt="60px">
      <InfoOutlineIcon mr="10px" />
      Les détails apparaitront ici
    </Box>
  </Box>
);
