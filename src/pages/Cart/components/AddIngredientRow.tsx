// components/AddIngredientRow.tsx
import React, { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { cartStore } from '@/stores/cartStore';
import styles from '../Cart.module.scss';

type AddIngredientRowProps = { documentId: string };

const AddIngredientRow: React.FC<AddIngredientRowProps> = ({ documentId }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const submit = () => {
    cartStore.addIngredient(documentId, name, amount);
    setName('');
    setAmount('');
  };

  return (
    <li className={styles.addIngredientRow}>
      <input
        className={styles.ingredientInput}
        placeholder="New ingredient..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <input
        className={styles.ingredientInputSmall}
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <button className={styles.iconBtnAdd} onClick={submit} title="Add">
        <LuPlus size={14} />
      </button>
    </li>
  );
};

export default AddIngredientRow;
