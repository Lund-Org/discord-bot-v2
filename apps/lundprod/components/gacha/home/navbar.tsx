import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
} from '@chakra-ui/react';

import { useGachaHome } from '~/lundprod/contexts/gacha-home-context';

import { CardListElement } from '../card-list-element';
import { FilterMenu } from '../filter-menu';
import { CardPreviewContainer } from './card-preview-container';

export const Navbar = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const {
    filters,
    updateFilters,
    filterPanelState,
    toggleFilterPanelState,
    filteredCards,
    cardSelected,
    selectCard,
  } = useGachaHome();
  const toggleFilter = () => {
    toggleFilterPanelState();
    if (isMobile && !filterPanelState) {
      selectCard(null);
    }
  };

  return (
    <Box
      maxW={isMobile ? 'none' : '350px'}
      flex={1}
      overflow="auto"
      maxH="calc(100vh - 70px)"
    >
      <Box
        px={3}
        py="20px"
        bg="gray.900"
        borderBottom="1px solid"
        borderColor="blue.900"
      >
        <Heading
          size="md"
          onClick={toggleFilter}
          display="flex"
          alignItems="center"
        >
          <IconButton
            variant="outline"
            size="sm"
            icon={<HamburgerIcon />}
            aria-label="Filtre menu button"
            mr="5px"
            _hover={{ bg: 'gray.700' }}
          />
          Filtres
        </Heading>
        {filterPanelState && (
          <Box pt="20px">
            <FilterMenu filters={filters} updateFilters={updateFilters} />
          </Box>
        )}
      </Box>
      <Box pl={3}>
        {filteredCards.map((filteredCard) => (
          <CardListElement key={filteredCard.id} card={filteredCard} />
        ))}
      </Box>
      {isMobile && cardSelected && (
        <Modal
          isCentered
          isOpen={!!cardSelected}
          onClose={() => selectCard(null)}
        >
          <ModalOverlay />
          <ModalContent bg="gray.700" color="white" maxH="75vh">
            <ModalHeader>
              #{cardSelected.id}- {cardSelected.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody overflowY="auto">
              <CardPreviewContainer overflow="visible" />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};
