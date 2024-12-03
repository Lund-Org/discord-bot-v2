import { QuestionIcon, StarIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Flex, Tooltip } from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import { useRouter } from 'next/router';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClickAway } from 'react-use';
import { BacklogItemLight } from '~/lundprod/contexts/backlog-context';

import {
  getBacklogStatusColor,
  getBacklogStatusTranslation,
} from '~/lundprod/utils/backlog';

type BacklogItemDetailsProps = {
  item: BacklogItemLight;
  selectReview: (igdbGameId: number | null) => void;
};

const STATUS_WITH_DETAILS: BacklogStatus[] = [
  BacklogStatus.ABANDONED,
  BacklogStatus.FINISHED,
];
const STATUS_WITH_NOTE: BacklogStatus[] = [
  BacklogStatus.CURRENTLY,
  BacklogStatus.BACKLOG,
  BacklogStatus.WISHLIST,
];

export const BacklogItemDetails = ({
  item: { igdbGameId, status, note, review },
  selectReview,
}: BacklogItemDetailsProps) => {
  const { t } = useTranslation();
  const [isNoteTooltipOpen, setIsNoteTooltipOpen] = useState(false);
  const { push, query } = useRouter();
  const ref = useRef<HTMLSpanElement>(null);

  const onReviewSelect = (igdbGameId: number) => {
    push({ query: { ...query, igdbGameId } }, undefined, {
      shallow: true,
    });
    selectReview(igdbGameId);
  };

  const statusBadge = useMemo(() => {
    return (
      <Badge
        ref={ref}
        variant="solid"
        colorScheme={getBacklogStatusColor(status)}
        px={3}
        py={1}
      >
        {getBacklogStatusTranslation(t, status)}
      </Badge>
    );
  }, [status]);

  return (
    <Flex gap={3} alignItems="center" justifyContent="space-between">
      <Box>{statusBadge}</Box>
      {STATUS_WITH_DETAILS.includes(status) && !!review && (
        <Button
          onClick={() => onReviewSelect(igdbGameId)}
          size="sm"
          colorScheme="yellow"
        >
          {t('mySpace.backlog.review.open')}
        </Button>
      )}
      {STATUS_WITH_NOTE.includes(status) && note && (
        <Box>
          <Tooltip
            hasArrow
            label={note}
            p={3}
            isOpen={isNoteTooltipOpen}
            placement="left"
            shouldWrapChildren
          >
            <QuestionIcon
              boxSize="20px"
              onMouseEnter={() => setIsNoteTooltipOpen(true)}
              onClick={() => setIsNoteTooltipOpen(!isNoteTooltipOpen)}
              onMouseLeave={() => setIsNoteTooltipOpen(false)}
            />
          </Tooltip>
        </Box>
      )}
    </Flex>
  );
};
