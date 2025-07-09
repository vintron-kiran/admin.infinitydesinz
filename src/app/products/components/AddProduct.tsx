// products/components/AddProduct.tsx
'use client';

import React, { FormEvent, useState, useEffect } from 'react';
import styles from '../ProductsMainContent.module.css';
import { fetchCategories, addCategory } from '../../categories/service';
import { Category } from '../../categories/types';
import { fetchBrands, addBrand } from '../../brands/service';
import { Brand } from '../../brands/types';
import { fetchColors, addColor } from '../../colors/service';
import { Color } from '../../colors/types';
import { fetchSizes, addSize } from '../../sizes/service';
import { Size } from '../../sizes/types';
import ColorPickerComponent from '@/components/ColorPickerComponent';
import Notification from '@/components/Notification';
import { CreateProductDto } from '../types';


export interface AddProductProps {
  onSaved: (newId: string) => void;
  productToEdit?: any;
}

type Variant = {
  sku: string;
  stock: string;
  mrp: string;
  sellingPrice: string;
  size: number | '';
  color: number | '';
};

export default function AddProduct({ onSaved,productToEdit }: AddProductProps) {
  // Categories
  const [cats, setCats] = useState<Category[]>([]);
  const [mainCategoryId, setMainCategoryId] = useState(0);
  const [subCategoryId, setSubCategoryId] = useState(0);
  const [listSubCategoryId, setListSubCategoryId] = useState(0);

  // Brand / Color / Size lists
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [colorsList, setColorsList] = useState<Color[]>([]);
  const [sizesList, setSizesList] = useState<Size[]>([]);

  // Form fields
  const [sku, setSku] = useState('');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [model, setModel] = useState('');
  const [sla, setSla] = useState<number | ''>('');
  const [deliveryCharges, setDeliveryCharges] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [productStatus, setProductStatus] = useState<'enable' | 'disable'>('enable');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [stock, setStock] = useState<number | ''>('');
  const [size, setSize] = useState<number | ''>('');
  const [color, setColor] = useState<number | ''>('');
  const [mrp, setMrp] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [length, setLength] = useState<number | ''>('');
  const [variants, setVariants] = useState<Variant[]>([
    { sku: '', stock: '', mrp: '', sellingPrice: '', size: '', color: '' },
  ]);

  // New Color Modal
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColorLabel, setNewColorLabel] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

 const [notifConfig, setNotifConfig] = useState<{
  message: string;
  bgColor?: string; 
} | null>(null);
type VariantData = {
  sku: string;
  stock: number;
  mrp: number;
  sellingPrice: number;
  sizeId?: number;
  colorId?: number;
};

function showNotification(
  message: string,
  bgColor?: string,
) {
  setNotifConfig({ message, bgColor});
}
  // Load all dropdown data
  const loadCategories = async () => {
    try {
      const arr = await fetchCategories();
      setCats(arr);
    } catch {}
  };
  const loadBrands = async () => {
    try {
      const arr = await fetchBrands();
      setBrandsList(arr);
    } catch {}
  };
  const loadColors = async () => {
    try {
      const arr = await fetchColors();
      setColorsList(arr);
    } catch {}
  };
  const loadSizes = async () => {
    try {
      const arr = await fetchSizes();
      setSizesList(arr);
    } catch {}
  };
 useEffect(() => {
  const loadAndPrefill = async () => {
    try {
      const [fetchedCategories, fetchedBrands, fetchedColors, fetchedSizes] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
        fetchColors(),
        fetchSizes(),
      ]);

      setCats(fetchedCategories);
      setBrandsList(fetchedBrands);
      setColorsList(fetchedColors);
      setSizesList(fetchedSizes);

      if (!productToEdit) return;

      // ✅ Basic fields
      setSku(productToEdit.sku || '');
      setTitle(productToEdit.title || '');
      setBrand(productToEdit.brandId || '');
      setWeight(Number(productToEdit.productDetails?.weight || '') || '');
      setModel(productToEdit.productDetails?.model || '');
      setSla(Number(productToEdit.productDetails?.sla || '') || '');
      setDeliveryCharges(Number(productToEdit.productDetails?.deliveryCharges || '') || '');
      setDescription(productToEdit.description || '');
      setProductStatus(productToEdit.status ? 'enable' : 'disable');
      setSearchKeywords(productToEdit.searchKeywords || '');

      // ✅ Categories
      setMainCategoryId(productToEdit.mainCategoryId || 0);
      setSubCategoryId(productToEdit.subCategoryId || 0);
      setListSubCategoryId(productToEdit.listSubCategoryId || 0);

      // ✅ Other fields
      setStock(productToEdit.stock || '');
      setSize(productToEdit.sizeId || '');
      setColor(productToEdit.colorId || '');
      setMrp(productToEdit.mrp || '');
      setSellingPrice(productToEdit.sellingPrice || '');
      setHeight(productToEdit.height || '');
      setWidth(productToEdit.width || '');
      setLength(productToEdit.length || '');

      if (Array.isArray(productToEdit.variants)) {
        const mappedVariants = productToEdit.variants.map((v: VariantData) => ({
          sku: v.sku || '',
          stock: String(v.stock || ''),
          mrp: String(v.mrp || ''),
          sellingPrice: String(v.sellingPrice || ''),
          size: v.sizeId || '',
          color: v.colorId || '',
        }));
        setVariants(mappedVariants);
      }
    } catch (error) {
      console.error('Error loading or pre-filling data:', error);
    }
  };

  loadAndPrefill();
}, []);



