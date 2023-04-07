import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { getPlatformLabel } from '@discord-bot-v2/igdb-front';

import { useExpectedGame } from '~/lundprod/contexts/expected-games-context';

export type ExpectedGamesModalProps = {
  onClose: VoidFunction;
};

export const ExpectedGamesModal = ({ onClose }: ExpectedGamesModalProps) => {
  const [isLoading, setIsLoading] = useBoolean(false);
  const { modalData, addToExpectedList, updateExpectedList, setModalData } =
    useExpectedGame();
  const [addToBacklog, setAddToBacklog] = useBoolean(
    modalData ? modalData.initialAddToBacklog : false
  );

  const onSubmit = async () => {
    setIsLoading.on();
    if (modalData.type === 'creation') {
      await addToExpectedList(
        modalData.game,
        addToBacklog,
        modalData.platformId,
        modalData.region
      );
    } else if (modalData.type === 'update') {
      await updateExpectedList(modalData.game.id, addToBacklog);
    }
    setModalData(null);
  };

  const getTitle = () => {
    switch (modalData.type) {
      case 'creation':
        return `Ajouter un jeu attendu`;
      case 'update':
        return `Mettre à jour le jeu attendu`;
    }
  };

  const getMessage = () => {
    const platformWording = modalData.platformId
      ? `pour la plate-forme : ${getPlatformLabel(modalData.platformId)}`
      : '';

    switch (modalData.type) {
      case 'creation':
        return `Tu es sur le point d'ajouter ${modalData.game.name} à tes jeux attendus ${platformWording}`;
      case 'update':
        return `Tu es sur le point de mettre à jour ta mise en attente pour le jeu : ${modalData.game.name} ${platformWording}`;
    }
  };

  return (
    <Modal size="4xl" isOpen={!!modalData} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.300">
          {getTitle()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py="30px">
          <Text mb="8px">{getMessage()}</Text>
          <Checkbox isChecked={addToBacklog} onChange={setAddToBacklog.toggle}>
            Ajouter au backlog à la sortie
          </Checkbox>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="gray.300">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button colorScheme="orange" onClick={onSubmit} isLoading={isLoading}>
            Enregistrer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
