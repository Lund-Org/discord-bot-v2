import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { BacklogGame } from '~/lundprod/contexts/me.context';
import { useBacklogHooks } from '~/lundprod/hooks/my-space/use-backlog-hooks';
import { SortOrderType } from '~/lundprod/server/types';

type SortByDateButtonProps = {
  isDisabled: boolean;
  status: BacklogGame['status'];
};

export const SortByDateButton = ({
  isDisabled,
  status,
}: SortByDateButtonProps) => {
  const { t } = useTranslation();
  const { sortByDate } = useBacklogHooks();

  const onClick = (order: SortOrderType) => {
    sortByDate(status, order);
  };

  return (
    <Menu>
      <MenuButton disabled={isDisabled}>
        <Button isDisabled={isDisabled} leftIcon={<ChevronDownIcon />}>
          {t('myBacklog.autosort.byDateOrder')}
        </Button>
      </MenuButton>
      <MenuList color="blackAlpha.800">
        <MenuItem onClick={() => onClick(SortOrderType.ASC)}>
          {t('myBacklog.autosort.asc')}
        </MenuItem>
        <MenuItem onClick={() => onClick(SortOrderType.DESC)}>
          {t('myBacklog.autosort.desc')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
