import {
  Box,
  Button,
  Flex,
  FlexProps,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { AllCards, filterCards } from '~/lundprod/utils/filters';
import { CardsToGoldType, Filters } from '~/lundprod/utils/types';
import { CardListElement } from '../../gacha/card-list-element';
import { ScrollContainer } from '../../scroll-container';
import { FilterMenu } from '../../gacha/filter-menu';

type CardToGoldListProps = {
  cardsToGold: CardsToGoldType;
} & FlexProps;

export const CardToGoldList = ({
  cardsToGold,
  ...rest
}: CardToGoldListProps) => {
  const [cardToGoldFilter, setCardToGoldFilter] = useState<Filters>({
    gold: false,
    fusion: false,
    filterStars: AllCards,
    search: '',
  });

  const toGoldCards = useMemo(() => {
    return filterCards(
      cardsToGold.map(({ cardType, total }) => {
        return { ...cardType, total };
      }),
      cardToGoldFilter
    );
  }, [cardsToGold, cardToGoldFilter]);

  return (
    <Box {...rest}>
      <Flex alignItems="center">
        <Heading>Carte à golder</Heading>
        <Popover placement="bottom-end" autoFocus={false}>
          <PopoverTrigger>
            <Button variant="solid" bg="cyan.900" ml="auto" size="sm">
              Filtres
            </Button>
          </PopoverTrigger>
          <PopoverContent w="auto" p="10px" bg="gray.900">
            <PopoverArrow />
            <PopoverBody>
              <FilterMenu
                filters={cardToGoldFilter}
                updateFilters={setCardToGoldFilter}
                withGoldFilter={false}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <ScrollContainer
        mt="10px"
        maxH="500px"
        overflow="auto"
        border="1px solid"
        borderColor="gray.500"
        p="5px"
        borderRadius="6px"
      >
        {toGoldCards.length === 0 && <Text>Aucune carte</Text>}
        {toGoldCards.map((card) => (
          <CardListElement
            key={card.id}
            cursor="initial"
            card={card}
            label={`#${card.id} - ${card.name} (x${card.total})`}
          />
        ))}
      </ScrollContainer>
    </Box>
  );
};
