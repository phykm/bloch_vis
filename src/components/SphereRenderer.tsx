import React, { useRef, useEffect, useState } from 'react';
import THREE from '../threejsexporter';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


interface ThreeJSSceneProps {
  pointPosition: THREE.Vector3; // 現在状態の点座標
  track: Float32Array; // 軌道線(両方とも親が管理する)
}

const SphereRenderer: React.FC<ThreeJSSceneProps> = ({ pointPosition, track}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [camera_prj, setCamera_prj] = useState<THREE.OrthographicCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const [point, setPoint] = useState<THREE.Mesh | null>(null);
  const [pathGeometry, setPathGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [path, setPath] = useState<THREE.Line | null>(null);

  // 初期化処理
  useEffect(() => {
    // nullチェック(静的解析対策?)
    if (!containerRef.current) return;
  
    // 描画領域のdiv container
    const container = containerRef.current;
  
    // シーンをdivのフルサイズで用意
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    // 原点から2のカメラ距離
    camera.position.z = 2;
  
    // レンダラ初期化
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
  
    // ブロッホ球を描く。半径1
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // シーンに追加。これはシーンに固定されて動かないので。useStateしていない。
    scene.add(sphere);

    // これは外からの位置指定を受ける点
    const pointGeometry2 = new THREE.SphereGeometry(0.05, 32, 32);
    const pointMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const point2 = new THREE.Mesh(pointGeometry2, pointMaterial2);
    point2.position.copy(pointPosition); // 最初なのでどうでもいいが、一応propを反映する。
    scene.add(point2);
    setPoint(point2);
  
    // 軸と平面
    const axisLength = 1.5;
    const axesHelper = new THREE.AxesHelper(axisLength);
    scene.add(axesHelper);
  
    const planeSize = 2.4;
    const xyPlaneGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const xyPlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1
    });
    const xyPlane = new THREE.Mesh(xyPlaneGeometry, xyPlaneMaterial);
    xyPlane.rotation.x = Math.PI / 2;
    scene.add(xyPlane);
  
    const yzPlaneGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const yzPlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1
    });
    const yzPlane = new THREE.Mesh(yzPlaneGeometry, yzPlaneMaterial);
    yzPlane.rotation.y = Math.PI / 2;
    scene.add(yzPlane);
  
    const zxPlaneGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const zxPlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1
    });
    const zxPlane = new THREE.Mesh(zxPlaneGeometry, zxPlaneMaterial);
    scene.add(zxPlane);
  
    // 軌道
    const pathGeometry = new THREE.BufferGeometry();
    pathGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(), 3));
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const path = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(path);
    setPathGeometry(pathGeometry);
    setPath(path);
  
    // ドラッグでグリグリできるようにする。
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI;
    controls.enableZoom = false; // 移動しないのでzoom不要と判断
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      // MIDDLE: THREE.MOUSE.DOLLY, // いらない気がした。
      // 右には機能割り当てない(カメラが向かう原点は固定)
    };
    setControls(controls);
  
    // windowリサイズ対応
    window.addEventListener('resize', () => {
      if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    });
  
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
  
    // 初期化すると自動的にアニメーションが開始する。
    // 簡単のために、animationは常時起動にしておいて、状態を外部から入力することにする。
    animate();
  
    function animate() {
      requestAnimationFrame(animate);  
      controls.update();
      renderer.render(scene, camera);
    }

    return () => {
      // Three.jsのリソースを解放
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);
  
  // pointPositionの変更を監視して更新(アニメーションが回っていれば更新される)
  useEffect(() => {
    if (point) {
      point.position.copy(pointPosition);
    }
  }, [pointPosition]);

  // 軌跡の更新
  useEffect(() => {
    if (path && pathGeometry) {
      path.geometry.setDrawRange(0, track.length / 3);
      // バッファを与え直す。
      pathGeometry.setAttribute('position', new THREE.BufferAttribute(track, 3));
      path.geometry.attributes.position.needsUpdate = true;
    }
  }, [track]);

  return <div ref={containerRef} id="container" />;
};

export default SphereRenderer;
