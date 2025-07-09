'use client';

import { useEffect, useState } from 'react';
import { fetchColors, addColor, updateColor, deleteColor } from './service';
import { Color } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { HexColorPicker } from 'react-colorful';
import '@/styles/react-colorful.css';
import ColorPickerComponent from '@/components/ColorPickerComponent';

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [formData, setFormData] = useState<Omit<Color, 'id'>>({
    label: '',
    hex_code: '#000000',
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchColors();
        setColors(data);
      } catch (err) {
        console.error(err);
        setColors([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

const [errors, setErrors] = useState<{ label?: string }>({});

const validateForm = () => {
  const newErrors: { label?: string } = {};
  if (!formData.label || formData.label.trim() === '') {
    newErrors.label = 'Color label is required';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleAddClick = () => {
    setFormData({ label: '', hex_code: '#000000', status: true });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (color: Color) => {
    setFormData({ label: color.label, hex_code: color.hex_code || '#000000', status: color.status });
    setEditingId(color.id!);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!validateForm()) return;
    try {
      if (editingId !== null) {
        await updateColor(editingId, formData);
      } else {
        await addColor(formData);
      }
      const updated = await fetchColors();
      setColors(updated);
    } catch (err) {
      console.error(err);
    }
    setShowForm(false);
    setEditingId(null);
  };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const target = e.target as HTMLInputElement;
  const { name, value, type, checked } = target;
  const val = type === 'checkbox' ? checked : value;
  setFormData(prev => ({ ...prev, [name]: val }));
};

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentPageIds = paginatedColors.map(b => b.id!);
      setSelectedIds(currentPageIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = async (status: boolean) => {
    await Promise.all(
      selectedIds.map((id) => {
        const color = colors.find((b) => b.id === id);
        if (!color) return Promise.resolve();
        const { label, hex_code } = color;
        return updateColor(id, { label, hex_code: hex_code || '#000000', status });
      })
    );
    const updated = await fetchColors();
    setColors(updated);
    setSelectedIds([]);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const filteredColors = colors.filter(b => {
const matchesSearch = (b.label || '').toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === '' || String(b.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedColors = filteredColors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredColors.length / itemsPerPage);

  return (
    <div className="container-fluid px-5 py-4" style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div className="main-header mb-3 d-flex justify-content-between align-items-center">
        <h4>Colors - Manage</h4>
      </div>

      {!showForm && (
        <div className="card mb-4 p-3">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search By"
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                >
                  <option value="">- Select Status -</option>
                  <option value="true">Active</option>
                  <option value="false">In Active</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-danger me-2" onClick={() => {
                  setSearchText(tempSearch);
                  setStatusFilter(tempStatus);
                  setCurrentPage(1);
                }}>
                  <i className="ti-search" />
                </button>
                <button className="btn btn-success" onClick={() => {
                  setTempSearch('');
                  setTempStatus('');
                  setSearchText('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}>
                  <i className="icon-refresh" />
                </button>
              </div>
              <div className="col-md-4 text-end">
                <button className="btn btn-primary" onClick={handleAddClick}>+ Add New</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="card mb-4 p-3">
          <div className="card-body">
            <h5>{editingId ? 'Edit Color' : 'Create a Color'}</h5>
            <form onSubmit={handleSubmit} className="row">
              <div className="col-md-6 mb-3">
                <label>Color</label>
                <input
                  className="form-control"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                />
                 {errors.label && <div className="invalid-feedback">{errors.label}</div>}
              </div>

             

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                >
                  <option value="true">Active</option>
                  <option value="false">In Active</option>
                </select>
              </div>
               <div className="col-md-6 mb-3">
                <label>Hex Code</label>
               <ColorPickerComponent
                  color={formData.hex_code}
                  setColor={(hex, label) =>
                    setFormData(prev => ({
                      ...prev,
                      hex_code: hex,
                      label: label ?? '', // Clear label if color selected from HexColorPicker
                    }))
                  }
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  name="hex_code"
                  value={formData.hex_code}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 text-right">
                <button className="btn btn-success px-4">Submit</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card p-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Colors</h5>
              <div>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleBulkStatusChange(true)}>Active</button>
                <button className="btn btn-secondary btn-sm me-2" onClick={() => handleBulkStatusChange(false)}>In Active</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th><input type="checkbox" onChange={handleSelectAll} checked={paginatedColors.every(b => selectedIds.includes(b.id!))} /></th>
                    <th>S.No</th>
                    <th>Colors</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedColors.map((b, i) => (
                    <tr key={b.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(b.id!)}
                          onChange={() => handleCheckboxChange(b.id!)}
                        />
                      </td>
                      <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td>{b.label}</td>
                      <td>{b.hex_code}</td>
                      <td>
                        <span className={`badge ${b.status ? 'bg-success' : 'bg-danger'}`}>
                          {b.status ? 'Active' : 'In Active'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-outline-success btn-sm me-1" onClick={() => handleEditClick(b)}>
                          <i className="ti-pencil-alt" />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(b.id!)}>
                          <i className="ti-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <nav>
                    <ul className="pagination pagination-sm">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal<Color>
        itemId={confirmDeleteId}
        deleteFn={deleteColor}
        setItems={setColors}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this color?"
      />
    </div>
  );
}
