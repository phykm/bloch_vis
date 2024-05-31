import React, { useState } from 'react';
import Complex from 'complex.js';
import { Mat2, Vec3 } from '../calcMat2';


// エルミート行列のパウリ行列展開を指定するUI
// useStateのMat2を渡しつつ、コールバックでそれを変更すること
// matrixはエルミート、つまり実係数であること
interface HermiteMatrixInputProps {
    onMatrixChange: (values: Mat2) => void;
    matrix: Mat2;
}

const HermiteMatrixInput: React.FC<HermiteMatrixInputProps> = ({ onMatrixChange, matrix}) => {

    const handleInputChange = (index: string, value_s: string) => {
        const value = parseFloat(value_s);
        if (isNaN(value)) {
          return;
        }
        let newValues:Mat2;

        switch (index) {
            case "id":
                newValues = new Mat2(
                    new Complex(value,0),
                    matrix.v
                );
                onMatrixChange(newValues);
                break;
            case "x":
                newValues = new Mat2(
                    matrix.id,
                    new Vec3(
                        new Complex(value,0),
                        matrix.v.y,
                        matrix.v.z
                    )
                );
                onMatrixChange(newValues);
                break;
            case "y":
                newValues = new Mat2(
                    matrix.id,
                    new Vec3(
                        matrix.v.x,
                        new Complex(value,0),
                        matrix.v.z
                    )
                );
                onMatrixChange(newValues);
                break;
            case "z":
                newValues = new Mat2(
                    matrix.id,
                    new Vec3(
                        matrix.v.x,
                        matrix.v.y,
                        new Complex(value,0)
                    )
                );
                onMatrixChange(newValues);
                break;
        }
    };

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>I</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  className="input-number"
                  type="number"
                  step="0.01"
                  value={matrix.id.re}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σx</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  className="input-number"
                  type="number"
                  step="0.01"
                  value={matrix.v.x.re}
                  onChange={(e) => handleInputChange("x", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σy</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  className="input-number"
                  type="number"
                  step="0.01"
                  value={matrix.v.y.re}
                  onChange={(e) => handleInputChange("y", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σz</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  className="input-number"
                  type="number"
                  step="0.01"
                  value={matrix.v.z.re}
                  onChange={(e) => handleInputChange("z", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
  </div>
    );
};

export default HermiteMatrixInput;
