import { IconProps } from '@chakra-ui/react';

export const getColorStyle = (props: IconProps, legacy = false) => {
  const color = props.color;
  const hoverColor = props._hover?.color;

  return {
    color,
    sx: {
      '*': legacy
        ? { stroke: color }
        : {
            fill: color,
          },
      _hover: {
        '*': legacy
          ? { stroke: color }
          : {
              fill: hoverColor,
            },
      },
    },
  };
};
