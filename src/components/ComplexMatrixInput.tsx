import React, { useState } from 'react';
import Complex from 'complex.js';
import { Mat2, Vec3 } from '../calcMat2';


// 複素行列のパウリ行列展開を指定するUI
// useStateのMat2を渡しつつ、コールバックでそれを変更すること
interface ComplexMatrixInputProps {
    onMatrixChange: (values: Mat2) => void;
    matrix: Mat2;
}

const ComplexMatrixInput: React.FC<ComplexMatrixInputProps> = ({ onMatrixChange, matrix}) => {
    const handleInputChange = (index: string, part: 're' | 'im', value_s: string) => {
        const value = parseFloat(value_s);
        if (isNaN(value)) {
          return;
        }
        let newMatrix:Mat2;

        switch (index) {
            case "id":
                newMatrix = new Mat2(
                  new Complex(part === 're' ? value : matrix.id.re, part === 'im' ? value : matrix.id.im),
                  matrix.v
                );
                onMatrixChange(newMatrix);
                break;
            case "x":
                newMatrix = new Mat2(
                  matrix.id,
                  new Vec3(
                    new Complex(part === 're' ? value : matrix.v.x.re, part === 'im' ? value : matrix.v.x.im),
                    matrix.v.y,
                    matrix.v.z
                  )
                );
                onMatrixChange(newMatrix);
                break;
            case "y":
                newMatrix = new Mat2(
                  matrix.id,
                  new Vec3(
                    matrix.v.x,
                    new Complex(part === 're' ? value : matrix.v.y.re, part === 'im' ? value : matrix.v.y.im),
                    matrix.v.z
                  )
                );
                onMatrixChange(newMatrix);
                break;
            case "z":
                newMatrix = new Mat2(
                  matrix.id,
                  new Vec3(
                    matrix.v.x,
                    matrix.v.y,
                    new Complex(part === 're' ? value : matrix.v.z.re, part === 'im' ? value : matrix.v.z.im)
                  )
                );
                onMatrixChange(newMatrix);
                break;
        }
    };

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>I</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.id.re}
                  onChange={(e) => handleInputChange("id", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.id.im}
                  onChange={(e) => handleInputChange("id", 'im', e.target.value)}
                  placeholder="Im"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>σx</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.v.x.re}
                  onChange={(e) => handleInputChange("x", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.v.x.im}
                  onChange={(e) => handleInputChange("x", 'im', e.target.value)}
                  placeholder="Im"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>σy</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.v.y.re}
                  onChange={(e) => handleInputChange("y", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.v.y.im}
                  onChange={(e) => handleInputChange("y", 'im', e.target.value)}
                  placeholder="Im"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>σz</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.v.z.re}
                  onChange={(e) => handleInputChange("z", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={matrix.v.z.im}
                  onChange={(e) => handleInputChange("z", 'im', e.target.value)}
                  placeholder="Im"
              />
          </div>
      </div>
  </div>
    );
};

export default ComplexMatrixInput;