const menuOptions = cats.filter((c) => c.parent_id == null);
const subMenuOptions = cats.filter((c) => c.parent_id === Number(mainCategoryId));
const listSubOptions = cats.filter((c) => c.parent_id === Number(subCategoryId));

  // Creation handlers
  const handleCreateCategory = async (
    parentId: number | '',
    promptText: string,
    createFn: (data: FormData) => Promise<Category>,
    onCreated: (id: number) => void
  ) => {
    if (!parentId) {
      showNotification('Please select a parent first', '#F00');

     
    
      return;
    }
    const name = window.prompt(promptText);
    if (!name) return;
    const form = new FormData();
    form.append('title', name);
    form.append('parent_id', String(parentId));
    try {
      const created = await createFn(form);
      await loadCategories();
      if (created.id !== undefined) onCreated(created.id);
        showNotification('Created and selected.');

    } catch {
         showNotification('Creation failed.', '#F00');
     
    }
  };
  const handleCreateSubMenu = () =>
  handleCreateCategory(mainCategoryId, 'Enter new Sub Category name:', addCategory, setSubCategoryId);

const handleCreateListSubMenu = () =>
  handleCreateCategory(subCategoryId, 'Enter new List Sub Category name:', addCategory, setListSubCategoryId);
  const handleCreateBrand = async () => {
    const name = window.prompt('Enter new Brand name:');
    if (!name) return;
    try {
      const created = await addBrand({ name, logo_url: '', status: true });
      await loadBrands();
      if (created.id !== undefined) setBrand(created.id);
         showNotification('Brand created and selected.');
    } catch {
       showNotification('Failed to create Brand','#F00');
    
    }
  };

  const openColorModal = () => {
    setNewColorLabel('');
    setNewColorHex('#000000');
    setShowColorModal(true);
  };

  const handleColorSubmit = async () => {
    if (!newColorLabel.trim()) {
       showNotification('Label required','#F00');
      
      return;
    }
    try {
      const created = await addColor({
        label: newColorLabel,
        hex_code: newColorHex,
        status: true,
      });
      await loadColors();
      if (created.id !== undefined) setColor(created.id);
      setShowColorModal(false);
         showNotification('Color created and selected.');
     
    } catch {
      showNotification('Failed to create Color','#F00');    
   
    }
  };

  const handleCreateSize = async () => {
    const name = window.prompt('Enter new Size name:');
    if (!name) return;
    try {
      const created = await addSize({ title: name, status: true });
      await loadSizes();
      if (created.id !== undefined) setSize(created.id);
       showNotification('Size created and selected.');
  
    } catch {
            showNotification('Failed to create Size','#F00');    

   
    }
  };

  // Variants
  const addVariantRow = () => {
    setVariants([
      ...variants,
      { sku: '', stock: '', mrp: '', sellingPrice: '', size: '', color: '' },
    ]);
  };
  const updateVariant = (
    i: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const copy = [...variants];
    // @ts-ignore
    copy[i][field] = value;
    setVariants(copy);
  };

  // Save form
