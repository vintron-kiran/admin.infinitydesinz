'use client';
import React, { useEffect, useState } from 'react';
import styles from '../ProductsMainContent.module.css';
import { getProducts, deleteProduct, updateProduct } from '../service';
import { CreateProductDto } from '../types';

interface ProductsListProps {
  onEdit: (productId: string) => void;
}

export default function ProductsList({ onEdit }: ProductsListProps) {
  const [products, setProducts] = useState<CreateProductDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
     const allIds = filteredProducts.map((p) => p.id).filter((id): id is number => typeof id === 'number');
setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(String(id));
    fetchProducts();
  };

  const handleBulkStatusChange = async (newStatus: boolean) => {
    await Promise.all(
      selectedIds.map(async (id) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;
        await updateProduct(String(id), {
          ...product,
          status: newStatus,
        });
      })
    );
    setSelectedIds([]);
    fetchProducts();
  };

  const handleStatusToggle = async (product: CreateProductDto) => {
    await updateProduct(String(product.id), { ...product, status: !product.status });
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && p.status) ||
      (filterStatus === 'inactive' && !p.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or SKU"
          value={search}
          onChange={handleSearch}
          className={styles.input}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className={styles.select}
        >
          <option value="all">All</option>
          <option value="active">Enabled</option>
          <option value="inactive">Disabled</option>
        </select>

        {selectedIds.length > 0 && (
          <>
            <button
              className={styles.submitBtn}
              onClick={() => handleBulkStatusChange(true)}
            >
              Enable Selected
            </button>
            <button
              className={styles.resetBtn}
              onClick={() => handleBulkStatusChange(false)}
            >
              Disable Selected
            </button>
          </>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                }
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>SKU</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            
            <tr key={product.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id!)}
                  onChange={() => handleSelect(product.id!)}
                />
              </td>
              <td>{product.id}</td>
              <td>{product.sku}</td>
              <td>{product.title}</td>
              <td>
                <button
                  onClick={() => handleStatusToggle(product)}
                  className={product.status ? styles.enabled : styles.disabled}
                >
                  {product.status ? '🟢' : '🔴'}
                </button>
              </td>
              <td>
                <button className={styles.editBtn} onClick={() => onEdit(String(product.id))}>✏️</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(product.id!)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
