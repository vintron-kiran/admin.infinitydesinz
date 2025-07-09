'use client';

import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  bgColor?: string;      // override default
  centered?: boolean;    // if true, show in center
}

export default function Notification({
  message,
  onClose,
  bgColor = '#4caf50', 
}: NotificationProps) {
  useEffect(() => {
    const id = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(id);
  }, [message, onClose]);

 

  return (
    <div
      style={{
      position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: bgColor,
        color: 'white',
        padding: '0.75rem 1.25rem',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 100000,
      }}
    >
      {message}
    </div>
  );
}
