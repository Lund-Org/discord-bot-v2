import { BacklogStatus } from '@prisma/client';
import { AddIcon, StarIcon } from '@chakra-ui/icons';
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
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useBacklog } from '~/lundprod/contexts/backlog-context';

type BacklogSetDetailsProps = {
  igdbId: number;
  status: BacklogStatus;
  reason: string;
  rating: number;
};

const STATUS_WITH_DETAILS: BacklogStatus[] = [
  BacklogStatus.ABANDONED,
  BacklogStatus.FINISHED,
];

export const BacklogSetDetails = ({
  igdbId,
  status,
  reason,
  rating,
}: BacklogSetDetailsProps) => {
  const { updateBacklogDetails } = useBacklog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [newReason, setNewReason] = useState(reason || '');
  const [newRating, setNewRating] = useState(rating);

  useEffect(() => {
    setNewReason(reason || '');
  }, [reason]);

  useEffect(() => {
    setNewRating(rating);
  }, [rating]);

  const submitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    updateBacklogDetails(igdbId, newReason, newRating).then(() => {
      setIsModalOpen(false);
      setIsFormLoading(false);
    });
  };

  if (!STATUS_WITH_DETAILS.includes(status)) {
    return null;
  }

  return (
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
          <ModalHeader>Ajouter des détails</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={submitForm}>
            <ModalBody>
              <FormControl>
                <FormLabel>Note</FormLabel>
                <Flex gap={1}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                      key={index}
                      color={index + 1 <= newRating ? 'gold' : 'gray.300'}
                      onClick={() => setNewRating(index + 1)}
                      cursor="pointer"
                    />
                  ))}
                </Flex>
              </FormControl>
              <FormControl mt={3}>
                <FormLabel>Commentaire</FormLabel>
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
  );
};
