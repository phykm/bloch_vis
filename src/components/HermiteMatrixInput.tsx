import React, { useCallback, useEffect, useRef, useState } from 'react';
import Complex from 'complex.js';
import { Mat2, Vec3 } from '../calcMat2';
import InputNumber from './InputNumber';


// エルミート行列のパウリ行列展開を指定するUI
// useStateのMat2を渡しつつ、コールバックでそれを変更すること
// matrixはエルミート、つまり実係数であること
interface HermiteMatrixInputProps {
    onMatrixChange: (values: Mat2) => void;
    matrix: Mat2;
}

const HermiteMatrixInput: React.FC<HermiteMatrixInputProps> = ({ onMatrixChange, matrix}) => {
    const innerMatrix = useRef(matrix);
    useEffect(()=>{
      innerMatrix.current = matrix
    },[matrix]);
    const handleInputChange = useCallback((index: string, value: number) => {
        let m = innerMatrix.current;
        switch (index) {
            case "id":
                innerMatrix.current = new Mat2(
                    new Complex(value,0),
                    m.v
                );
                onMatrixChange(innerMatrix.current);
                break;
            case "x":
              innerMatrix.current = new Mat2(
                    m.id,
                    new Vec3(
                        new Complex(value,0),
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
                        new Complex(value,0),
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
                        new Complex(value,0)
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
                  onChange={(v) => handleInputChange("id",v)}
                  placeHolder='Re'
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σx</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InputNumber
                  value={matrix.v.x.re}
                  onChange={(v) => handleInputChange("x",v)}
                  placeHolder='Re'
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σy</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InputNumber
                  value={matrix.v.y.re}
                  onChange={(v) => handleInputChange("y",v)}
                  placeHolder='Re'
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>σz</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InputNumber
                  value={matrix.v.z.re}
                  onChange={(v) => handleInputChange("z",v)}
                  placeHolder='Re'
              />
          </div>
      </div>
  </div>
    );
};

export default HermiteMatrixInput;
