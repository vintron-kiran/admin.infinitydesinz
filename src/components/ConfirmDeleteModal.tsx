'use client';
import React from 'react';
import ReactDOM from 'react-dom';

interface ConfirmDeleteModalProps<T> {
  itemId: number | null;
  deleteFn: (id: number) => Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  isOpen: boolean;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal<T extends { id?: number }>({
  itemId,
  deleteFn,
  setItems,
  isOpen,
  onCancel,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item?',
}: ConfirmDeleteModalProps<T>) {
  const modalRoot = typeof window !== 'undefined' ? document.getElementById('modal-root') : null;
  if (!isOpen || itemId === null || !modalRoot) return null;

  const handleConfirm = async () => {
    await deleteFn(itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
    onCancel();
  };
console.log('Modal rendered', { isOpen, itemId, modalRoot: document.getElementById('modal-root') });
return ReactDOM.createPortal(
  <div
    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h2>
      <p style={{ marginBottom: '1.5rem' }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          onClick={onCancel}
          style={{ background: '#e5e5e5', padding: '0.5rem 1rem', borderRadius: '4px' }}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>,
  modalRoot
);



}
