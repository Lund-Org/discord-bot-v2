import {
  chakra,
  Tooltip as ChakraTooltip,
  TooltipProps,
} from '@chakra-ui/react';
import { useState } from 'react';

export const Tooltip = ({ children, ...tooltipProps }: TooltipProps) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <ChakraTooltip
      isOpen={isActive && !tooltipProps.isDisabled}
      {...tooltipProps}
    >
      <chakra.span
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onClick={() => setIsActive((x) => !x)}
      >
        {children}
      </chakra.span>
    </ChakraTooltip>
  );
};
