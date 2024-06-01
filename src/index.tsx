import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { SlidersUI } from './components/StateSliderUI';
import { Mat2, Vec3 } from './calcMat2';
import ComplexMatrixInput from './components/ComplexMatrixInput';
import HermiteMatrixInput from './components/HermiteMatrixInput';
import Complex from 'complex.js';
import SphereRenderer from './components/SphereRenderer';
import THREE from './threejsexporter';
import { PositionsBuffer } from './positionsbuffer';
import { Matrix } from 'mathjs';
import { HyperLindbladian, expDevelop } from './calcLindblad';
import { initH, initL, randomH, randomL } from './randomMatrix';

const App: React.FC = () => {
  // オペレータの状態
  const [matrix_H, setHMatrix] = useState<Mat2>(new Mat2(new Complex(0,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(1,0))));
  const [matrix_L, setLMatrix] = useState<Mat2>(new Mat2(new Complex(0,0), new Vec3(new Complex(0,0.2), new Complex(0.2,0), new Complex(0,0))));
  // リアクティブ計算されるリンドブラディアン
  const hyperLindblad = useRef<Matrix>(HyperLindbladian(matrix_H,matrix_L));
  // リアルタイム更新できるようにrefで持つ。
  useEffect(()=>{
    hyperLindblad.current = HyperLindbladian(matrix_H,matrix_L);
    // 時間発展中に強引に動かした場合も初期化で対応する。
    developInitState.current = new Mat2(Complex(1/2),new Vec3(Complex(x/2,0),Complex(y/2,0),Complex(z/2,0)));
    startTime.current = Date.now();
  },[matrix_H,matrix_L]);
  // アニメーション開始したときと、経過時間を取得する。
  const startTime = useRef(Date.now())
  const getDurationSec = useCallback(() => {return (Date.now() - startTime.current)/1000},[startTime]);

  // 密度行列の状態(bloch球座標)
  const [x, setX] = useState<number>(1);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(0);

  // 初期状態(時間発展中は指数写像で計算するので固定しておきたいのでこれを初期値につかう。置き場)
  const developInitState = useRef(new Mat2(Complex(1/2),new Vec3(Complex(x/2,0),Complex(y/2,0),Complex(z/2,0))));

  // 状態変化があったときのコールバック(描画位置を追加し、スライダーを上書きする)
  const handleStateChange = (x: number, y: number, z: number) => {
    setX(x);
    setY(y);
    setZ(z);
    updateRenderPosition(x,y,z);
  };

  const handleStateChangeByUI = (x: number, y: number, z: number) => {
    setX(x);
    setY(y);
    setZ(z);
    updateRenderPosition(x,y,z);
    // 時間発展中に強引に動かした場合も対応する。
    developInitState.current = new Mat2(Complex(1/2),new Vec3(Complex(x/2,0),Complex(y/2,0),Complex(z/2,0)));
    startTime.current = Date.now();
  };

  // スライダーUIから設定行列値を受け取る
  // しかしアニメーション中にリアタイで変えることができていない。
  const handleHMatrixChange = useCallback((m:Mat2)=> {
    setHMatrix(m);
  },[]);
  const handleLMatrixChange = useCallback((m:Mat2)=> {
    setLMatrix(m);
  },[]);

  // 状態と軌跡の描画用状態。pointPositionは最新点、trackは軌跡、posotionsBufferは軌跡管理のringedbuffer
  const [pointPosition, setPointPosition] = useState(new THREE.Vector3(0, 0, 1)); // 現在の状態
  const [track,setTrack] = useState(new Float32Array()); // 現在の軌跡
  const buffersize = 300;
  const positionsBuffer = useRef(new PositionsBuffer(buffersize)); // 軌跡管理。更新されたら↑に反映する。
  // これをflushすればOK

  // 新しい点を追加して描画位置を更新する
  const updateRenderPosition = useCallback((x:number,y:number,z:number) => {
    setPointPosition(new THREE.Vector3(y,z,x)); // CG慣習から数理物理の慣習にずらす
    positionsBuffer.current.append(y,z,x); // CG慣習から数理物理の慣習にずらす
    setTrack(positionsBuffer.current.getBuffer());
  },[]); // positionsBufferはuseRefで直接参照しているので更新不要

  // 時間発展をON/OFFするスイッチの状態とハンドラ(２重にして立ち上がり立ち下がりを検出)
  const [developSwitch, setDevelopSwitch] = useState(false);
  const innerSwitchState = useRef(false);

  // 時間発展のON/OFF
  const interval = useRef<NodeJS.Timeout|null>(null)
  useEffect(() => {
    if (developSwitch === innerSwitchState.current) {// 偽の発火でした。無視。
      return;
    }
    innerSwitchState.current = developSwitch
    if (developSwitch) {// 時間発展を開始
      // 初期状態をキャプチャ+経過時間原点を更新
      developInitState.current = new Mat2(Complex(1/2),new Vec3(Complex(x/2,0),Complex(y/2,0),Complex(z/2,0)));
      startTime.current = Date.now();
      interval.current = setInterval(() => {
        // 初期状態をLindbladianの指数写像によって状態更新
        let init = developInitState.current;
        let developed = expDevelop(init,hyperLindblad.current,getDurationSec());
        let bloch_coords = developed.toBloch();
        handleStateChange(bloch_coords.x.re,bloch_coords.y.re,bloch_coords.z.re);
      }, 50);
    } else {
      // 時間発展終了
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
      interval.current = null;
    }
  },[developSwitch]);// スイッチの状態変化に応じて時間発展を起動する。Lindbladianはリアルタイムで監視

  // 時間発展ボタンコールバック。論理状態をトグルする+軌跡を削除する
  const onClickDevelopButton = useCallback(() => {
    setDevelopSwitch(!developSwitch)
  },[developSwitch]);
  const onClickTrackFlushButton = useCallback(()=> {
    positionsBuffer.current = new PositionsBuffer(buffersize);
    setTrack(positionsBuffer.current.getBuffer());
  },[]);

  const onClickRandomSetting = useCallback(()=>{
    setHMatrix(randomH());
    setLMatrix(randomL());
  },[]);

  const onClickPresession = useCallback(()=>{
    setHMatrix(initH);
    setLMatrix(initL);
  },[]);

  return (
    <div>
      <div>
        <SphereRenderer track={track} pointPosition={pointPosition} />
      </div>
      <div className="input-group">
        <h3>状態(Bloch球x/y/z座標)</h3>
        <SlidersUI x={x} y={y} z={z} onValuesChange={handleStateChangeByUI} />
      </div>
      <div className="input-group">
        <h3>コントロール</h3>
        <div>
          <button className="fixed-width-button" onClick = {onClickDevelopButton} style={{ backgroundColor: developSwitch ? "red" : "yellow"}}>{developSwitch ? "時間発展中" : "停止中"}</button>
          <button className="fixed-width-button" onClick = {onClickTrackFlushButton}>軌道履歴を消す</button>
          <button className="fixed-width-button" onClick = {onClickPresession}>歳差運動なH/L</button>
          <button className="fixed-width-button" onClick = {onClickRandomSetting}>ランダムなH/L</button>
        </div>
      </div>
      <div className="input-group">
        <h3>Lindbladian設定</h3>
        <div>
          <h4>H(Pauli Matrixの実係数展開)</h4>
          <HermiteMatrixInput onMatrixChange={handleHMatrixChange} matrix={matrix_H}/>
        </div>
        <div>
          <h4>L(Pauli Matrixの複素係数展開)</h4>
          <ComplexMatrixInput onMatrixChange={handleLMatrixChange} matrix={matrix_L}/>
        </div>
      </div>
    </div>
  );
};


const root = ReactDOM.createRoot(document.getElementById('uiroot')!);
root.render(<App />);
