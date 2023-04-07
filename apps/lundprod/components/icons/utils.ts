import { IconProps } from '@chakra-ui/react';

export const getColorStyle = (props: IconProps) => {
  const color = props.color;
  const hoverColor = props._hover?.color;

  return {
    color,
    sx: {
      '*': {
        fill: color,
      },
      _hover: {
        '*': {
          fill: hoverColor,
        },
      },
    },
  };
};
