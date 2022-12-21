import { Box, BoxProps } from '@chakra-ui/react';
import { CardWithFusionDependencies } from '../../../utils/types';
import { ScrollContainer } from '../../scroll-container';
import { CardListElement } from '../card-list-element';

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
