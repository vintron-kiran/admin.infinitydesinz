'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchMainCategoryPromotions,
  addMainCategoryPromotion,
  updateMainCategoryPromotion,
  deleteMainCategoryPromotion,
} from './service';
import { MainCategoryPromotion } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function MainCategoryPromotionMainContent() {
  const [promotions, setMainCategoryPromotions] = useState<MainCategoryPromotion[]>([]);
  const [formData, setFormData] = useState<Partial<MainCategoryPromotion>>(initialFormData());
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMainCategoryPromotions();
        setMainCategoryPromotions(data);
      } catch (err) {
        console.error(err);
        setMainCategoryPromotions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function initialFormData() {
    return {
      title: '',
      position: '',
      display_count: 1,
      display_rows: 1,
      status: true,
    };
  }

  function resetForm() {
    setFormData(initialFormData());
    setFile(null);
    setPreview('');
    setEditingId(null);
    setShowForm(false);
  }

  function populateForm(promotion: MainCategoryPromotion) {
    setFormData({
      title: promotion.title,
      position: promotion.position,
      display_count: promotion.display_count,
      display_rows: promotion.display_rows,
      status: promotion.status,
    });
    setPreview(`${process.env.NEXT_PUBLIC_API_UPLOADS_URL}/promotions/${promotion.image_url}`);
    setFile(null);
    setEditingId(promotion.id);
    setShowForm(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'display_count' || name === 'display_rows'
        ? Number(value)
        : name === 'status'
        ? value === 'true'
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const handleAddClick = () => {
    setFormData(initialFormData());
    setFile(null);
    setPreview('');
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title || '');
    fd.append('position', formData.position || '');
    fd.append('display_count', String(formData.display_count || 1));
    fd.append('display_rows', String(formData.display_rows || 1));
    fd.append('status', String(formData.status));
    if (file) fd.append('image', file);

    try {
      if (editingId !== null) {
        await updateMainCategoryPromotion(editingId, fd);
      } else {
        await addMainCategoryPromotion(fd);
      }
      const updated = await fetchMainCategoryPromotions();
      setMainCategoryPromotions(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to save promotion');
    }

    resetForm();
  };

  const handleDelete = (id: number) => setConfirmDeleteId(id);

  if (loading) return <div className="p-4 text-gray-600">Loading promotions…</div>;

  return (
    <div className="container-fluid px-5 py-4">
      <div className="main-header mb-3 d-flex justify-content-between align-items-center">
        <h4>MainCategory Promotions - Manage</h4>
        <button className="btn btn-primary" onClick={handleAddClick}>+ Add New</button>
      </div>

      {showForm && (
        <div className="card mb-4 p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Title</label>
                <input name="title" value={formData.title || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4 mb-3">
                <label>Position</label>
                <input name="position" value={formData.position || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-2 mb-3">
                <label>Display Count</label>
                <input name="display_count" type="number" value={formData.display_count || 1} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-2 mb-3">
                <label>Display Rows</label>
                <input name="display_rows" type="number" value={formData.display_rows || 1} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6 mb-3">
                <label>Image</label>
                <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                {preview && <img src={preview} className="img-thumbnail mt-2" style={{ maxWidth: '150px' }} />}
              </div>
              <div className="col-md-3 mb-3">
                <label>Status</label>
                <select name="status" className="form-select" value={formData.status ? 'true' : 'false'} onChange={handleChange}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-success">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Position</th>
                <th>Display</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>
                    <img src={`${process.env.NEXT_PUBLIC_API_UPLOADS_URL}/promotions/${p.image_url}`} className="img-thumbnail" style={{ maxWidth: '100px' }} />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.position}</td>
                  <td>{p.display_count}x{p.display_rows}</td>
                  <td><span className={`badge ${p.status ? 'bg-success' : 'bg-danger'}`}>{p.status ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className="btn btn-outline-success btn-sm me-2" onClick={() => populateForm(p)}><i className="ti-pencil-alt" /></button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p.id)}><i className="ti-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal<MainCategoryPromotion>
        itemId={confirmDeleteId}
        deleteFn={deleteMainCategoryPromotion}
        setItems={setMainCategoryPromotions}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this promotion?"
      />
    </div>
  );
}
