import React, { useCallback, useEffect, useRef, useState } from 'react';
import Complex from 'complex.js';
import { Mat2, Vec3 } from '../calcMat2';
import InputNumber from './InputNumber';


// 複素行列のパウリ行列展開を指定するUI
// useStateのMat2を渡しつつ、コールバックでそれを変更すること
interface ComplexMatrixInputProps {
    onMatrixChange: (values: Mat2) => void;
    matrix: Mat2;
}

const ComplexMatrixInput: React.FC<ComplexMatrixInputProps> = ({ onMatrixChange, matrix}) => {
    const innerMatrix = useRef(matrix);
    useEffect(()=>{
      innerMatrix.current = matrix
    },[matrix]);
    const handleInputChange = useCallback((index: string, part: 're' | 'im', value: number) => {
        let m = innerMatrix.current;
        switch (index) {
            case "id":
              innerMatrix.current = new Mat2(
                  new Complex(part === 're' ? value : m.id.re, part === 'im' ? value : m.id.im),
                  m.v
                );
                onMatrixChange(innerMatrix.current);
                break;
            case "x":
              innerMatrix.current = new Mat2(
                  m.id,
                  new Vec3(
                    new Complex(part === 're' ? value : m.v.x.re, part === 'im' ? value : m.v.x.im),
                    m.v.y,
                    m.v.z
                  )
                );
                onMatrixChange(innerMatrix.current);
                break;
            case "y":
              innerMatrix.current = new Mat2(
                  m.id,
                  new Vec3(
                    m.v.x,
                    new Complex(part === 're' ? value : m.v.y.re, part === 'im' ? value : m.v.y.im),
                    m.v.z
                  )
                );
                onMatrixChange(innerMatrix.current);
                break;
            case "z":
              innerMatrix.current = new Mat2(
                  m.id,
                  new Vec3(
                    m.v.x,
                    m.v.y,
                    new Complex(part === 're' ? value : m.v.z.re, part === 'im' ? value : m.v.z.im)
                  )
                );
                onMatrixChange(innerMatrix.current);
                break;
        }
    },[]);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>I</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InputNumber
                  value={matrix.id.re}
                  onChange={(v) => handleInputChange("id","re",v)}
                  placeHolder='Re'
              />
              <InputNumber
                  value={matrix.id.im}
                  onChange={(v) => handleInputChange("id","im",v)}
                  placeHolder='Im'
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σx</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InputNumber
                  value={matrix.v.x.re}
                  onChange={(v) => handleInputChange("x","re",v)}
                  placeHolder='Re'
              />
              <InputNumber
                  value={matrix.v.x.im}
                  onChange={(v) => handleInputChange("x","im",v)}
                  placeHolder='Im'
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σy</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InputNumber
                  value={matrix.v.y.re}
                  onChange={(v) => handleInputChange("y","re",v)}
                  placeHolder='Re'
              />
              <InputNumber
                  value={matrix.v.y.im}
                  onChange={(v) => handleInputChange("y","im",v)}
                  placeHolder='Im'
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σz</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InputNumber
                  value={matrix.v.z.re}
                  onChange={(v) => handleInputChange("z","re",v)}
                  placeHolder='Re'
              />
              <InputNumber
                  value={matrix.v.z.im}
                  onChange={(v) => handleInputChange("z","im",v)}
                  placeHolder='Im'
              />
          </div>
      </div>
  </div>
    );
};

export default ComplexMatrixInput;
