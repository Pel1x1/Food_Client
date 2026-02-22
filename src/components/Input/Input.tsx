import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  afterSlot,
  className,
  disabled,
  type = 'text',
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={classNames(
        styles.input,
        { [styles.disabled]: disabled },
        className
      )}
    >
      <input
        className={styles.field}
        type={type}
        value={value ?? ''}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      {afterSlot && <div className={styles.icon}>{afterSlot}</div>}
    </div>
  );
};

export default Input;
