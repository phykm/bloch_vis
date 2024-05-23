// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { SlidersUI } from './components/SlidersUI';
import { show } from './main';

const App: React.FC = () => {
  const handleValuesChange = (x: number, y: number, z: number) => {
    console.log(`Updated values: x=${x}, y=${y}, z=${z}`);
  };

  return (
    <div>
      <h3>State</h3>
      <SlidersUI initialX={0} initialY={0} initialZ={0} onValuesChange={handleValuesChange} />
    </div>
  );
};

// これはあとで組み込む必要がある。
show();

ReactDOM.render(<App />, document.getElementById('uiroot'));
