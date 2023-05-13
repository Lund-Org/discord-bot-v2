import { QuestionIcon, StarIcon } from '@chakra-ui/icons';
import { Badge, Box, Flex, Tooltip } from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import { useMemo, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import {
  getBacklogStatusColor,
  getBacklogStatusTranslation,
} from '~/lundprod/utils/backlog';

type BacklogItemDetailsProps = {
  status: BacklogStatus;
  reason: string;
  note?: string;
  rating: number;
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
  status,
  reason,
  rating,
  note,
}: BacklogItemDetailsProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isNoteTooltipOpen, setIsNoteTooltipOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const refNote = useRef<HTMLSpanElement>(null);

  useClickAway(ref, () => {
    setIsTooltipOpen(false);
  });

  useClickAway(refNote, () => {
    setIsNoteTooltipOpen(false);
  });

  const statusBadge = useMemo(() => {
    const component = (
      <Badge
        ref={ref}
        variant="solid"
        colorScheme={getBacklogStatusColor(status)}
        px={3}
        py={1}
        cursor={STATUS_WITH_DETAILS.includes(status) ? 'pointer' : 'cursor'}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        {getBacklogStatusTranslation(status)}
      </Badge>
    );
    return STATUS_WITH_DETAILS.includes(status) ? (
      <Tooltip hasArrow label={reason} p={3} isOpen={isTooltipOpen}>
        {component}
      </Tooltip>
    ) : (
      component
    );
  }, [isTooltipOpen, reason, status]);

  return (
    <Flex gap={2}>
      <Box>{statusBadge}</Box>
      {STATUS_WITH_DETAILS.includes(status) && (
        <Box whiteSpace="nowrap" mr={0} ml="auto">
          {Array.from({ length: rating }, (_, index) => (
            <StarIcon key={index} color="gold" />
          ))}
          {Array.from({ length: 5 - rating }, (_, index) => (
            <StarIcon key={index} color="gray.300" />
          ))}
        </Box>
      )}
      {STATUS_WITH_NOTE.includes(status) && note && (
        <Box ml="25%">
          <Tooltip
            hasArrow
            label={note}
            p={3}
            isOpen={isNoteTooltipOpen}
            placement="left"
          >
            <span ref={refNote}>
              <QuestionIcon
                boxSize="20px"
                onMouseEnter={() => setIsNoteTooltipOpen(true)}
                onClick={() => setIsNoteTooltipOpen(!isNoteTooltipOpen)}
                onMouseLeave={() => setIsNoteTooltipOpen(false)}
              />
            </span>
          </Tooltip>
        </Box>
      )}
    </Flex>
  );
};
