import React from 'react';
import classNames from 'classnames';
import Loader from '../Loader';
import styles from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Содержимое кнопки */
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  loading = false,
  children,
  className,
  disabled,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const buttonClassName = classNames(
    styles.button,
    {
      [styles.disabled]: disabled,
    },
    className
  );

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={buttonClassName}
    >
      {loading && <Loader size="s" color="white" />}
      <span className={styles.content}>{children}</span>
    </button>
  );
};

export default Button;
