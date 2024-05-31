import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { SlidersUI } from './components/StateSliderUI';
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

  // 密度行列スライダーの状態
  const [x, setX] = useState<number>(1);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(0);

  // UIから変更があったときのコールバック
  const handleValuesChange = (x: number, y: number, z: number) => {
    console.log(`Updated values: x=${x}, y=${y}, z=${z}`);
    setX(x);
    setY(y);
    setZ(z);
    updateRenderPosition(x,y,z);// 描画を同期
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
  const [pointPosition, setPointPosition] = useState(new THREE.Vector3(1, 0, 0)); // 現在の状態
  const [track,setTrack] = useState(new Float32Array()); // 現在の軌跡
  const positionsBuffer = useRef(new PositionsBuffer(100)); // 軌跡管理。更新されたら↑に反映する。
  // これをflushすればOK

  // 新しい点を追加して描画位置を更新する
  const updateRenderPosition = useCallback((x:number,y:number,z:number) => {
    setPointPosition(new THREE.Vector3(x,y,z));
    positionsBuffer.current.append(x,y,z);
    setTrack(positionsBuffer.current.getBuffer());
  },[]);// useRefで直接参照しているので更新不要

  // 時間発展スイッチの状態とハンドラ
  const [developSwitch, setDevelopSwitch] = useState(false);
  const innerSwitchState = useRef(false);

  // 試しにここで状態更新ループを...(あとでちゃんとしたリンドブラディアンにする)
  const interval = useRef<NodeJS.Timeout|null>(null)
  useEffect(() => {
    if (developSwitch === innerSwitchState.current) {// 偽の発火でした。無視。
      return;
    }
    innerSwitchState.current = developSwitch
    if (developSwitch) {
      console.log("time develop start");
      interval.current = setInterval(() => {
        // TODO ここきちんと時間発展にする
        updateRenderPosition(Math.random(), Math.random(), Math.random())
      }, 100);
    } else {
      console.log("time develop stop");
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
      interval.current = null;
    }
  },[developSwitch]);// スイッチの状態変化に応じて時間発展を起動。

  // 時間発展ボタンコールバック
  const onClickDevelopButton = useCallback(() => {
    setDevelopSwitch(!developSwitch)
  },[developSwitch]);
  const onClickTrackFlushButton = useCallback(async ()=> {
    positionsBuffer.current = new PositionsBuffer(100);
    setTrack(positionsBuffer.current.getBuffer());
  },[]);

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
        <button className="fixed-width-button" onClick = {onClickDevelopButton}>{developSwitch ? "ON" : "OFF"}</button>
        <button className="fixed-width-button" onClick = {onClickTrackFlushButton}>Flush</button>
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
