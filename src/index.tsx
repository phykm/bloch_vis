import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { SlidersUI } from './components/StateSliderUI';
import { show } from './main';
import { Mat2, Vec3 } from './calcMat2';
import ComplexMatrixInput from './components/ComplexMatrixInput';
import HermiteMatrixInput from './components/HermiteMatrixInput';
import Complex from 'complex.js';
import SphereRenderer from './components/SphereRenderer';
import * as THREE from 'three';
import { PositionsBuffer } from './positionsbuffer';
import { Matrix } from 'mathjs';
import { HyperLindbladian } from './calcLindblad';
import { p } from './debug2';

const App: React.FC = () => {
  // オペレータの状態
  const [matrix_H, setHMatrix] = useState<Mat2>(new Mat2(new Complex(1,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(0,0))));
  const [matrix_L, setLMatrix] = useState<Mat2>(new Mat2(new Complex(1,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(0,0))));
  // リアクティブ計算されるリンドブラディアン
  const superLindblad = useMemo<Matrix>(()=>{
    return HyperLindbladian(matrix_H,matrix_L)
  },[matrix_H,matrix_L])

  // 密度行列の状態
  const [x, setX] = useState<number>(1);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(0);

  // UIから変更があったときのコールバック
  const handleValuesChange = (x: number, y: number, z: number) => {
    console.log(`Updated values: x=${x}, y=${y}, z=${z}`);
    setX(x);
    setY(y);
    setZ(z);
    updateRenderPosition(x,y,z);
  };

  // スライダーUIから値を受け取る
  const handleHMatrixChange = (m:Mat2)=> {
    console.log(m.toString())
    setHMatrix(m);
  }
  const handleLMatrixChange = (m:Mat2)=> {
    console.log(m.toString())
    setLMatrix(m);
  }

  // 描画用の状態
  const [pointPosition, setPointPosition] = useState(new THREE.Vector3(1, 0, 0));
  const [track,setTrack] = useState(new Float32Array());
  const [positionsBuffer,setBuffer] = useState(new PositionsBuffer(100));
  // 全部stateにしないと保持されない!!!なんかそのまま置いておいたら再初期化されてしまっていた。
  // これをflushすればOK

  // 描画位置を更新する(トラック付き)
  const updateRenderPosition = (x:number,y:number,z:number) => {
    setPointPosition(new THREE.Vector3(x,y,z));
    setBuffer(positionsBuffer.append(x,y,z));
    setTrack(positionsBuffer.getBuffer());
  }

  //テスト用のランダム軌道
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("update position")
  //     // 新しい位置をランダムに設定
  //     const newPosition = new THREE.Vector3(Math.random(), Math.random(), Math.random());
  //     positionsBuffer.append(newPosition.x,newPosition.y,newPosition.z);
  //     setPointPosition(newPosition);
  //     setTrack(positionsBuffer.getBuffer());
  //   }, 100); // 0.05秒ごとに更新
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div>
      <div>
        <SphereRenderer track={track} pointPosition={pointPosition} />
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

ReactDOM.render(<App />, document.getElementById('uiroot'));
