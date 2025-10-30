import {
  Box,
  Checkbox,
  Flex,
  Input,
  Select,
  Text,
  chakra,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        <Text as="span">{t('gacha.list.starCount')}</Text>
        <Select
          className="filter-stars"
          value={filters.filterStars}
          onChange={(event) => update('filterStars', event.target.value)}
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
            {t('gacha.list.seeGold')}
          </Checkbox>
        </Box>
      )}
      <Box>
        <Checkbox
          onChange={() => update('fusion', !filters.fusion)}
          isChecked={filters.fusion}
        >
          {t('gacha.list.fusionOnly')}
        </Checkbox>
      </Box>
    </Flex>
  );
};
