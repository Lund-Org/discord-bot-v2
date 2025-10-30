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
import { useTranslation } from 'react-i18next';

import { useExpectedGame } from '~/lundprod/contexts/expected-games-context';

export type ExpectedGamesModalProps = {
  onClose: VoidFunction;
};

export const ExpectedGamesModal = ({ onClose }: ExpectedGamesModalProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useBoolean(false);
  const { modalData, addToExpectedList, updateExpectedList, setModalData } =
    useExpectedGame();
  const [addToBacklog, setAddToBacklog] = useBoolean(
    modalData ? modalData.initialAddToBacklog : false,
  );

  const onSubmit = async () => {
    setIsLoading.on();
    if (modalData.type === 'creation') {
      await addToExpectedList(
        modalData.game,
        addToBacklog,
        modalData.platformId,
        modalData.region,
      );
    } else if (modalData.type === 'update') {
      await updateExpectedList(modalData.game.id, addToBacklog);
    }
    setModalData(null);
  };

  const getTitle = () => {
    switch (modalData.type) {
      case 'creation':
        return t('mySpace.expectedGames.modal.createTitle');
      case 'update':
        return t('mySpace.expectedGames.modal.updateTitle');
    }
  };

  const getMessage = () => {
    const platformWording = modalData.platformId
      ? t('mySpace.expectedGames.modal.platformMessage', {
          platform: getPlatformLabel(modalData.platformId),
        })
      : '';

    switch (modalData.type) {
      case 'creation':
        return t('mySpace.expectedGames.modal.createType', {
          game: modalData.game.name,
          platform: platformWording,
        });
      case 'update':
        return t('mySpace.expectedGames.modal.updateType', {
          game: modalData.game.name,
          platform: platformWording,
        });
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
            {t('mySpace.expectedGames.modal.addToBacklogOnRelease')}
          </Checkbox>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="gray.300">
          <Button variant="secondary" onClick={onClose}>
            {t('mySpace.expectedGames.modal.cancel')}
          </Button>
          <Button colorScheme="orange" onClick={onSubmit} isLoading={isLoading}>
            {t('mySpace.expectedGames.modal.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
