import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Heading, Image } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { arrowRightUp } from '~/lundprod/assets';

export const EmptyView = () => {
  const { t } = useTranslation();

  return (
    <Box px="10%" flex={1} pt="30px">
      <Box color="blue.300" ml="-40px">
        <Image
          src={arrowRightUp.src}
          alt="Indication filtre"
          transform="rotate(-90deg)"
          w="50px"
        />
      </Box>
      <Heading mb="80px">{t('gacha.list.emptyView.filter')}</Heading>
      <Heading>{t('gacha.list.emptyView.pickCard')}</Heading>
      <Box color="blue.300" ml="-40px">
        <Image
          src={arrowRightUp.src}
          alt="Indication filtre"
          transform="rotate(-90deg) scale(-1, 1)"
          w="50px"
        />
      </Box>
      <Box fontSize="30px" textAlign="center" mt="60px">
        <InfoOutlineIcon mr="10px" />
        {t('gacha.list.emptyView.details')}
      </Box>
    </Box>
  );
};
