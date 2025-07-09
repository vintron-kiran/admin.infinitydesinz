// CategoriesMainContent.tsx

'use client';
import { useSearchParams } from 'next/navigation';

import { useEffect, useState } from 'react';
import { fetchCategories, addCategory, updateCategory, deleteCategory, fetchFeatureTypes } from './service';
import { Category } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
interface FeatureType {
  id: number;
  name: string;
}

export default function CategoriesPage({ type }: { type: string }) {
  const formLevel: 1 | 2 | 3 =
    type === 'sub-cat' ? 2 : type === 'list-sub-cat' ? 3 : 1;
      const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    title: '',
    status: true,
    parent_id: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const searchParams = useSearchParams();
 
  const [level1, setLevel1] = useState<number | null>(null);
  const [level2, setLevel2] = useState<number | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchText, setSearchText] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [appIcon, setAppIcon] = useState<File | null>(null);
  const [webImage, setWebImage] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<{ main?: string; app?: string; web?: string }>({});
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const itemsPerPage = 5;

  useEffect(() => {
    async function load() {
      const data = await fetchCategories();
      setCategories(data);

       const types = await fetchFeatureTypes();
      setFeatureTypes(Array.isArray(types) ? types : []);
    }
    load();

    
  }, []);


const filteredCategories = categories.filter((cat) => {
  if (formLevel === 1) {
    return cat.parent_id === null;
  }

  if (formLevel === 2) {
    const parent = categories.find(p => p.id === cat.parent_id);
    return parent && parent.parent_id === null;
  }

  if (formLevel === 3) {
    const parent = categories.find(p => p.id === cat.parent_id);
    const grandparent = parent && categories.find(p2 => p2.id === parent.parent_id);
    return parent && grandparent;
  }

  return false;
});

const parentOptions = categories.filter(c => !c.parent_id);
  const level2Options = categories.filter(c => c.parent_id === level1);

  const handleFeatureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
    setSelectedFeatures(values);
  };
const handleAddClick = () => {
  setFormData({ title: '', status: true, parent_id: null });
  setEditingId(null);
  setLevel1(null);
  setLevel2(null);
  setMainImage(null);
  setAppIcon(null);
  setWebImage(null);
  setShowForm(true);
};


  const handleEditClick = (cat: Category) => {
    const parent = categories.find(c => c.id === cat.parent_id);
    const grandParent = parent && categories.find(c => c.id === parent.parent_id);

    if (!parent) {
      setLevel1(null);
      setLevel2(null);
    } else if (!grandParent) {
      setLevel1(parent?.id ?? null);
      setLevel2(null);
    } else {
      setLevel1(grandParent?.id ?? null);
      setLevel2(parent?.id ?? null);
    }

    setFormData({ title: cat.title, status: cat.status, parent_id: cat.parent_id });
    setEditingId(cat.id!);
  setSelectedFeatures(cat.featureTypes?.map(ft => ft.id) || []); // ✅ Set pre-selected feature types
    setShowForm(true);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');
  setSubmitFailed(false); // for hiding listing on failure

  let parent_id: number | null = null;

// Validation for parent selection
if (formLevel === 2) {
  if (!level1) {
    setErrorMessage('Please select a Level 1 parent category.');
    setSubmitFailed(true);
    return;
  }
  parent_id = level1;
} else if (formLevel === 3) {
  if (!level1 || !level2) {
    setErrorMessage('Please select both Level 1 and Level 2 parent categories.');
    setSubmitFailed(true);
    return;
  }
  parent_id = level2;
}



    try {

      const formPayload = new FormData();
formPayload.append('title', formData.title);
formPayload.append('status', String(formData.status));
formPayload.append('parent_id', parent_id ? String(parent_id) : '');
selectedFeatures.forEach(id => formPayload.append('featureTypeIds', String(id))); // ✅ Important
if (mainImage) formPayload.append('mainImage', mainImage);
if (appIcon) formPayload.append('appIcon', appIcon);
if (webImage) formPayload.append('webImage', webImage);

if (editingId !== null) {
  await updateCategory(editingId, formPayload); // Make sure updateCategory accepts FormData
} else {
  await addCategory(formPayload); // Same here
}

  

  const updated = await fetchCategories();
  setCategories(updated);
  setShowForm(false);
  setSubmitFailed(false);
  setErrorMessage('');
} catch (err: any) {
  const message =
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong.';
  setErrorMessage(typeof message === 'string' ? message : message.join(', '));
  setSubmitFailed(true);
}


    
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const target = e.target as HTMLInputElement;
  const { name, value, type, checked } = target;
  const val = type === 'checkbox' ? checked : value;
  setFormData(prev => ({ ...prev, [name]: val }));
};

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(id);
  };

