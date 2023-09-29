import { Icon, IconProps } from '@chakra-ui/react';

import { getColorStyle } from './utils';

export const DoubleArrowIcon = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 24 24" {...props} {...getColorStyle(props)}>
      <path d="M15.5 5H11l5 7-5 7h4.5l5-7z"></path>
      <path d="M8.5 5H4l5 7-5 7h4.5l5-7z"></path>
    </Icon>
  );
};
