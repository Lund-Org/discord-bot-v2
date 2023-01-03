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
} from '@chakra-ui/react';
import Link from 'next/link';
import { useBacklog } from '../../../contexts/backlog-context';

export const BacklogList = () => {
  const { backlog, removeFromBacklog } = useBacklog();

  if (!backlog.length) {
    return (
      <>
        <Text>Rien dans ton backlog ?</Text>
        <Text>
          Trouve un jeu dans le deuxième onglet pour enrichir ta liste !
        </Text>
        <Text>Tu peux mettre jusqu&apos;à 100 jeux dans ton backlog 🤩</Text>
      </>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th color="gray.400">Nom</Th>
          <Th color="gray.400">Type</Th>
          <Th color="gray.400">Plus d&apos;information</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {backlog.map(({ igdbGameId, name, category, url }, index) => (
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
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => removeFromBacklog(igdbGameId)}
              >
                Supprimer
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
