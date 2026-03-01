import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './CheckBox.module.scss';
import CheckIcon from '../icons/CheckIcon';

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onChange,
  disabled,
  className,
  id,
  ...props
}) => {
  const [internalChecked, setInternalChecked] = useState(checked ?? false);
  const isControlled = checked !== undefined;
  const effectiveChecked = isControlled ? checked : internalChecked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      const newChecked = event.target.checked;
      if (!isControlled) setInternalChecked(newChecked);
      onChange(newChecked);
    }
  };

  const checkBoxClasses = classNames(
    styles.box,
    {
      [styles.disabled]: disabled,
      [styles.checked]: effectiveChecked,
    },
    className
  );

  return (
    <label className={styles.checkbox} htmlFor={id}>
      <input
        {...props}
        id={id}
        type="checkbox"
        checked={effectiveChecked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={checkBoxClasses}>
        {effectiveChecked && (
          <CheckIcon width={40} height={40} color={!disabled ? 'accent' : undefined} />
        )}
      </span>
    </label>
  );
};

export default CheckBox;
