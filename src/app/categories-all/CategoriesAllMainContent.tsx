
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchCategories, addCategory, deleteCategory } from '../categories/service';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

type Category = {
  id: number;
  title: string;
  parent_id: number | null;
  children?: Category[];
};

export default function CategoriesAllPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [addParentId, setAddParentId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [showMainAddForm, setShowMainAddForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchCategories();
      const tree = buildTree(data);
      setCategories(tree);
      setFilteredCategories(tree);
    }
    load();
  }, []);

  useEffect(() => {
    if (!tempSearch) {
      setFilteredCategories(categories);
      return;
    }

    const matchedIds = new Set<number>();

    const searchTree = (nodes: Category[]): Category[] => {
      const result: Category[] = [];

      for (const node of nodes) {
        const children = node.children ? searchTree(node.children) : [];
        const match = (node.title || '').toLowerCase().includes(tempSearch.toLowerCase());

        if (match || children.length > 0) {
          result.push({ ...node, children });
          matchedIds.add(node.id);
        }
      }

      return result;
    };

    const result = searchTree(categories);
    setFilteredCategories(result);
    setExpandedIds(matchedIds);
  }, [tempSearch, categories]);

  const buildTree = (flat: Category[]) => {
    const map = new Map<number, Category>();
    const roots: Category[] = [];

    flat.forEach(cat => map.set(cat.id, { ...cat, children: [] }));

    map.forEach(cat => {
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children!.push(cat);
      } else {
        roots.push(cat);
      }
    });

    return roots;
  };

  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedIds(newSet);
  };

  const handleAdd = async (parent_id: number | null) => {
    if (!newTitle.trim()) return;
    const form = new FormData();
    form.append('title', newTitle);
    form.append('status', 'true');
    form.append('parent_id', parent_id?.toString() || '0');

    await addCategory(form);
    const updated = await fetchCategories();
    const tree = buildTree(updated);
    setCategories(tree);
    setFilteredCategories(tree);
    setNewTitle('');
    setAddParentId(null);
    setShowMainAddForm(false);
    if (parent_id) setExpandedIds(prev => new Set(prev).add(parent_id));
  };

  const getCategoryUrl = (level: number) => {
    return level === 0
      ? '/categories/main'
      : level === 1
      ? '/categories/sub-cat'
      : '/categories/list-sub-cat';
  };

  const renderTree = (nodes: Category[], level = 0) => {
    return nodes.map(node => {
      const isLevel3 = level >= 2;
      const href = getCategoryUrl(level);
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id} style={{ paddingLeft: `${level * 24}px`, marginBottom: '10px', fontSize: '16px' }}>
          <div className="d-flex align-items-center">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(node.id)}
                style={{
                  border: 'none',
                  background: '#0d6efd',
                  color: 'white',
                  borderRadius: '4px',
                  width: '26px',
                  height: '26px',
                  textAlign: 'center',
                  marginRight: '8px',
                  fontWeight: 'bold',
                  lineHeight: '22px'
                }}
              >
                {expandedIds.has(node.id) ? '−' : '+'}
              </button>
            )}
            <Link href={href} className="text-decoration-none text-dark fw-bold">
              {node.title}
            </Link>
            {!isLevel3 && (
              <button
                className="btn btn-sm btn-outline-success ms-2"
                onClick={() => {
                  setAddParentId(node.id);
                  setNewTitle('');
                }}
              >
                + Add
              </button>
            )}
            <button
              className={`btn btn-sm ms-2 ${hasChildren ? 'btn-outline-secondary' : 'btn-outline-danger'}`}
              onClick={() => setConfirmDeleteId(node.id)}
              title={hasChildren ? 'Cannot delete: has children' : 'Delete'}
              disabled={hasChildren}
            >
              🗑
            </button>
          </div>
          {expandedIds.has(node.id) && node.children && renderTree(node.children, level + 1)}
          {addParentId === node.id && (
            <div className="d-flex align-items-center mt-2" style={{ paddingLeft: `${(level + 1) * 24}px` }}>
              <input
                type="text"
                value={newTitle}
                placeholder="New category title"
                onChange={e => setNewTitle(e.target.value)}
                className="form-control form-control-sm me-2"
                style={{ maxWidth: '300px' }}
              />
              <button className="btn btn-sm btn-primary me-1" onClick={() => handleAdd(node.id)}>
                Save
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => setAddParentId(null)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  const expandAll = () => {
    const allIds = new Set<number>();
    const collectIds = (cats: Category[]) => {
      cats.forEach(c => {
        allIds.add(c.id);
        if (c.children) collectIds(c.children);
      });
    };
    collectIds(categories);
    setExpandedIds(allIds);
  };

  const collapseAll = () => setExpandedIds(new Set());

  return (
    <div className="container-fluid px-5 py-4">
      <div className="card mb-4 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Categories - All</h4>
        </div>
      </div>

      <div className="card mb-4 p-3">
        <div className="card-body row align-items-center">
          <div className="col-md-2">
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                setShowMainAddForm(true);
                setAddParentId(null);
                setNewTitle('');
              }}
            >
              + Add Main Category
            </button>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by category"
              value={tempSearch}
              onChange={e => setTempSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success" onClick={() => setTempSearch('')}>
              <i className="icon-refresh" />
            </button>
          </div>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={expandAll}>
              Expand All
            </button>
            <button className="btn btn-outline-secondary" onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        </div>

        {showMainAddForm && (
          <div className="d-flex align-items-center mt-3 px-3">
            <input
              type="text"
              value={newTitle}
              placeholder="New main category title"
              onChange={e => setNewTitle(e.target.value)}
              className="form-control form-control-sm me-2"
              style={{ maxWidth: '300px' }}
            />
            <button className="btn btn-sm btn-primary me-1" onClick={() => handleAdd(null)}>
              Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => setShowMainAddForm(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="card p-4">{renderTree(filteredCategories)}</div>

      <ConfirmDeleteModal
        itemId={confirmDeleteId}
        deleteFn={deleteCategory}
        setItems={async () => {
          const data = await fetchCategories();
          const tree = buildTree(data);
          setCategories(tree);
          setFilteredCategories(tree);
        }}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
}
