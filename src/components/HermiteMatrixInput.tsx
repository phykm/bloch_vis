import React, { useState } from 'react';
import Complex from 'complex.js';
import { Mat2, Vec3 } from '../calcMat2';

// TODO 状態と、状態更新ロジックを親に寄せる。このままだと状態が分散していてReactみがない。
// これは再規格化した新しい状態の通知だけをやる。

interface HermiteMatrixInputProps {
    onValuesChange: (values: Mat2) => void;
}

const HermiteMatrixInput: React.FC<HermiteMatrixInputProps> = ({ onValuesChange }) => {
    const [values, setValues] = useState<Mat2>(
        new Mat2(new Complex(1,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(0,0)))
    );

    const handleInputChange = (index: string, value_s: string) => {
        const value = parseFloat(value_s);
        let newValues:Mat2;

        switch (index) {
            case "id":
                newValues = new Mat2(
                    new Complex(value,0),
                    values.v
                );
                setValues(newValues);
                onValuesChange(newValues);
                break;
            case "x":
                newValues = new Mat2(
                    values.id,
                    new Vec3(
                        new Complex(value,0),
                        values.v.y,
                        values.v.z
                    )
                );
                setValues(newValues);
                onValuesChange(newValues);
                break;
            case "y":
                newValues = new Mat2(
                    values.id,
                    new Vec3(
                        values.v.x,
                        new Complex(value,0),
                        values.v.z
                    )
                );
                setValues(newValues);
                onValuesChange(newValues);
                break;
            case "z":
                newValues = new Mat2(
                    values.id,
                    new Vec3(
                        values.v.x,
                        values.v.y,
                        new Complex(value,0)
                    )
                );
                setValues(newValues);
                onValuesChange(newValues);
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
                  value={values.id.re}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>σx</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  type="number"
                  step="0.000001"
                  value={values.v.x.re}
                  onChange={(e) => handleInputChange("x", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>σy</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  type="number"
                  step="0.000001"
                  value={values.v.y.re}
                  onChange={(e) => handleInputChange("y", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>σz</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                  type="number"
                  step="0.000001"
                  value={values.v.z.re}
                  onChange={(e) => handleInputChange("z", e.target.value)}
                  placeholder="Re"
              />
          </div>
      </div>
  </div>
    );
};

export default HermiteMatrixInput;
