import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Flex, Table, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useBacklog } from '~/lundprod/contexts/backlog-context';

import { GameTypeFilter } from '../common/game-type-filters';
import { BacklogChangeStatus } from './backlog-change-status';
import { DragAndDropWrapper } from './backlog-drag-and-drop-wrapper';
import { DraggableRow } from './backlog-draggable-row';
import { BacklogItemDetails } from './backlog-item-details';
import { BacklogSetDetails } from './backlog-set-details';

type BacklogListProps = {
  isReadOnly?: boolean;
};

export const BacklogList = ({ isReadOnly = true }: BacklogListProps) => {
  const { backlog, removeFromBacklog } = useBacklog();
  const [activeStatus, setActiveStatus] = useState<BacklogStatus | ''>('');

  const refinedList = useMemo(() => {
    if (!activeStatus) {
      return backlog;
    }
    return backlog.filter((item) => item.status === activeStatus);
  }, [activeStatus, backlog]);

  if (!refinedList.length) {
    return (
      <>
        <GameTypeFilter value={activeStatus} onChange={setActiveStatus} />
        {getEmptyListWording(isReadOnly)}
      </>
    );
  }

  return (
    <>
      <GameTypeFilter value={activeStatus} onChange={setActiveStatus} />
      <Table>
        <Thead>
          <Tr>
            {!isReadOnly && activeStatus === '' && <Th />}
            <Th color="gray.400">Nom</Th>
            <Th color="gray.400">Type</Th>
            <Th color="gray.400">Plus d&apos;information</Th>
            <Th color="gray.400" w="240px">
              <Flex>{isReadOnly ? 'Statut' : 'Actions'}</Flex>
            </Th>
          </Tr>
        </Thead>
        <DragAndDropWrapper isReadOnly={isReadOnly} isFiltered={!!activeStatus}>
          {refinedList.map((item, index) => (
            <DraggableRow
              key={index}
              isReadOnly={isReadOnly}
              isFiltered={!!activeStatus}
              item={item}
            >
              <Td>
                <Text>{item.name}</Text>
              </Td>
              <Td>
                <Text>{item.category}</Text>
              </Td>
              <Td>
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="sm"
                    color="gray.700"
                    rightIcon={<ExternalLinkIcon />}
                  >
                    Info
                  </Button>
                </Link>
              </Td>
              <Td>
                {isReadOnly ? (
                  <BacklogItemDetails
                    status={item.status}
                    reason={item.reason}
                    rating={item.rating}
                  />
                ) : (
                  <Flex direction="column" alignItems="center" gap={3}>
                    <Flex gap={2}>
                      <BacklogChangeStatus
                        igdbId={item.igdbGameId}
                        status={item.status}
                      />
                      <BacklogSetDetails
                        igdbId={item.igdbGameId}
                        status={item.status}
                        reason={item.reason}
                        rating={item.rating}
                      />
                    </Flex>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeFromBacklog(item.igdbGameId)}
                    >
                      Supprimer
                    </Button>
                  </Flex>
                )}
              </Td>
            </DraggableRow>
          ))}
        </DragAndDropWrapper>
      </Table>
    </>
  );
};

function getEmptyListWording(isReadOnly: boolean) {
  return isReadOnly ? (
    <Text>Ce backlog ne contient aucun jeu pour l&apos;instant</Text>
  ) : (
    <>
      <Text>Rien dans ton backlog ?</Text>
      <Text>
        Trouve un jeu dans le deuxième onglet pour enrichir ta liste !
      </Text>
      <Text>Tu peux mettre jusqu&apos;à 100 jeux dans ton backlog 🤩</Text>
    </>
  );
}
