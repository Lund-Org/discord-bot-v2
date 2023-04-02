import { Box, BoxProps } from '@chakra-ui/react';

import { CardWithFusionDependencies } from '~/lundprod/utils/types';

import { CardListElement } from '../../gacha/card-list-element';
import { ScrollContainer } from '../../scroll-container';

type FusionListProps = {
  fusionCards: CardWithFusionDependencies[];
} & BoxProps;

export const FusionList = ({ fusionCards, ...rest }: FusionListProps) => {
  if (fusionCards.length === 0) {
    return null;
  }

  return (
    <Box {...rest}>
      <ScrollContainer
        mt="10px"
        maxH="500px"
        overflow="auto"
        border="1px solid"
        borderColor="gray.500"
        p="5px 15px"
        borderRadius="6px"
      >
        {fusionCards.map((card) => (
          <CardListElement
            key={card.id}
            cursor="initial"
            card={card}
            label={`#${card.id} - ${card.name}`}
          />
        ))}
      </ScrollContainer>
    </Box>
  );
};
