import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmationModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200">
          {t('confirmModal.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p="16px 20px 20px 20px">
            <Text textAlign="center" mb={4}>
              {t('confirmModal.text')}
            </Text>
            <Flex justifyContent="center" gap={2}>
              <Button onClick={onClose} isDisabled={isLoading}>
                {t('confirmModal.cancel')}
              </Button>
              <Button
                onClick={onConfirm}
                isLoading={isLoading}
                colorScheme="orange"
              >
                {t('confirmModal.confirm')}
              </Button>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
