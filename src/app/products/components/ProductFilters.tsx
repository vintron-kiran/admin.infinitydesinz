// products/components/ProductFilters.tsx
import React, { FormEvent } from 'react';
import styles from '../ProductsMainContent.module.css';

interface ProductFiltersProps {
  productId: string;
}

export default function ProductFilters({ productId }: ProductFiltersProps) {
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // TODO: save filters for productId
  };

  return (
    <form onSubmit={handleSave}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Product Filters</h3>
        <div className={styles.fieldGrid}>
          <div className={styles.col6}>
            <label htmlFor="fabric" className={styles.label}>Fabric</label>
            <select id="fabric" name="fabric" defaultValue="" className={styles.select}>
              <option value="">--Choose Fabric--</option>
              <option value="nylon">Nylon</option>
            </select>
          </div>
          <div className={styles.col6}>
            <label htmlFor="design" className={styles.label}>Design</label>
            <select id="design" name="design" defaultValue="" className={styles.select}>
              <option value="">--Choose Design--</option>
              <option value="plaid">Plaid</option>
            </select>
          </div>
          <div className={styles.col6}>
            <label htmlFor="occasion" className={styles.label}>Occasion</label>
            <select id="occasion" name="occasion" defaultValue="" className={styles.select}>
              <option value="">--Choose Occasion--</option>
              <option value="party">Party</option>
            </select>
          </div>
          <div className={styles.col6}>
            <label htmlFor="type" className={styles.label}>Type</label>
            <select id="type" name="type" defaultValue="" className={styles.select}>
              <option value="">--Choose Type--</option>
              <option value="blouse">Blouse</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          Update Filters
        </button>
        <button type="reset" className={styles.resetBtn}>
          Reset
        </button>
      </div>
    </form>
  );
}
