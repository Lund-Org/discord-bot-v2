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
import { ScrollContainer } from '../../scroll-container';
import { AllCards, filterCards } from '../../../utils/filters';
import { Filters, ProfileType } from '../../../utils/types';
import { CardListElement } from '../card-list-element';
import { CardType, PlayerInventory } from '@prisma/client';
import { FilterMenu } from '../filter-menu';

type InventoryListProps = {
  profile: ProfileType;
} & FlexProps;

export const InventoryList = ({ profile, ...rest }: InventoryListProps) => {
  const [inventoryFilter, setInventoryFilter] = useState<Filters>({
    gold: false,
    fusion: false,
    filterStars: AllCards,
    search: '',
  });

  const [basicCards, goldCards] = useMemo(() => {
    const filteredBasicInventories = profile.playerInventory.filter(
      (x) => x.type === 'basic'
    );
    const filteredGoldInventories = profile.playerInventory.filter(
      (x) => x.type === 'gold'
    );

    const filterCardsByFilter = (
      sourceCards: (PlayerInventory & {
        cardType: CardType;
      })[]
    ) => {
      return filterCards(
        sourceCards.map(({ cardType, total }) => {
          return { ...cardType, total };
        }),
        inventoryFilter
      );
    };

    return [
      filterCardsByFilter(filteredBasicInventories),
      filterCardsByFilter(filteredGoldInventories),
    ];
  }, [profile, inventoryFilter]);

  return (
    <Box {...rest}>
      <Flex alignItems="center">
        <Heading>Inventaire</Heading>
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
                filters={inventoryFilter}
                updateFilters={setInventoryFilter}
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
        {basicCards.length + goldCards.length === 0 && (
          <Text>Aucune carte</Text>
        )}
        {basicCards.map((basicCard) => (
          <CardListElement
            key={basicCard.id}
            cursor="initial"
            card={basicCard}
            label={`#${basicCard.id} - ${basicCard.name} (x${basicCard.total})`}
          />
        ))}
        {goldCards.map((goldCard) => (
          <CardListElement
            key={goldCard.id}
            cursor="initial"
            color="yellow.500"
            card={goldCard}
            label={`#${goldCard.id} - ${goldCard.name} (x${goldCard.total})`}
          />
        ))}
      </ScrollContainer>
    </Box>
  );
};
