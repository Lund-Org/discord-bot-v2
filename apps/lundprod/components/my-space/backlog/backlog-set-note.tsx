import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import { FormEventHandler, useEffect, useState } from 'react';

import { useBacklog } from '~/lundprod/contexts/backlog-context';

type BacklogSetNoteProps = {
  igdbId: number;
  status: BacklogStatus;
  note?: string;
};

const STATUS_WITH_NOTE: BacklogStatus[] = [
  BacklogStatus.WISHLIST,
  BacklogStatus.BACKLOG,
  BacklogStatus.CURRENTLY,
];

export const BacklogSetNote = ({
  igdbId,
  status,
  note,
}: BacklogSetNoteProps) => {
  const { updateBacklogNote } = useBacklog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [newNote, setNewNote] = useState(note || '');

  useEffect(() => {
    setNewNote(note || '');
  }, [note]);

  const submitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    updateBacklogNote(igdbId, newNote).then(() => {
      setIsModalOpen(false);
      setIsFormLoading(false);
    });
  };

  if (!STATUS_WITH_NOTE.includes(status)) {
    return null;
  }

  return (
    <>
      <Tooltip
        label={note}
        isDisabled={!note?.length}
        placement="left"
        hasArrow
      >
        <Button
          variant="outline"
          _hover={{ bg: 'gray.600' }}
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <EditIcon />
        </Button>
      </Tooltip>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter une note</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={submitForm}>
            <ModalBody>
              <FormControl>
                <FormLabel>Note</FormLabel>
                <Textarea
                  value={newNote || ''}
                  onChange={(e) => setNewNote(e.target.value)}
                  isRequired
                />
                <FormHelperText
                  color={newNote.length > 255 ? 'red.600' : 'inherit'}
                >
                  {255 - newNote.length} caractères restants
                </FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isFormLoading}
                isDisabled={!newNote.length || newNote.length > 255}
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
