import {
  Box,
  BoxProps,
  FormControl,
  FormLabel,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useGachaHome } from '~/lundprod/contexts/gacha-home-context';

import Card from './card';
import { EmptyView } from './empty-view';
import { FusionDetails } from './fusion-details';

type CardPreviewContainerProps = BoxProps;

export const CardPreviewContainer = ({
  ...rest
}: CardPreviewContainerProps) => {
  const { t } = useTranslation();
  const { cardSelected, filters, updateFilters } = useGachaHome();

  if (!cardSelected) {
    return <EmptyView />;
  }

  return (
    <Box
      flex={1}
      overflow="auto"
      maxH="calc(100vh - 70px)"
      p="20px"
      pb="80px"
      {...rest}
    >
      <Box>
        <Card
          imageUrl={cardSelected.imageName}
          type={filters.gold ? 'gold' : 'basic'}
        />
      </Box>
      <Box my="20px">
        <FormControl display="flex" gap={2} justifyContent="center">
          <Switch
            id="isChecked"
            onChange={() => updateFilters({ ...filters, gold: !filters.gold })}
            isChecked={filters.gold}
          />
          <FormLabel htmlFor="isChecked">{t('gacha.list.seeGold')}</FormLabel>
        </FormControl>
      </Box>
      <Text textAlign="center">{cardSelected.lore}</Text>
      {cardSelected.isFusion ? <FusionDetails card={cardSelected} /> : null}
    </Box>
  );
};
