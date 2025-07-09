
'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import '@/styles/react-colorful.css';

interface Props {
  color: string;
  setColor: (hex: string, label?: string) => void;
}

const presetColors = [
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#C0C0C0', label: 'Silver' },
  { hex: '#808080', label: 'Gray' },
  { hex: '#000000', label: 'Black' },
  { hex: '#FF0000', label: 'Red' },
  { hex: '#800000', label: 'Maroon' },
  { hex: '#FFFF00', label: 'Yellow' },
  { hex: '#808000', label: 'Olive' },
  { hex: '#00FF00', label: 'Lime' },
  { hex: '#008000', label: 'Green' },
  { hex: '#00FFFF', label: 'Cyan' },
  { hex: '#008080', label: 'Teal' },
  { hex: '#0000FF', label: 'Blue' },
  { hex: '#000080', label: 'Navy' },
  { hex: '#FF00FF', label: 'Magenta' },
  { hex: '#800080', label: 'Purple' },
];

export default function ColorPickerComponent({ color, setColor }: Props) {
  const [customColors, setCustomColors] = useState<string[]>([]);

  const addToCustomColors = () => {
    if (!customColors.includes(color)) {
      setCustomColors(prev => [...prev.slice(-9), color]);
    }
  };

  return (
    <div className="d-flex gap-4 mt-2 align-items-start" style={{ flexWrap: 'wrap' }}>
      {/* Color Picker */}
      <div style={{ flex: '1' }}>
        <HexColorPicker color={color} onChange={(hex) => setColor(hex)} />
        
      </div>

      {/* Swatches Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '10px', width: '300px' }}>
        {presetColors.map(({ hex, label }) => (
          <div
            key={hex}
            onClick={() => setColor(hex, label)}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                backgroundColor: hex,
                width: '30px',
                height: '30px',
                border: hex === color ? '3px solid black' : '1px solid #ccc',
                borderRadius: '4px',
                margin: '0 auto 4px',
              }}
            />
            <small style={{ fontSize: '0.75rem' }}>{label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
