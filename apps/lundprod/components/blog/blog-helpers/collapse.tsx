import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse as ChakraCollapse,
  Text,
} from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

export const Collapse = ({
  title,
  defaultState = false,
  children,
}: {
  title: string;
  defaultState?: boolean;
  children: ReactNode;
}) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(defaultState);

  return (
    <Box>
      <Button
        color="orange.400"
        variant="link"
        onClick={() => setIsCollapseOpen((v) => !v)}
        size="lg"
        pl="10px"
        _active={{ color: 'orange.500' }}
      >
        <Text>{title}</Text>
        <ChevronDownIcon
          {...(isCollapseOpen && { transform: 'rotate(180deg)' })}
          transition="transform .3s ease"
          mt="5px"
        />
      </Button>
      <ChakraCollapse in={isCollapseOpen} animateOpacity>
        <Box pl={5} pt={2}>
          {children}
        </Box>
      </ChakraCollapse>
    </Box>
  );
};
