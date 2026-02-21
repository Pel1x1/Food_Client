import * as React from 'react';
import Icon from '@/components/icons/Icon';
import type { IconProps } from '@/components/icons/Icon';


export const CheckIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        d="M4 11.6129L9.87755 18L20 7"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Icon>
  );
};

export default CheckIcon;
