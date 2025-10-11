import { SearchGameModal } from '../components/search-game-modal/search-game-modal';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { BacklogProvider } from '../contexts/me.context';

export default function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BacklogProvider>
      <Button onClick={() => setIsModalOpen(true)}>Open</Button>
      <SearchGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGameSelected={console.log}
        futureGame={false}
        // selectByPlatform
      />
    </BacklogProvider>
  );
}
