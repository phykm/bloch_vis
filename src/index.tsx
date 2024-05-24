// src/index.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { SlidersUI } from './components/StateSliderUI';
import { show } from './main';
import { Mat2, Vec3 } from './calcMat2';
import ComplexMatrixInput from './components/ComplexMatrixInput';
import HermiteMatrixInput from './components/HermiteMatrixInput';
import Complex from 'complex.js';
import SphereRenderer from './components/SphereRenderer';
import * as THREE from 'three';

const App: React.FC = () => {
  // オペレータの状態
  const [matrix_H, setHMatrix] = useState<Mat2>(new Mat2(new Complex(1,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(0,0))));
  const [matrix_L, setLMatrix] = useState<Mat2>(new Mat2(new Complex(1,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(0,0))));

  // 密度行列の状態
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(0);

  // UIから変更があったときのコールバック
  const handleValuesChange = (x: number, y: number, z: number) => {
    console.log(`Updated values: x=${x}, y=${y}, z=${z}`);
    setX(x);
    setY(y);
    setZ(z);
  };
  const handleHMatrixChange = (m:Mat2)=> {
    console.log(m.toString())
    setHMatrix(m);
  }
  const handleLMatrixChange = (m:Mat2)=> {
    console.log(m.toString())
    setLMatrix(m);
  }


  const [animatePoint, setAnimatePoint] = useState(true);
  const [pointPosition, setPointPosition] = useState(new THREE.Vector3(1, 0, 0));

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("update position")
      // 新しい位置をランダムに設定
      const newPosition = new THREE.Vector3(Math.random(), Math.random(), Math.random());
      setPointPosition(newPosition);
    }, 100); // 0.05秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>
        <SphereRenderer animatePoint={animatePoint} pointPosition={pointPosition} />
      </div>
      <div>
        <h3>State</h3>
        <SlidersUI x={x} y={y} z={z} onValuesChange={handleValuesChange} />
      </div>
      <div>
        <h3>Time Development</h3>
      </div>
      <div>
        <h3>Lindbladian</h3>
        <div>
          <h4>H(spanned by Pauli Matrix)</h4>
          <HermiteMatrixInput onMatrixChange={handleHMatrixChange} matrix={matrix_H}/>
        </div>
        <div>
          <h4>L(spanned by Pauli Matrix)</h4>
          <ComplexMatrixInput onMatrixChange={handleLMatrixChange} matrix={matrix_L}/>
        </div>
      </div>
    </div>
  );
};

// これはあとで組み込む必要がある。
//show();

ReactDOM.render(<App />, document.getElementById('uiroot'));
