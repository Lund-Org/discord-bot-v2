import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
} from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import Link from 'next/link';
import { getBacklogStatusTranslation } from '~/lundprod/utils/backlog';
import { useBacklog } from '~/lundprod/contexts/backlog-context';
import { BacklogChangeStatus } from './backlog-change-status';
import { BacklogItemDetails } from './backlog-item-details';
import { BacklogSetDetails } from './backlog-set-details';
import { DropdownButton } from '../../dropdown-button';

type BacklogListProps = {
  isReadOnly?: boolean;
};

export const BacklogList = ({ isReadOnly = true }: BacklogListProps) => {
  const { backlog, removeFromBacklog, onSortByStatus } = useBacklog();

  if (!backlog.length) {
    return getEmptyListWording(isReadOnly);
  }

  const options = Object.values(BacklogStatus).map((status) => ({
    label: getBacklogStatusTranslation(status),
    value: status,
  }));

  return (
    <Table>
      <Thead>
        <Tr>
          <Th color="gray.400">Nom</Th>
          <Th color="gray.400">Type</Th>
          <Th color="gray.400">Plus d&apos;information</Th>
          <Th color="gray.400" w="240px">
            <Flex>
              {isReadOnly ? 'Statut' : 'Actions'}
              <DropdownButton<BacklogStatus>
                colorScheme="blackAlpha"
                ml="auto"
                mr={0}
                size="xs"
                label="Trier"
                options={options}
                onChoice={onSortByStatus}
              />
            </Flex>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {backlog.map(
          (
            { igdbGameId, name, category, url, status, reason, rating },
            index
          ) => (
            <Tr key={index} _hover={{ bg: 'gray.900' }}>
              <Td>
                <Text>{name}</Text>
              </Td>
              <Td>
                <Text>{category}</Text>
              </Td>
              <Td>
                <Link href={url} target="_blank" rel="noopener noreferrer">
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
                    status={status}
                    reason={reason}
                    rating={rating}
                  />
                ) : (
                  <Flex direction="column" alignItems="center" gap={3}>
                    <Flex gap={2}>
                      <BacklogChangeStatus
                        igdbId={igdbGameId}
                        status={status}
                      />
                      <BacklogSetDetails
                        igdbId={igdbGameId}
                        status={status}
                        reason={reason}
                        rating={rating}
                      />
                    </Flex>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeFromBacklog(igdbGameId)}
                    >
                      Supprimer
                    </Button>
                  </Flex>
                )}
              </Td>
            </Tr>
          )
        )}
      </Tbody>
    </Table>
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
