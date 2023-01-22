import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonProps, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

type DropdownButtonProps<T> = {
  label: string;
  options: Array<{
    label: string;
    value: T;
  }>;
  onChoice: (value: T) => void;
} & ButtonProps;

export const DropdownButton = <T,>({
  label,
  options,
  onChoice,
  ...rest
}: DropdownButtonProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useClickAway(ref, () => setTimeout(() => setIsOpen(false), 100));

  return (
    <Button
      ref={ref}
      position="relative"
      onClick={() => setIsOpen((v) => !v)}
      {...rest}
    >
      {label}
      <ChevronDownIcon ml={2} />
      {isOpen && (
        <Box position="absolute" top="100%" bg="gray.700" py={2} zIndex={1}>
          {options.map(({ label, value }) => (
            <Text
              p={2}
              key={label}
              onClick={(e) => {
                e.stopPropagation();
                onChoice(value);
                setIsOpen(false);
              }}
              _hover={{ bg: 'gray.900' }}
            >
              {label}
            </Text>
          ))}
        </Box>
      )}
    </Button>
  );
};
