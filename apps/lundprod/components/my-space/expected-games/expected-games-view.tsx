import { Box, Flex, Switch, Text, useBoolean } from '@chakra-ui/react';

import { ExpectedGamesCalendarView } from './expected-games-calendar-view';
import { ExpectedGamesListView } from './expected-games-list-view';
import { useTranslation } from 'react-i18next';

export const ExpectedGamesView = () => {
  const { t } = useTranslation();
  const [isCalendar, setIsCalendar] = useBoolean();

  return (
    <Box>
      <Flex justifyContent="flex-end" alignItems="center" gap={2}>
        <Text>{t('mySpace.expectedGames.list.list')}</Text>
        <Switch
          sx={{
            '.chakra-switch__track': {
              bg: 'blue.400',
            },
            'input:checked + .chakra-switch__track': {
              bg: 'orange.400',
            },
          }}
          size="lg"
          onChange={setIsCalendar.toggle}
        />
        <Text>{t('mySpace.expectedGames.list.calendar')}</Text>
      </Flex>
      <Box mt="20px">
        {isCalendar ? (
          <ExpectedGamesCalendarView />
        ) : (
          <ExpectedGamesListView readOnly={false} />
        )}
      </Box>
    </Box>
  );
};
