// src/components/SlidersUI.tsx
import React, { useState, useEffect } from 'react';
import '../styles.css';
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

// TODO 状態と、状態更新ロジックを親に寄せる。このままだと状態が分散していてReactみがない。
// これは再規格化した新しい状態の通知だけをやる。

const Slider: React.FC<SliderProps> = ({ value, onChange }) => {
  return (
    <input
      type="range"
      min="-1"
      max="1"
      step="0.00001"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="slider"
    />
  );
};

interface SlidersUIProps {
  x: number;
  y: number;
  z: number;
  onValuesChange: (x: number, y: number, z: number) => void;
}

export const SlidersUI: React.FC<SlidersUIProps> = ({ x, y, z, onValuesChange }) => {
  const updateValues = (newX: number, newY: number, newZ: number) => {
    onValuesChange(newX, newY, newZ);
  };

  const handleXChange = (value: number) => {
    if (value**2 + y**2 + z**2 > 1) {
      let rest = (1 - value**2)**0.5
      let l = (y**2 + z**2)**0.5
      let scale = rest / l;
      let y_ = y * scale;
      let z_ = z * scale; 
      updateValues(value, y_, z_);
    } else {
      updateValues(value, y, z);
    }
  };

  const handleYChange = (value: number) => {
    if (x**2 + value**2 + z**2 > 1) {
      let rest = (1 - value**2)**0.5
      let l = (x**2 + z**2)**0.5
      let scale = rest / l;
      let x_ = x * scale;
      let z_ = z * scale; 
      updateValues(x_, value, z_);
    } else {
      updateValues(x, value, z);
    }
  };

  const handleZChange = (value: number) => {
    if (x**2 + y**2 + value**2 > 1) {
      let rest = (1 - value**2)**0.5
      let l = (x**2 + y**2)**0.5
      let scale = rest / l;
      let x_ = x * scale;
      let y_ = y * scale; 
      updateValues(x_, y_, value);
    } else {
      updateValues(x, y, value);
    }
  };

  return (
    <div>
      <Slider value={x} onChange={handleXChange} />
      <Slider value={y} onChange={handleYChange} />
      <Slider value={z} onChange={handleZChange} />
    </div>
  );
};
