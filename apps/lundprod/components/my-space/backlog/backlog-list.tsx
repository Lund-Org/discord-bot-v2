import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Badge,
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
import Link from 'next/link';
import {
  getBacklogStatusColor,
  getBacklogStatusTranslation,
} from '~/lundprod/utils/backlog';
import { useBacklog } from '~/lundprod/contexts/backlog-context';
import { BacklogChangeStatus } from './backlog-change-status';

type BacklogListProps = {
  isReadOnly?: boolean;
};

export const BacklogList = ({ isReadOnly = true }: BacklogListProps) => {
  const { backlog, removeFromBacklog } = useBacklog();

  if (!backlog.length) {
    return getEmptyListWording(isReadOnly);
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th color="gray.400">Nom</Th>
          <Th color="gray.400">Type</Th>
          <Th color="gray.400">Plus d&apos;information</Th>
          <Th color="gray.400">{isReadOnly ? 'Statut' : 'Actions'}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {backlog.map(({ igdbGameId, name, category, url, status }, index) => (
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
                <Badge
                  variant="solid"
                  colorScheme={getBacklogStatusColor(status)}
                  px={3}
                  py={1}
                >
                  {getBacklogStatusTranslation(status)}
                </Badge>
              ) : (
                <Flex direction="column" alignItems="center" gap={3}>
                  <BacklogChangeStatus igdbId={igdbGameId} status={status} />
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
        ))}
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