const handleSave = async (e: FormEvent) => {
  e.preventDefault();

  try {
    const productData: CreateProductDto = {
      sku: sku,
      title,
      brandId: Number(brand),
      description,
      searchKeywords,
      mainCategoryId: Number(mainCategoryId) || undefined,
      subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
      listSubCategoryId: listSubCategoryId ? Number(listSubCategoryId) : undefined,
      status: productStatus === 'enable',
      stock: Number(stock),
      sizeId: size ? Number(size) : undefined,
      colorId: color ? Number(color) : undefined,
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      height: height ? Number(height) : undefined,
      width: width ? Number(width) : undefined,
      length: length ? Number(length) : undefined,
      productDetails: {
        weight: weight ? Number(weight) : undefined,
        model,
        sla: sla ? Number(sla) : undefined,
        deliveryCharges: deliveryCharges ? Number(deliveryCharges) : undefined,
      },
      variants: variants
        .filter((v) => v.sku)
        .map((v) => ({
          sku: v.sku,
          stock: Number(v.stock),
          mrp: Number(v.mrp),
          sellingPrice: Number(v.sellingPrice),
          sizeId: v.size ? Number(v.size) : undefined,
          colorId: v.color ? Number(v.color) : undefined,
        })),
    };

    const token = localStorage.getItem('authToken');
    const isEditing = !!productToEdit?.id;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products${isEditing ? `/${productToEdit.id}` : ''}`,
      {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      }
    );

    if (!res.ok) throw new Error('Failed to save product');

    const result = await res.json();
    showNotification(isEditing ? 'Product updated successfully' : 'Product saved successfully');
    onSaved(result.id);
  } catch (err) {
    console.error(err);
    showNotification('Error saving product', '#F00');
  }
};



  return (
    <>
    {notifConfig && (
  <Notification
        message={notifConfig.message}
        onClose={() => setNotifConfig(null)}
        bgColor={notifConfig.bgColor}
        />
    )}
      <form onSubmit={handleSave}>
        {/* Category Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Category Details</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.col4}>
              <label className={styles.label}>Menu *</label>
            <select
                value={mainCategoryId}
                onChange={(e) => {
                  setMainCategoryId(Number(e.target.value));
                  setSubCategoryId(0);
                  setListSubCategoryId(0);
                }}
                className={styles.select}
              >
                <option value="">--Choose Menu--</option>
                {menuOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col4}>
              <label className={styles.label}>
                Sub Menu *
                <button
                  type="button"
                  className={styles.hint}
                  onClick={handleCreateSubMenu}
                >
                  Create Sub Menu
                </button>
              </label>
           <select
              value={subCategoryId}
              onChange={(e) => {
                setSubCategoryId(Number(e.target.value));
                setListSubCategoryId(0);
              }}
              disabled={!mainCategoryId}
              className={styles.select}
            >

                <option value="">--Choose Sub Menu--</option>
                {subMenuOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col4}>
              <label className={styles.label}>
                List Sub Menu *
                <button
                  type="button"
                  className={styles.hint}
                  onClick={handleCreateListSubMenu}
                >
                  Create List Sub Menu
                </button>
              </label>
              <select
                  value={listSubCategoryId}
                  onChange={(e) => setListSubCategoryId(Number(e.target.value))}
                  disabled={!subCategoryId}
                  className={styles.select}
                >
                <option value="">--Choose List Sub Menu--</option>
                {listSubOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Product Details</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.col3}>
              <label className={styles.label}>SKU Code *</label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={styles.input}
                placeholder="SKU CODE"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                placeholder="Title"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>
                Brand
                <button
                  type="button"
                  className={styles.hint}
                  onClick={handleCreateBrand}
                >
                  Create Brand
                </button>
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(Number(e.target.value))}
                className={styles.select}
              >
                <option value="">--Choose Brand--</option>
                {brandsList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>Weight (gms) *</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={styles.input}
                placeholder="Product weight"
              />
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.col3}>
              <label className={styles.label}>Model *</label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={styles.input}
                placeholder="Model details"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>SLA (Delivery Days) *</label>
              <input
                type="number"
                value={sla}
                onChange={(e) => setSla(Number(e.target.value))}
                className={styles.input}
                placeholder="SLA (Delivery Days)"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>Delivery Charges *</label>
              <input
                type="number"
                value={deliveryCharges}
                onChange={(e) =>
                  setDeliveryCharges(Number(e.target.value))
                }
                className={styles.input}
                placeholder="Delivery Charges"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>Product Status *</label>
              <select
                value={productStatus}
                onChange={(e) =>
                  setProductStatus(e.target.value as 'enable' | 'disable')
                }
                className={styles.select}
              >
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.col12}>
              <label className={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Description"
              />
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.col6}>
              <label className={styles.label}>
                Search Keywords{' '}
                <span className="text-xs text-gray-500">
                  (comma separated)
                </span>
              </label>
              <input
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                className={styles.input}
                placeholder="Search Keywords"
              />
            </div>
          </div>
        </div>

        {/* Price & Color/Size Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Price & Color/Size Details
          </h3>
          <div className={styles.fieldGrid}>
            <div className={styles.col3}>
              <label className={styles.label}>Stock *</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className={styles.input}
                placeholder="Available stock"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>
                Size{' '}
                <span className="text-xs text-gray-500">(Optional)</span>
                <button
                  type="button"
                  className={styles.hint}
                  onClick={handleCreateSize}
                >
                  Create Size
                </button>
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className={styles.select}
              >
                <option value="">--Choose Size--</option>
                {sizesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>
                Color{' '}
                <span className="text-xs text-gray-500">(Optional)</span>
                <button
                  type="button"
                  className={styles.hint}
                  onClick={openColorModal}
                >
                  Add Color
                </button>
              </label>
              <select
                value={color}
                onChange={(e) => setColor(Number(e.target.value))}
                className={styles.select}
              >
                <option value="">--Choose Color--</option>
                {colorsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>MRP *</label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className={styles.input}
                placeholder="MRP"
              />
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.col3}>
              <label className={styles.label}>Selling Price *</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) =>
                  setSellingPrice(Number(e.target.value))
                }
                className={styles.input}
                placeholder="Selling Price"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) =>
                  setHeight(Number(e.target.value))
                }
                className={styles.input}
                placeholder="Height"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>Width (cm)</label>
              <input
                type="number"
                value={width}
                onChange={(e) =>
                  setWidth(Number(e.target.value))
                }
                className={styles.input}
                placeholder="Width"
              />
            </div>
            <div className={styles.col3}>
              <label className={styles.label}>Length (cm)</label>
              <input
                type="number"
                value={length}
                onChange={(e) =>
                  setLength(Number(e.target.value))
                }
                className={styles.input}
                placeholder="Length"
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Option to add more Size/Color in same product
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU *</th>
                <th>Stock *</th>
                <th>MRP *</th>
                <th>Selling Price *</th>
                <th>Size</th>
                <th>Color</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) =>
                        updateVariant(i, 'sku', e.target.value)
                      }
                      className={styles.input}
                      placeholder="SKU"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={v.stock}
                      onChange={(e) =>
                        updateVariant(i, 'stock', e.target.value)
                      }
                      className={styles.input}
                      placeholder="Stock"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={v.mrp}
                      onChange={(e) =>
                        updateVariant(i, 'mrp', e.target.value)
                      }
                      className={styles.input}
                      placeholder="MRP"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={v.sellingPrice}
                      onChange={(e) =>
                        updateVariant(i, 'sellingPrice', e.target.value)
                      }
                      className={styles.input}
                      placeholder="Selling Price"
                    />
                  </td>
                  <td>
                    <select
                      value={v.size}
                      onChange={(e) =>
                        updateVariant(i, 'size', Number(e.target.value))
                      }
                      className={styles.select}
                    >
                      <option value="">Size</option>
                      {sizesList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={v.color}
                      onChange={(e) =>
                        updateVariant(i, 'color', Number(e.target.value))
                      }
                      className={styles.select}
                    >
                      <option value="">Color</option>
                      {colorsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.addVariantBtn}
                      onClick={addVariantRow}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save */}
        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn}>
            Save
          </button>
        </div>
      </form>

      {/* New Color Modal */}
      {showColorModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99999,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            <h3 className="mb-4">Add New Color</h3>
            <div className="mb-3">
              <label className="form-label">Label</label>
              <input
                type="text"
                className="form-control"
                value={newColorLabel}
                onChange={(e) => setNewColorLabel(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Hex Code</label>
              <ColorPickerComponent
                color={newColorHex}
                setColor={(hex, label) => {
                  setNewColorHex(hex);
                  if (label) setNewColorLabel(label);
                }}
              />
              <input
                type="text"
                className="form-control mt-2"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
              />
            </div>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setShowColorModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleColorSubmit}
              >
                Add Color
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
