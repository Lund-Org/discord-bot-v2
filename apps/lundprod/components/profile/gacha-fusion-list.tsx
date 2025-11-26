import { Box, BoxProps, Heading } from '@chakra-ui/react';

import { CardWithFusionDependencies } from '~/lundprod/utils/types';

import { CardListElement } from '../gacha/card-list-element';
import { ScrollContainer } from '../scroll-container';
import { useTranslation } from 'react-i18next';

type GachaFusionListProps = {
  fusionCards: CardWithFusionDependencies[];
} & BoxProps;

export const GachaFusionList = ({
  fusionCards,
  ...rest
}: GachaFusionListProps) => {
  const { t } = useTranslation();

  if (fusionCards.length === 0) {
    return null;
  }

  return (
    <Box {...rest}>
      <Heading>{t('profile.gacha.fusions')}</Heading>
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
