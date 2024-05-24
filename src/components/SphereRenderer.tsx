import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeJSSceneProps {
  animatePoint: boolean;
  pointPosition: THREE.Vector3;
}

const SphereRenderer: React.FC<ThreeJSSceneProps> = ({ animatePoint, pointPosition }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const [point, setPoint] = useState<THREE.Mesh | null>(null);
  const [path, setPath] = useState<THREE.Line | null>(null);
  const maxPoints = 1000;
  const positions = new Float32Array(maxPoints * 3);
  let drawCount = 0;

  // 初期化処理
  useEffect(() => {
    // nullチェック
    if (!containerRef.current) return;
  
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
  
    // ブロッホ球を
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
  
    const pointGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(1, 0, 0);
    scene.add(point);
    setPoint(point);

    const pointGeometry2 = new THREE.SphereGeometry(0.05, 32, 32);
    const pointMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const point2 = new THREE.Mesh(pointGeometry2, pointMaterial2);
    point2.position.copy(pointPosition);
    scene.add(point2);
    setPoint(point2);
  
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
  
    const pathGeometry = new THREE.BufferGeometry();
    pathGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const path = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(path);
    setPath(path);
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    setControls(controls);
  
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
  
    // animateを初期化時にも呼び出す
    animate();
  
    function animate() {
      requestAnimationFrame(animate);
  
      if (animatePoint) {
        const time = Date.now() * 0.001;
        const angle = time * 0.5;
        point.position.set(Math.cos(angle), 0, Math.sin(angle));
      } else {
        point.position.copy(pointPosition);
      }
  
      updatePath(point.position);
      controls.update();
      renderer.render(scene, camera);
    }
  
    function updatePath(position: THREE.Vector3) {
      positions.set([position.x, position.y, position.z], drawCount * 3);
      drawCount = (drawCount + 1) % maxPoints;
      path.geometry.setDrawRange(0, drawCount);
      path.geometry.attributes.position.needsUpdate = true;
    }
  
    return () => {
      // Three.jsのリソースを解放
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);
  
  // pointPositionの変更を監視して更新
  useEffect(() => {
    if (point) {
      point.position.copy(pointPosition);
    }
  }, [pointPosition]);

  return <div ref={containerRef} id="container" />;
};

export default SphereRenderer;
