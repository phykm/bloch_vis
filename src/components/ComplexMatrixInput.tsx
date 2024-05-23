import React, { useState } from 'react';
import Complex from 'complex.js';
import { Mat2, Vec3 } from '../calcMat2';


// TODO 状態と、状態更新ロジックを親に寄せる。このままだと状態が分散していてReactみがない。
// これは再規格化した新しい状態の通知だけをやる。

interface ComplexMatrixInputProps {
    onValuesChange: (values: Mat2) => void;
}

const ComplexMatrixInput: React.FC<ComplexMatrixInputProps> = ({ onValuesChange }) => {
    const [values, setValues] = useState<Mat2>(
        new Mat2(new Complex(1,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(0,0)))
    );

    const handleInputChange = (index: string, part: 're' | 'im', value_s: string) => {
        const value = parseFloat(value_s);
        let newValues:Mat2;

        switch (index) {
            case "id":
                newValues = new Mat2(
                    new Complex(part === 're' ? value : values.id.re, part === 'im' ? value : values.id.im),
                    values.v
                );
                setValues(newValues);
                onValuesChange(newValues);
                break;
            case "x":
                newValues = new Mat2(
                    values.id,
                    new Vec3(
                        new Complex(part === 're' ? value : values.v.x.re, part === 'im' ? value : values.v.x.im),
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
                        new Complex(part === 're' ? value : values.v.y.re, part === 'im' ? value : values.v.y.im),
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
                        new Complex(part === 're' ? value : values.v.z.re, part === 'im' ? value : values.v.z.im)
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
                  onChange={(e) => handleInputChange("id", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={values.id.im}
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
                  value={values.v.x.re}
                  onChange={(e) => handleInputChange("x", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={values.v.x.im}
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
                  value={values.v.y.re}
                  onChange={(e) => handleInputChange("y", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={values.v.y.im}
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
                  value={values.v.z.re}
                  onChange={(e) => handleInputChange("z", 're', e.target.value)}
                  placeholder="Re"
              />
              <input
                  type="number"
                  step="0.000001"
                  value={values.v.z.im}
                  onChange={(e) => handleInputChange("z", 'im', e.target.value)}
                  placeholder="Im"
              />
          </div>
      </div>
  </div>
    );
};

export default ComplexMatrixInput;
