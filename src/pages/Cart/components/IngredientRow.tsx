// components/IngredientRow.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { LuPencil, LuCheck, LuX } from 'react-icons/lu';
import { cartStore, type CartIngredient } from '@/stores/cartStore';
import styles from '../Cart.module.scss';

type IngredientRowProps = {
  documentId: string;
  ingredient: CartIngredient;
};

const IngredientRow: React.FC<IngredientRowProps> = observer(({ documentId, ingredient }) => {
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(ingredient.name);
  const [amountDraft, setAmountDraft] = useState(ingredient.amount ?? '');

  const confirm = () => {
    cartStore.updateIngredient(documentId, ingredient.id, nameDraft, amountDraft);
    setEditing(false);
  };

  const cancel = () => {
    setNameDraft(ingredient.name);
    setAmountDraft(ingredient.amount ?? '');
    setEditing(false);
  };

  return (
    <li className={styles.ingredientRow}>
      <span className={styles.ingredientDot} />
      {editing ? (
        <>
          <input
            className={styles.ingredientInput}
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="Ingredient"
          />
          <input
            className={styles.ingredientInputSmall}
            value={amountDraft}
            onChange={(e) => setAmountDraft(e.target.value)}
            placeholder="Amount"
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirm();
              if (e.key === 'Escape') cancel();
            }}
          />
          <button className={styles.iconBtn} onClick={confirm} title="Save">
            <LuCheck size={14} />
          </button>
          <button className={styles.iconBtn} onClick={cancel} title="Cancel">
            <LuX size={14} />
          </button>
        </>
      ) : (
        <>
          <span className={styles.ingredientName}>
            {ingredient.name}
            {ingredient.amount && (
              <span className={styles.ingredientAmount}>
                {' '}
                · {ingredient.amount} {ingredient.unit}{' '}
              </span>
            )}
          </span>
          <button
            className={styles.iconBtn}
            onClick={() => {
              setNameDraft(ingredient.name);
              setAmountDraft(ingredient.amount ?? '');
              setEditing(true);
            }}
            title="Edit"
          >
            <LuPencil size={14} />
          </button>
          <button
            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
            onClick={() => cartStore.removeIngredient(documentId, ingredient.id)}
            title="Remove"
          >
            <LuX size={14} />
          </button>
        </>
      )}
    </li>
  );
});

export default IngredientRow;