const filtered = categories.filter(c => {
  const matchText = c.title.toLowerCase().includes(searchText.toLowerCase());
  const matchStatus = statusFilter === '' || String(c.status) === statusFilter;

  let matchLevel = false;

 if (formLevel === 1) {
  matchLevel = !c.parent_id;
} else if (formLevel === 2) {
  const parent = categories.find(p => p.id === c.parent_id);
  matchLevel = !!(parent && !parent.parent_id);
}
 else if (formLevel === 3) {
    const parent = categories.find(p => p.id === c.parent_id);
    const grandParent = parent ? categories.find(p2 => p2.id === parent.parent_id) : null;
    matchLevel = !!(parent && grandParent);
  }

  return matchText && matchStatus && matchLevel;
});



  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const getImageUrl = (filename: string | undefined) => {
      if (!filename) return null;
      return process.env.NEXT_PUBLIC_API_UPLOADS_URL + '/categories/' + filename;
    };
  
  return (
    <div className="container-fluid px-5 py-4">
      <div className="main-header mb-3 d-flex justify-content-between align-items-center">
        <h4>Categories - Manage</h4>
      </div>

      {!showForm && (
        <div className="card mb-4 p-3">
          <div className="card-body row align-items-center">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Search" value={tempSearch} onChange={e => setTempSearch(e.target.value)} />
            </div>
            <div className="col-md-3">
              <select className="form-control" value={tempStatus} onChange={e => setTempStatus(e.target.value)}>
                <option value="">- Select Status -</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-danger me-2" onClick={() => { setSearchText(tempSearch); setStatusFilter(tempStatus); setCurrentPage(1); }}><i className="ti-search" /></button>
              <button className="btn btn-success" onClick={() => { setTempSearch(''); setTempStatus(''); setSearchText(''); setStatusFilter(''); setCurrentPage(1); }}><i className="icon-refresh" /></button>
            </div>
            <div className="col-md-4 text-end">
              <div className="btn-group">
               <button className="btn btn-primary" onClick={() => handleAddClick()}>+ Add New</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card mb-4 p-3">
          <div className="card-body">
            <h5>{editingId ? 'Edit Category' : `Add Level ${formLevel} Category`}</h5>
            <form onSubmit={handleSubmit} className="row">
              <div className="col-md-6 mb-3">
                <label>Title</label>
                <input className="form-control" name="title" value={formData.title} onChange={handleChange} />
                {errorMessage && <div className="text-danger mt-1">{errorMessage}</div>}
              </div>
              <div className="col-md-4 mb-3">
        <label>Main Image</label>
        <input type="file" className="form-control" accept="image/*" onChange={e => setMainImage(e.target.files?.[0] || null)} />
        {editingId && !mainImage && existingImages.main && (
          <img src={getImageUrl(existingImages.main) ?? undefined} alt="Main" className="img-thumbnail mt-2" style={{ maxHeight: '80px' }} />
        )}
      </div>
      <div className="col-md-4 mb-3">
        <label>App Icon</label>
        <input type="file" className="form-control" accept="image/*" onChange={e => setAppIcon(e.target.files?.[0] || null)} />
        {editingId && !appIcon && existingImages.app && (
          <img src={getImageUrl(existingImages.app) ?? undefined} alt="App" className="img-thumbnail mt-2" style={{ maxHeight: '80px' }} />
        )}
      </div>
      <div className="col-md-4 mb-3">
        <label>Web Icon</label>
        <input type="file" className="form-control" accept="image/*" onChange={e => setWebImage(e.target.files?.[0] || null)} />
        {editingId && !webImage && existingImages.web && (
          <img src={getImageUrl(existingImages.web) ?? undefined} alt="Web" className="img-thumbnail mt-2" style={{ maxHeight: '80px' }} />
        )}
      </div>

              {formLevel >= 2 && (
                <div className="col-md-4 mb-3">
                  <label>Level 1</label>
                  <select  className={`form-control ${errorMessage.includes('Level 1') ? 'is-invalid' : ''}`} value={level1 || ''} onChange={e => { setLevel1(Number(e.target.value) || null); setLevel2(null); }}>
                    <option value="">Select Level 1</option>
                    {parentOptions.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              )}
              {formLevel === 3 && (
                <div className="col-md-4 mb-3">
                  <label>Level 2</label>
                  <select  className={`form-control ${errorMessage.includes('Level 2') ? 'is-invalid' : ''}`} value={level2 || ''} onChange={e => setLevel2(Number(e.target.value) || null)}>
                    <option value="">Select Level 2</option>
                    {level2Options.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              )}
              <div className="col-md-4 mb-3">
                <label>Status</label>
                <select name="status" className="form-control" value={formData.status ? 'true' : 'false'} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="col-md-4 mb-4">
                <label className="block text-sm font-medium mb-1">Feature Types</label>
                <select 
                  multiple
                 value={selectedFeatures.map(String)}
                  onChange={(e) =>
                    setSelectedFeatures(
                      Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
                    )
                  }
                  className="form-control border rounded w-full p-2"
                   style={{ minHeight: '120px' }} // ✅ better spacing
                >
                  {featureTypes.map((ft) => (
                    <option key={ft.id} value={ft.id}>
                      {ft.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 text-center">
                <button className="btn btn-success px-4">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!submitFailed && !showForm && (
        <div className="card p-3">
          <div className="card-body">
            <h5 className="mb-3">All Categories</h5>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Parent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((cat, i) => {
                    const parent = (() => {
                      const level2 = categories.find(p => p.id === cat.parent_id);
                      const level1 = level2 ? categories.find(p => p.id === level2.parent_id) : null;
                      if (level1 && level2) return `${level1.title} → ${level2.title}`;
                      if (level2) return level2.title;
                      return '—';
                    })();
                    return (
                      <tr key={cat.id}>
                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                        <td>{cat.title}</td>
                        <td>{parent}</td>
                        <td>
                          <span className={`badge ${cat.status ? 'bg-success' : 'bg-danger'}`}>
                            {cat.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-outline-success btn-sm me-1" onClick={() => handleEditClick(cat)}>
                            <i className="ti-pencil-alt" />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(cat.id!)}>
                            <i className="ti-trash" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <nav>
                    <ul className="pagination pagination-sm">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
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

      <ConfirmDeleteModal<Category>
        itemId={confirmDeleteId}
        deleteFn={deleteCategory}
        setItems={setCategories}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
}
