import { Flex, Select } from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { useBacklog } from '~/lundprod/contexts/backlog-context';
import {
  getBacklogStatusColor,
  getBacklogStatusTranslation,
} from '~/lundprod/utils/backlog';

type BacklogChangeStatusProps = {
  igdbId: number;
  status: BacklogStatus;
};

export const BacklogChangeStatus = ({
  igdbId,
  status,
}: BacklogChangeStatusProps) => {
  const { t } = useTranslation();
  const { updateBacklogStatus } = useBacklog();

  const updateStatus: ChangeEventHandler<HTMLSelectElement> = (e) => {
    updateBacklogStatus(igdbId, e.target.value as BacklogStatus);
    e.target.blur();
  };

  return (
    <Flex gap={2}>
      <Select
        size="sm"
        borderColor={getBacklogStatusColor(status)}
        borderWidth="2px"
        value={status}
        onChange={updateStatus}
        sx={{
          '& option': {
            color: 'gray.900',
          },
        }}
      >
        {Object.values(BacklogStatus).map((backlogStatus) => (
          <option key={backlogStatus} value={backlogStatus}>
            {getBacklogStatusTranslation(t, backlogStatus)}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
