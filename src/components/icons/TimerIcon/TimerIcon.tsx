import * as React from 'react';
import Icon from '@/components/icons/Icon';
import type { IconProps } from '@/components/icons/Icon';

const TimerIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon viewBox="0 0 14 14" width={14} height={14} {...props}>
      <path
        d="M10.9318 0.75L12.75 2.56818M10.5682 10.5682L12.0227 12.75M2.56818 0.75L0.75 2.56818M2.93182 10.5682L1.47727 12.75M6.56818 3.65909V6.93182H8.38636M12.0227 6.75C12.0227 9.66207 9.66207 12.0227 6.75 12.0227C3.83795 12.0227 1.47727 9.66207 1.47727 6.75C1.47727 3.83796 3.83795 1.47727 6.75 1.47727C9.66207 1.47727 12.0227 3.83796 12.0227 6.75Z"
        stroke="#B5460F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default TimerIcon;

