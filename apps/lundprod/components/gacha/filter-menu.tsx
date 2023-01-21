import { Box, Checkbox, Flex, Input, Select, Text } from '@chakra-ui/react';
import { options } from '~/lundprod/utils/filters';
import { Filters } from '~/lundprod/utils/types';

type FilterMenuProps = {
  filters: Filters;
  updateFilters: (data: Filters) => void;
  withGoldFilter?: boolean;
};

export const FilterMenu = ({
  filters,
  updateFilters,
  withGoldFilter = true,
}: FilterMenuProps) => {
  const update = (key: string, value: unknown) => {
    updateFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Flex flexDir="column" gap="10px">
      <Box>
        <Input
          onChange={(event) => update('search', event.target.value)}
          value={filters.search}
          placeholder="Recherche"
        />
      </Box>
      <Box>
        <Text as="span">Nombre d&apos;étoiles : </Text>
        <Select
          value={filters.filterStars}
          onChange={(event) => update('filterStars', event.target.value)}
          sx={{
            option: 'background: var(--chakra-colors-gray-500) !important;',
          }}
        >
          {options.map((opt, index) => (
            <option value={opt} key={index}>
              {opt}
            </option>
          ))}
        </Select>
      </Box>
      {withGoldFilter && (
        <Box>
          <Checkbox
            onChange={() => update('gold', !filters.gold)}
            isChecked={filters.gold}
          >
            Visualiser les cartes en dorée
          </Checkbox>
        </Box>
      )}
      <Box>
        <Checkbox
          onChange={() => update('fusion', !filters.fusion)}
          isChecked={filters.fusion}
        >
          Cartes fusions uniquement
        </Checkbox>
      </Box>
    </Flex>
  );
};
