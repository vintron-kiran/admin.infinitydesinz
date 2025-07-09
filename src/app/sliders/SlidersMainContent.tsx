'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchSliders,
  addSlider,
  updateSlider,
  deleteSlider,
} from './service';
import { Slider } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function SlidersMainContent() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    priority: 1,
    status: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSliders();
        setSliders(data);
      } catch (err) {
        console.error(err);
        setSliders([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : name === 'priority' ? +value : name === 'status' ? value === 'true' : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const handleAddClick = () => {
    setFormData({ title: '', link: '', priority: 1, status: true });
    setFile(null);
    setPreview('');
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (slider: Slider) => {
    setFormData({
      title: slider.title,
      link: slider.link || '',
      priority: slider.priority,
      status: slider.status,
    });
    setPreview(`${process.env.NEXT_PUBLIC_API_URL}/${slider.image_url}`);
    setFile(null);
    setEditingId(slider.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('priority', String(formData.priority));
    fd.append('status', String(formData.status));
    if (formData.link) fd.append('link', formData.link);
    if (file) fd.append('image', file);

    try {
      if (editingId !== null) {
        await updateSlider(editingId, fd);
      } else {
        await addSlider(fd);
      }
      const updated = await fetchSliders();
      setSliders(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to save slider');
    }
    setShowForm(false);
    setEditingId(null);
    setFile(null);
    setPreview('');
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Loading sliders…</div>;
  }

  return (
    <div className="container-fluid px-5 py-4" style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div className="main-header mb-3 d-flex justify-content-between align-items-center">
        <h4>Sliders - Manage</h4>
        <button className="btn btn-primary" onClick={handleAddClick}>+ Add New</button>
      </div>

      {showForm && (
        <div className="card mb-4 p-3">
          <div className="card-body">
            <h5>{editingId ? 'Edit Slider' : 'Create a Slider'}</h5>
            <form onSubmit={handleSubmit} className="row">
              <div className="col-md-6 mb-3">
                <label>Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Link</label>
                <input
                  className="form-control"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Priority</label>
                <input
                  type="number"
                  className="form-control"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status ? 'true' : 'false'}
                  onChange={handleChange}
                >
                  <option value="true">Active</option>
                  <option value="false">In Active</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid mt-2"
                    style={{ maxWidth: '200px' }}
                  />
                )}
              </div>
              <div className="col-12 text-center">
                <button className="btn btn-success px-4">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card p-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Sliders</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Link</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sliders.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_UPLOADS_URL}/sliders/${s.image_url}`}
                        alt={s.title}
                        className="img-thumbnail"
                        style={{ maxWidth: '100px' }}
                      />
                    </td>
                    <td>{s.title}</td>
                    <td>{s.link ? <a href={s.link} target="_blank" rel="noreferrer">{s.link}</a> : '-'}</td>
                    <td>{s.priority}</td>
                    <td>
                      <span className={`badge ${s.status ? 'bg-success' : 'bg-danger'}`}>
                        {s.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-success btn-sm me-2"
                        onClick={() => handleEditClick(s)}
                      >
                        <i className="ti-pencil-alt" />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(s.id)}
                      >
                        <i className="ti-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal<Slider>
        itemId={confirmDeleteId}
        deleteFn={deleteSlider}
        setItems={setSliders}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this slider?"
      />
    </div>
  );
}
