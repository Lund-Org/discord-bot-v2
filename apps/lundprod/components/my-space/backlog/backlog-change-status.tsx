import { BacklogStatus } from '@prisma/client';
import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from 'react';
import { useBacklog } from '~/lundprod/contexts/backlog-context';
import {
  getBacklogStatusColor,
  getBacklogStatusTranslation,
} from '~/lundprod/utils/backlog';

type BacklogChangeStatusProps = {
  igdbId: number;
  status: BacklogStatus;
  reason: string;
};

export const BacklogChangeStatus = ({
  igdbId,
  status,
  reason,
}: BacklogChangeStatusProps) => {
  const { updateBacklogStatus, updateAbandonedReason } = useBacklog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [newReason, setNewReason] = useState(reason || '');

  useEffect(() => {
    setNewReason(reason || '');
  }, [reason]);

  const updateStatus: ChangeEventHandler<HTMLSelectElement> = (e) => {
    updateBacklogStatus(igdbId, e.target.value as BacklogStatus);
    e.target.blur();
  };

  const submitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    updateAbandonedReason(igdbId, newReason).then(() => {
      setIsModalOpen(false);
      setIsFormLoading(false);
    });
  };

  return (
    <Flex gap={2}>
      <Select
        size="sm"
        borderColor={getBacklogStatusColor(status)}
        borderWidth="2px"
        value={status}
        onChange={updateStatus}
        sx={{
          '& option': {
            color: 'gray.900',
          },
        }}
      >
        {Object.values(BacklogStatus).map((backlogStatus) => (
          <option key={backlogStatus} value={backlogStatus}>
            {getBacklogStatusTranslation(backlogStatus)}
          </option>
        ))}
      </Select>
      {status === BacklogStatus.ABANDONED && (
        <>
          <Button
            variant="outline"
            _hover={{ bg: 'gray.600' }}
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <AddIcon />
          </Button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Ajouter une raison</ModalHeader>
              <ModalCloseButton />
              <form onSubmit={submitForm}>
                <ModalBody>
                  <FormControl>
                    <FormLabel>Raison de l&apos;abandon</FormLabel>
                    <Textarea
                      value={newReason || ''}
                      onChange={(e) => setNewReason(e.target.value)}
                      isRequired
                    />
                    <FormHelperText
                      color={newReason.length > 255 ? 'red.600' : 'inherit'}
                    >
                      {255 - newReason.length} caractères restants
                    </FormHelperText>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="green"
                    type="submit"
                    isLoading={isFormLoading}
                    isDisabled={!newReason.length || newReason.length > 255}
                  >
                    Sauvegarder
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  );
};
