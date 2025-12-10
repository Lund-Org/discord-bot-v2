import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { FieldArrayWithId, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AwardForm } from '~/lundprod/types/awards';

type EditAwardModalProps = {
  field: FieldArrayWithId<AwardForm, 'awards', 'id'>;
  onEdit: (newLabel: FieldArrayWithId<AwardForm, 'awards', 'id'>) => void;
  onClose: VoidFunction;
};

export const EditAwardModal = ({
  field,
  onEdit,
  onClose,
}: EditAwardModalProps) => {
  const { t } = useTranslation();

  const { handleSubmit, register } = useForm<{ label: string }>({
    defaultValues: {
      label: field.label,
    },
  });

  const submit = ({ label }: { label: string }) => {
    onEdit({ ...field, label });
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(submit)}>
        <ModalContent>
          <ModalHeader>{t('awards.editAward.header')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">{t('awards.editAward.label')}</Text>
            <Input {...register('label', { required: true })} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              {t('awards.editAward.close')}
            </Button>
            <Button type="submit" colorScheme="green">
              {t('awards.editAward.edit')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
