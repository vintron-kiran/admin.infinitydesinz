
'use client';

import { useEffect, useState } from 'react';
import { fetchSizes, addSize, updateSize,deleteSize } from './service';
import { Size } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function SizesPage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [formData, setFormData] = useState<Omit<Size, 'id'>>({
    title: '',
    
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
        const data = await fetchSizes();
        setSizes(data);
      } catch (err) {
        console.error(err);
        setSizes([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddClick = () => {
    setFormData({ title: '',  status: true });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (size: Size) => {
    setFormData({ title: size.title, status: size.status });
    setEditingId(size.id!);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        const updated = await updateSize(editingId, formData);
    //    setSizes(prev => prev.map(b => (b.id === editingId ? updated : b)));
      } else {
        const added = await addSize(formData);
    //    setSizes(prev => [...prev, added]);
      }
      const updated = await fetchSizes(); // ✅ Always fetch fresh list
    setSizes(updated);
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
      const currentPageIds = paginatedSizes.map(b => b.id!);
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

  const handleBulkStatusChange = async  (status: boolean) => {
    const updatedSizes = sizes.map(b =>
      selectedIds.includes(b.id!) ? { ...b, status } : b
    );

    await Promise.all(
    selectedIds.map((id) => {
      const size = sizes.find((b) => b.id === id);
      if (!size) return Promise.resolve();
      const { title } = size;
      return updateSize(id, { title, status });
    })
  );

    setSizes(updatedSizes);
    setSelectedIds([]);
  };
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };



  const filteredSizes = sizes.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === '' || String(b.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedSizes = filteredSizes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);

  return (
    <div className="container-fluid px-5 py-4" style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div className="main-header mb-3 d-flex justify-content-between align-items-center">
        <h4>Sizes - Manage</h4>
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
                <button className="btn btn-danger me-2" onClick={() => { setSearchText(tempSearch); setStatusFilter(tempStatus); setCurrentPage(1); }}>
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
            <h5>{editingId ? 'Edit Size' : 'Create a Size'}</h5>
            <form onSubmit={handleSubmit} className="row">
              <div className="col-md-6 mb-3">
                <label>Size</label>
                <input
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
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
              <div className="col-12 text-center">
                <button className="btn btn-success px-4">Submit</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card p-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Sizes</h5>
              <div>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleBulkStatusChange(true)}>Active</button>
                <button className="btn btn-secondary btn-sm me-2" onClick={() => handleBulkStatusChange(false)}>In Active</button>
                <button className="btn btn-danger btn-sm me-2" disabled>Front Active</button>
                <button className="btn btn-warning btn-sm" disabled>Front In Active</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th><input type="checkbox" onChange={handleSelectAll} checked={paginatedSizes.every(b => selectedIds.includes(b.id!))} /></th>
                    <th>S.No</th>
                    <th>Sizes</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSizes.map((b, i) => (
                    <tr key={b.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(b.id!)}
                          onChange={() => handleCheckboxChange(b.id!)}
                        />
                      </td>
                      <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td>{b.title}</td>
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
<ConfirmDeleteModal<Size>
        itemId={confirmDeleteId}
        deleteFn={deleteSize}
        setItems={setSizes}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this size?"
      />
     
    
    </div>
      
           
  );
}
