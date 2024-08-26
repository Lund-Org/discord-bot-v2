import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Box, Text, useToast } from '@chakra-ui/react';
import { getPlatformLabel } from '@discord-bot-v2/igdb-front';
import { css, Global } from '@emotion/react';
import { addHours } from 'date-fns';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import { fr } from 'date-fns/locale';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { chain } from 'lodash';
import { useMemo } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  EventWrapperProps,
} from 'react-big-calendar';

import { useExpectedGame } from '~/lundprod/contexts/expected-games-context';
import { Trans } from 'react-i18next';

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Event = {
  id: number;
  start: Date | undefined;
  end: Date | undefined;
  title: string;
  cancelled: boolean;
};

export const ExpectedGamesCalendarView = () => {
  const { expectedGames, setModalData } = useExpectedGame();

  const events: Event[] = useMemo(() => {
    return chain(expectedGames)
      .flatMap((expectedGame) => {
        const platformWording = getPlatformLabel(
          expectedGame.releaseDate.platformId,
        );
        const startDate = expectedGame.releaseDate.date
          ? new Date(expectedGame.releaseDate.date)
          : undefined;

        return {
          id: expectedGame.igdbId,
          start: startDate,
          end: startDate ? addHours(startDate, 1) : undefined,
          title: `${expectedGame.name} - ${platformWording}`,
          cancelled: expectedGame.cancelled,
        };
      })
      .filter(Boolean)
      .value();
  }, [expectedGames]);

  const onEventSelect = (event: Event) => {
    const expectedGame = expectedGames.find(
      ({ igdbId }) => igdbId === event.id,
    );

    if (expectedGame) {
      setModalData({
        type: 'update',
        initialAddToBacklog: expectedGame.addToBacklog,
        platformId: expectedGame.releaseDate.platformId,
        game: { id: expectedGame.igdbId, name: expectedGame.name },
        region: expectedGame.releaseDate.region,
      });
    }
  };

  const EventWrapper = (eventWrapperProps: EventWrapperProps<Event>) => {
    const toast = useToast();

    const warnIsCancel = () => {
      toast({
        title: 'Erreur',
        description: (
          <Trans
            i18nKey="mySpace.expectedGames.calendar.eventError"
            components={{ t: <Text /> }}
          />
        ),
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom-left',
      });
    };

    return (
      <Box
        className="rbc-event"
        bgColor={eventWrapperProps.event.cancelled ? 'red.500' : undefined}
        onClick={() =>
          eventWrapperProps.event.cancelled
            ? warnIsCancel()
            : onEventSelect(eventWrapperProps.event)
        }
      >
        <Box className="rbc-event-content">{eventWrapperProps.event.title}</Box>
      </Box>
    );
  };

  return (
    <>
      <Global
        styles={css`
          .rbc-header {
            text-transform: capitalize;
          }
          .rbc-toolbar-label {
            font-weight: bold;
            color: var(--chakra-colors-orange-300);
            text-transform: uppercase;
          }
          .rbc-btn-group button {
            color: var(--chakra-colors-orange-400);
          }
          .rbc-day-bg.rbc-off-range-bg {
            background: var(--chakra-colors-gray-900);
          }
          .rbc-day-bg {
            background: var(--chakra-colors-gray-700);
          }
          .rbc-day-bg.rbc-today {
            background: var(--chakra-colors-gray-400);
          }
          .rbc-date-cell.rbc-now.rbc-current {
            color: var(--chakra-colors-gray-900);
          }
        `}
      />
      <Calendar
        localizer={localizer}
        events={events.filter(({ start }) => start)}
        view="month"
        views={['month']}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        culture="fr"
        messages={{
          today: "Aujourd'hui",
          previous: 'Précédent',
          next: 'Suivant',
        }}
        onSelectEvent={onEventSelect}
        components={{
          eventWrapper: EventWrapper,
        }}
      />
    </>
  );
};
