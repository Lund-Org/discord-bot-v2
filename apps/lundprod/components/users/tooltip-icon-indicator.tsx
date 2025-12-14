import { Button, Flex, Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';

type TooltipIconIndicatorProps = {
  tooltipLabel: string;
  isDisabled: boolean;
  icon: ReactNode;
  hover: boolean;
  count: number;
};

export const TooltipIconIndicator = ({
  tooltipLabel,
  isDisabled,
  icon,
  hover,
  count,
}: TooltipIconIndicatorProps) => {
  return (
    <Tooltip
      label={tooltipLabel}
      bg="gray.200"
      color="gray.900"
      isDisabled={isDisabled}
      hasArrow
    >
      <Button variant="third" position="relative" px={[2, 4]}>
        {icon}
        <Flex
          className="count"
          position="absolute"
          borderRadius="20px"
          bottom={0}
          right={0}
          bg="gray.200"
          color="gray.900"
          w="20px"
          h="20px"
          fontSize="12px"
          alignItems="center"
          justifyContent="center"
          {...(hover
            ? {
                bg: 'orange.700',
                color: 'gray.200',
              }
            : {})}
        >
          <span>{count}</span>
        </Flex>
      </Button>
    </Tooltip>
  );
};
