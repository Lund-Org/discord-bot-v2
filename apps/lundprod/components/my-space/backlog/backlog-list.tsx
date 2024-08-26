import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Flex,
  Table,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  BacklogItemLight,
  useBacklog,
} from '~/lundprod/contexts/backlog-context';

import { GameTypeFilter } from '../common/game-type-filters';
import { BacklogChangeStatus } from './backlog-change-status';
import { DragAndDropWrapper } from './backlog-drag-and-drop-wrapper';
import { DraggableRow } from './backlog-draggable-row';
import { BacklogItemDetails } from './backlog-item-details';
import { BacklogSetDetails } from './backlog-set-details';
import { BacklogSetNote } from './backlog-set-note';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { BacklogReview } from './backlog-review';
import { useRouter } from 'next/router';

type BacklogListProps =
  | {
      isReadOnly: true;
      userName: string;
    }
  | {
      isReadOnly: false;
      userName?: never;
    };

const isSSR = typeof window === 'undefined';

export const BacklogList = ({
  isReadOnly = true,
  userName,
}: BacklogListProps) => {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { backlog, removeFromBacklog } = useBacklog();
  const [activeStatus, setActiveStatus] = useState<BacklogStatus | ''>('');
  const [list, setList] = useState<BacklogItemLight[] | null>(null);
  const [selectedReview, setSelectedReview] = useState<BacklogItemLight | null>(
    null,
  );

  const seeReview = useCallback(
    (igdbGameId: number | null) => {
      setSelectedReview(
        list?.find((item) => item.igdbGameId === igdbGameId) || null,
      );
    },
    [list, setSelectedReview],
  );

  // To avoid weird hydration issues
  useEffect(() => {
    if (!isSSR) {
      if (!activeStatus) {
        return setList(backlog);
      }

      setList(backlog.filter((item) => item.status === activeStatus));
    }
  }, [backlog, activeStatus]);

  useEffect(() => {
    if (query.igdbGameId) {
      seeReview(+query.igdbGameId);
    }
  }, [query.igdbGameId, seeReview]);

  if (isSSR || !list) {
    return null;
  }

  if (!list.length) {
    return (
      <>
        <GameTypeFilter value={activeStatus} onChange={setActiveStatus} />
        {getEmptyListWording(t, isReadOnly)}
      </>
    );
  }

  return (
    <>
      <GameTypeFilter value={activeStatus} onChange={setActiveStatus} />
      <Box overflow="auto" py={2}>
        <Table
          sx={{
            '&': {
              'table-layout': 'fixed',
            },
          }}
        >
          <chakra.colgroup>
            {!isReadOnly && activeStatus === '' && <chakra.col w="65px" />}
            <chakra.col />
            <chakra.col w="200px" />
            <chakra.col w="120px" />
            <chakra.col w="180px" />
            <chakra.col w="250px" />
          </chakra.colgroup>
          <Thead>
            <Tr>
              {!isReadOnly && activeStatus === '' && <Th />}
              <Th colSpan={2} color="gray.400">
                {t('mySpace.backlog.list.name')}
              </Th>
              <Th color="gray.400">{t('mySpace.backlog.list.type')}</Th>
              <Th color="gray.400">{t('mySpace.backlog.list.moreInfo')}</Th>
              <Th color="gray.400" w="240px">
                <Flex>
                  {isReadOnly
                    ? t('mySpace.backlog.list.status')
                    : t('mySpace.backlog.list.actions')}
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <DragAndDropWrapper
            isReadOnly={isReadOnly}
            isFiltered={!!activeStatus}
          >
            {list.map((item, index) => (
              <DraggableRow
                key={index}
                isReadOnly={isReadOnly}
                isFiltered={!!activeStatus}
                item={item}
              >
                <Td colSpan={2}>
                  <Text title={item.name}>{item.name}</Text>
                </Td>
                <Td>
                  <Text>{item.category}</Text>
                </Td>
                <Td>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      color="gray.700"
                      rightIcon={<ExternalLinkIcon />}
                    >
                      {t('mySpace.backlog.list.info')}
                    </Button>
                  </Link>
                </Td>
                <Td>
                  {isReadOnly ? (
                    <BacklogItemDetails item={item} selectReview={seeReview} />
                  ) : (
                    <Flex direction="column" alignItems="center" gap={3}>
                      <Flex gap={2}>
                        <BacklogChangeStatus
                          igdbId={item.igdbGameId}
                          status={item.status}
                        />
                        <BacklogSetNote
                          igdbId={item.igdbGameId}
                          status={item.status}
                          note={item.note}
                        />
                        <BacklogSetDetails
                          igdbId={item.igdbGameId}
                          status={item.status}
                          item={item}
                        />
                      </Flex>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeFromBacklog(item.igdbGameId)}
                      >
                        {t('mySpace.backlog.list.delete')}
                      </Button>
                    </Flex>
                  )}
                </Td>
              </DraggableRow>
            ))}
          </DragAndDropWrapper>
        </Table>
      </Box>
      <BacklogReview
        item={selectedReview}
        closeReview={() => setSelectedReview(null)}
        userName={userName}
      />
    </>
  );
};

function getEmptyListWording(tFn: TFunction, isReadOnly: boolean) {
  return isReadOnly ? (
    <Text>{tFn('mySpace.backlog.list.emptyView.readOnly')}</Text>
  ) : (
    <Trans
      i18nKey="mySpace.backlog.list.emptyView.edit"
      components={{ t: <Text /> }}
    />
  );
}
