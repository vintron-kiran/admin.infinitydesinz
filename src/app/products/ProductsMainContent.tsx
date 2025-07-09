'use client';
import React, { useState } from 'react';
import styles from './ProductsMainContent.module.css';

import AddProduct from './components/AddProduct';
import ProductImages from './components/ProductImages';
import ProductFilters from './components/ProductFilters';
import ProductFeatures from './components/ProductFeatures';
import ProductsList from './components/ProductsList';
import { getFullProductDetails } from './service';

export default function ProductsMainContent() {
  const [productId, setProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'images' | 'filters' | 'features'>('add');
  const [isAddMode, setIsAddMode] = useState(false);
const [productToEdit, setProductToEdit] = useState<any | null>(null);

  const tabs = [
    { key: 'add', label: 'Add Product', disabled: false },
    { key: 'images', label: 'Product Images', disabled: !productId },
    { key: 'filters', label: 'Product Filters', disabled: !productId },
    { key: 'features', label: 'Product Features', disabled: !productId },
  ] as const;

const handleEditProduct = async (id: string) => {
  try {
    const data = await getFullProductDetails(Number(id));
    setProductToEdit(data); // Store entire product data
    setProductId(id);
    setIsAddMode(true);
    setActiveTab('add');
  } catch (err) {
    console.error('Failed to fetch product:', err);
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {!isAddMode ? (
          <>
            <div className={styles.actions}>
              <button
                className={styles.submitBtn}
                onClick={() => {
                  setIsAddMode(true);
                  setProductId(null);
                  setActiveTab('add');
                }}
              >
                + Add Product
              </button>
            </div>
            <ProductsList onEdit={handleEditProduct} />
          </>
        ) : (
          <>
            <div className={styles.tabs}>
              {tabs.map((t) => (
                <div
                  key={t.key}
                  onClick={() => !t.disabled && setActiveTab(t.key)}
                  className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''} ${
                    t.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {t.label}
                </div>
              ))}
            </div>

            <div className={styles.content}>
              {activeTab === 'add' && (
              <AddProduct
                  onSaved={async (id) => {
                    setProductId(id);
                    const freshData = await getFullProductDetails(Number(id));
                    setProductToEdit(freshData);
                    setActiveTab('images');
                  }}
                  productToEdit={productToEdit}
                />
              )}

              {activeTab === 'images' && productId && <ProductImages productId={productId} />}
              {activeTab === 'filters' && productId && <ProductFilters productId={productId} />}
              {activeTab === 'features' && productId && <ProductFeatures productId={productId} productToEdit={productToEdit} />}

              <div className={`${styles.actions} ${styles.finalActions}`}>
                <button type="button" className={styles.submitBtn} disabled={!productId}>
                  Submit All
                </button>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setIsAddMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
