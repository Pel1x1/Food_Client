import * as React from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';

const viewToClass: Record<NonNullable<TextProps['view']>, string> = {
  title: styles.title,
  button: styles.button,
  'p-20': styles.p20,
  'p-18': styles.p18,
  'p-16': styles.p16,
  'p-14': styles.p14,
};

const weightToClass: Record<NonNullable<TextProps['weight']>, string> = {
  normal: styles.normal,
  medium: styles.medium,
  bold: styles.bold,
};

const colorToClass: Record<NonNullable<TextProps['color']>, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  accent: styles.accent,
};

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
};

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag,
  weight,
  children,
  color,
  maxLines,
}) => {
  const Component: React.ElementType = tag || 'div';
  const classes = classNames(
    styles.text,
    view && viewToClass[view],
    weight && weightToClass[weight],
    color && colorToClass[color],
    maxLines && styles.clamp,
    className
  );

  const style =
    maxLines !== undefined
      ? { WebkitLineClamp: maxLines } as React.CSSProperties
      : undefined;

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
};

export default Text;
