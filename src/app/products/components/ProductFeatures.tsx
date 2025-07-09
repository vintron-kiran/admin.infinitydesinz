'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import styles from '../ProductsMainContent.module.css';
import { getCategoryById } from '@/app/categories/service';
import { createProductFeature, getFeaturesByProduct } from '../service';
import Notification from '@/components/Notification';

interface ProductFeaturesProps {
  productId: string;
  productToEdit: any;
}

interface CategoryFeature {
  featureId: number;
  feature: {
    id: number;
    name: string;
  };
}

interface ExistingFeature {
  featureId: number;
  value: string;
}

export default function ProductFeatures({ productId, productToEdit }: ProductFeaturesProps) {
  const [categoryFeatures, setCategoryFeatures] = useState<CategoryFeature[]>([]);
  const [existingValues, setExistingValues] = useState<ExistingFeature[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
console.log('productId',productId);
  useEffect(() => {
    const leafCategoryId =
      productToEdit?.listSubCategoryId || productToEdit?.subCategoryId || productToEdit?.categoryId;

    if (!leafCategoryId) return;

    getCategoryById(leafCategoryId)
      .then((data) => {
        if (data?.categoryFeatures) {
          setCategoryFeatures(data.categoryFeatures);
        }
      })
      .catch((err) => console.error('Error fetching category features:', err));
  }, [productToEdit]);

  useEffect(() => {
    if (productId) {
      getFeaturesByProduct(productId)
        .then(setExistingValues)
        .catch((err) => console.error('Error fetching existing features:', err));
    }
  }, [productId]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const features = categoryFeatures.map((cf) => ({
      productId: Number(productId),
      featureId: cf.featureId,
      value: formData.get(cf.feature.name)?.toString() || '',
    }));

    console.log('🔄 Submitting:', features);

    try {
      setSaving(true);
      for (const f of features) {
        await createProductFeature(f);
      }
      setNotification('✅ Product features saved successfully.');
    } catch (err) {
      console.error('❌ Error saving:', err);
      setNotification('❌ Failed to save features.');
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSave}>
      {notification && (
        <Notification message={notification} onClose={() => setNotification(null)} />
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Product Features</h3>
        <div className={styles.fieldGrid}>
          {categoryFeatures.map((cf) => {
            const fieldName = cf.feature.name;
            const existing = existingValues.find((f) => f.featureId === cf.featureId)?.value || '';
            return (
              <div className={styles.col3} key={cf.featureId}>
                <label htmlFor={fieldName} className={styles.label}>
                  {fieldName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  id={fieldName}
                  name={fieldName}
                  defaultValue={existing}
                  className={styles.input}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Features'}
        </button>
        <button type="reset" className={styles.resetBtn}>Reset</button>
      </div>
    </form>
  );
}
