// products/components/ProductImages.tsx
import React, { FormEvent } from 'react';
import styles from '../ProductsMainContent.module.css';

interface ProductImagesProps {
  productId: string;
}

export default function ProductImages({ productId }: ProductImagesProps) {
  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    // TODO: upload images for the given productId
  };

  return (
    <form onSubmit={handleUpload}>
      {/* Main Product Images */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Main Product Images</h3>
        <div className={styles.fieldGrid}>
          <div className={styles.col6}>
            <label className={styles.label}>Product Image</label>
            <input type="file" name="main_image" className={styles.input} />
          </div>
          <div className={styles.col6}>
            <label className={styles.label}>
              Upload Multiple Images <span className="text-gray-500 text-xs">(Size: …)</span>
            </label>
            <input type="file" multiple name="multiple_images" className={styles.input} />
          </div>
        </div>
      </div>

      {/* Variant 1 Images */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Variant 1 Images</h3>
        <div className={styles.fieldGrid}>
          <div className={styles.col6}>
            <label className={styles.label}>Variant 1 Image</label>
            <input type="file" name="variant_1_image" className={styles.input} />
          </div>
          <div className={styles.col6}>
            <label className={styles.label}>
              Upload Multiple Variant 1 Images <span className="text-gray-500 text-xs">(Size: …)</span>
            </label>
            <input type="file" multiple name="variant_1_images" className={styles.input} />
          </div>
        </div>
      </div>

      {/* Variant 2 Images */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Variant 2 Images</h3>
        <div className={styles.fieldGrid}>
          <div className={styles.col6}>
            <label className={styles.label}>Variant 2 Image</label>
            <input type="file" name="variant_2_image" className={styles.input} />
          </div>
          <div className={styles.col6}>
            <label className={styles.label}>
              Upload Multiple Variant 2 Images <span className="text-gray-500 text-xs">(Size: …)</span>
            </label>
            <input type="file" multiple name="variant_2_images" className={styles.input} />
          </div>
        </div>
      </div>

      {/* Variant 3 Images */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Variant 3 Images</h3>
        <div className={styles.fieldGrid}>
          <div className={styles.col6}>
            <label className={styles.label}>Variant 3 Image</label>
            <input type="file" name="variant_3_image" className={styles.input} />
          </div>
          <div className={styles.col6}>
            <label className={styles.label}>
              Upload Multiple Variant 3 Images <span className="text-gray-500 text-xs">(Size: …)</span>
            </label>
            <input type="file" multiple name="variant_3_images" className={styles.input} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          Upload Images
        </button>
        <button type="reset" className={styles.resetBtn}>
          Reset
        </button>
      </div>
    </form>
  );
}
