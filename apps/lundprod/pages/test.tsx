import { SearchGameModal } from '../components/search-game-modal/search-game-modal';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { MeProvider, MeContext } from '../contexts/me.context';

export default function Test() {
  const [isModalBacklogOpen, setIsModalBacklogOpen] = useState(false);
  const [isModalExpectedGameOpen, setIsModalExpectedGameOpen] = useState(false);

  return (
    <MeProvider>
      <Button onClick={() => setIsModalBacklogOpen(true)}>Open backlog</Button>
      <Button onClick={() => setIsModalExpectedGameOpen(true)}>
        Open expectedGames
      </Button>
      <MeContext.Consumer>
        {({ backlog, expectedGames }) => (
          <>
            <SearchGameModal
              isOpen={isModalBacklogOpen}
              onClose={() => setIsModalBacklogOpen(false)}
              onGameSelected={console.log}
              futureGame={false}
              isGameSelected={(game) => {
                return !!backlog.find(
                  ({ igdbGameId }) => igdbGameId === game.id,
                );
              }}
            />
            <SearchGameModal
              isOpen={isModalExpectedGameOpen}
              onClose={() => setIsModalExpectedGameOpen(false)}
              onGameSelected={console.log}
              futureGame
              isGameSelected={(game, platformId) => {
                return !!expectedGames.find(
                  ({ igdbId, releaseDate }) =>
                    igdbId === game.id &&
                    platformId === releaseDate?.platformId,
                );
              }}
              selectByPlatform
            />
          </>
        )}
      </MeContext.Consumer>
    </MeProvider>
  );
}
