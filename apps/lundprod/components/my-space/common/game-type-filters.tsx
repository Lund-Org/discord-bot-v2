import { Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import { useTranslation } from 'react-i18next';

import { getBacklogStatusTranslation } from '~/lundprod/utils/backlog';

type GameTypeFilterProps = {
  value: BacklogStatus | '';
  onChange: (data: BacklogStatus | '') => void;
};

export function GameTypeFilter({ value, onChange }: GameTypeFilterProps) {
  const { t } = useTranslation();
  const options = ['', ...Object.values(BacklogStatus)].map((status) => ({
    label: getBacklogStatusTranslation(t, status),
    value: status,
  }));

  return (
    <RadioGroup value={value} onChange={onChange}>
      <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb="10px">
        {options.map(({ label, value }) => (
          <Radio value={value} key={value}>
            {label}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
}
