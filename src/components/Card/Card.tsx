import React from 'react';
import classNames from 'classnames';
import Text from '../Text';
import styles from './Card.module.scss';

export type CardProps = {
    /** Дополнительный classname */
    className?: string,
    /** URL изображения */
    image: string;
    /** Слот над заголовком */
    captionSlot?: React.ReactNode;
    /** Заголовок карточки */
    title: React.ReactNode;
    /** Описание карточки */
    subtitle: React.ReactNode;
    /** Содержимое карточки (футер/боковая часть), может быть пустым */
    contentSlot?: React.ReactNode;
    /** Клик на карточку */
    onClick?: React.MouseEventHandler;
    /** Слот для действия */
    actionSlot?: React.ReactNode;
};


const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  const isClickable = Boolean(onClick);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!isClickable) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Space иначе может скроллить страницу
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      className={classNames(styles.card, className)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={image} alt="" />
      </div>

      <div className={styles.body}>
        <div className={styles.bodyText}>
          {captionSlot && (
            <Text className={styles.caption} weight="medium" view="p-16" color="primary" maxLines={1}>
              {captionSlot}
            </Text>
          )}

          <Text className={styles.title} weight="medium" view="p-20" color="primary" maxLines={1}>
            {title}
          </Text>

          <Text className={styles.subtitle} weight="normal" view="p-16" color="secondary" maxLines={3}>
            {subtitle}
          </Text>
        </div>

        {(contentSlot || actionSlot) && (
          <div className={styles.footer}>
            {contentSlot && <div className={styles.content}>{contentSlot}</div>}

            {actionSlot && (
              <div className={styles.action} onClick={(e) => e.stopPropagation()}>
                {actionSlot}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
