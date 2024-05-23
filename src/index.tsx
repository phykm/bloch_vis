// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { SlidersUI } from './components/StateSliderUI';
import { show } from './main';
import { Mat2 } from './calcMat2';
import ComplexMatrixInput from './components/ComplexMatrixInput';
import HermiteMatrixInput from './components/HermiteMatrixInput';

const App: React.FC = () => {
  const handleValuesChange = (x: number, y: number, z: number) => {
    console.log(`Updated values: x=${x}, y=${y}, z=${z}`);
  };

  const handleMatrixChange = (m:Mat2)=> {
    console.log(m.toString())
  }

  return (
    <div>
      <div>
        <h3>State</h3>
        <SlidersUI initialX={0} initialY={0} initialZ={0} onValuesChange={handleValuesChange} />
      </div>
      <div>
        <h3>Lindbladian</h3>
        <div>
          <h4>H(spanned by Pauli Matrix)</h4>
          <HermiteMatrixInput onValuesChange={handleMatrixChange}/>
        </div>
        <div>
          <h4>L(spanned by Pauli Matrix)</h4>
          <ComplexMatrixInput onValuesChange={handleMatrixChange} />
        </div>
      </div>
    </div>
  );
};

// これはあとで組み込む必要がある。
show();

ReactDOM.render(<App />, document.getElementById('uiroot'));
