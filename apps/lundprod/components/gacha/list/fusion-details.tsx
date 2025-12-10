import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useGachaHome } from '~/lundprod/contexts/gacha-home-context';
import { CardWithFusionDependencies } from '~/lundprod/utils/types';

import { CardListElement } from '../card-list-element';

export const FusionDetails = ({
  card,
}: {
  card: CardWithFusionDependencies;
}) => {
  const { t } = useTranslation();
  const { cards, selectCard } = useGachaHome();
  const clickOnCard = (cardClicked: CardWithFusionDependencies) => {
    selectCard(cardClicked);
  };
  const fusionDependencies = card.fusionDependencies.map((fusionDep) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const augmentedDepCard = cards.find((card) => card.id === fusionDep.id)!;

    return augmentedDepCard;
  });

  return (
    <Box py="20px">
      <Heading as="h5">{t('gacha.list.fusionComponents')}</Heading>
      <UnorderedList listStyleType="none">
        {fusionDependencies.map((fusionDependency, index) => (
          <ListItem key={index} onClick={() => clickOnCard(fusionDependency)}>
            <CardListElement card={fusionDependency} />
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};
