// src/components/icons/Icon/Icon.tsx
import * as React from 'react';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
};

const colorMap: Record<NonNullable<IconProps['color']>, string> = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  accent: 'var(--text-accent)',
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  width = 24,
  height = 24,
  color,
  children,
  style,
  ...rest
}) => {
  const resolvedColor = color ? colorMap[color] : 'currentColor';

  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: resolvedColor, ...style }}
      {...rest}
    >
      {children}
    </svg>
  );
};

export default Icon;
