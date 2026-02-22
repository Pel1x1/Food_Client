import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import Input from '@/components/Input';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import styles from './MultiDropdown.module.scss';

export type Option = {
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};



const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled = false,
  getTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне компонента и сброс фильтра
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilter('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Фильтрация опций
  const filteredOptions = useMemo(() => {
    if (!filter) return options;
    const f = filter.toLowerCase();
    return options.filter((o) => o.value.toLowerCase().includes(f));
  }, [options, filter]);

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some((v) => v.key === option.key);
    const newValue = isSelected
      ? value.filter((v) => v.key !== option.key)
      : [...value, option];

    onChange(newValue);
  };

  const title = getTitle(value);

  const inputValue = isOpen ? filter : value.length > 0 ? title : '';
  const placeholder = value.length > 0 ? '' : title;

  const handleInputClick = () => {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (val: string) => {
    if (disabled) return;
    setFilter(val);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={cn(styles.multiDropdown, className)}>
      <div onClick={handleInputClick}>
        <Input
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          afterSlot={<ArrowDownIcon color="secondary" />}
        />
      </div>

      {isOpen && !disabled && (
        <div className={styles.optionsList}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = value.some((v) => v.key === option.key);
              return (
                <div
                  key={option.key}
                  className={cn(styles.option, {
                    [styles.optionSelected]: isSelected,
                  })}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.value}
                </div>
              );
            })
          ) : (
            <div className={styles.empty}>Нет совпадений</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
