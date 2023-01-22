import { StarIcon } from '@chakra-ui/icons';
import { Badge, Flex, Tooltip, Box } from '@chakra-ui/react';
import {
  getBacklogStatusColor,
  getBacklogStatusTranslation,
} from '~/lundprod/utils/backlog';
import { BacklogStatus } from '@prisma/client';

type BacklogItemDetailsProps = {
  status: BacklogStatus;
  reason: string;
  rating: number;
};

const STATUS_WITH_DETAILS: BacklogStatus[] = [
  BacklogStatus.ABANDONED,
  BacklogStatus.FINISHED,
];

export const BacklogItemDetails = ({
  status,
  reason,
  rating,
}: BacklogItemDetailsProps) => {
  return (
    <Flex gap={2}>
      <Box>
        <Tooltip hasArrow label={reason} p={3}>
          <Badge
            variant="solid"
            colorScheme={getBacklogStatusColor(status)}
            px={3}
            py={1}
            cursor="pointer"
          >
            {getBacklogStatusTranslation(status)}
          </Badge>
        </Tooltip>
      </Box>
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
    </Flex>
  );
};
