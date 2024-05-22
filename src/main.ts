import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let sphere: THREE.Mesh, point: THREE.Mesh;
let controls: OrbitControls;


let path: THREE.Line;
const maxPoints = 1000; // 軌道の最大点数
const positions = new Float32Array(maxPoints * 3); // 3次元の位置座標
let drawCount = 0; // 現在描画する点数

init();
animate();

function init() {
    const container = document.getElementById('container')!;

    // シーンの設定
    scene = new THREE.Scene();

    // カメラの設定
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    // レンダラーの設定
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 球体の設定
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // 状態を示す点の設定
    const pointGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(1, 0, 0);  // 初期位置
    scene.add(point);

    // 軸の追加
    const axisLength = 1.5;
    const axesHelper = new THREE.AxesHelper(axisLength);
    scene.add(axesHelper);


    // 半透明の平面の設定
    const planeSize = 2.4;

    // xy平面（z軸と同じ色）
    const xyPlaneGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const xyPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // z軸と同じ色 (青)
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    const xyPlane = new THREE.Mesh(xyPlaneGeometry, xyPlaneMaterial);
    xyPlane.rotation.x = Math.PI / 2;
    scene.add(xyPlane);

    // yz平面（x軸と同じ色）
    const yzPlaneGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const yzPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, // x軸と同じ色 (赤)
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    const yzPlane = new THREE.Mesh(yzPlaneGeometry, yzPlaneMaterial);
    yzPlane.rotation.y = Math.PI / 2;
    scene.add(yzPlane);

    // zx平面（y軸と同じ色）
    const zxPlaneGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const zxPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff, // y軸と同じ色 (緑)
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    const zxPlane = new THREE.Mesh(zxPlaneGeometry, zxPlaneMaterial);
    scene.add(zxPlane);

    // 軌道の設定
    const pathGeometry = new THREE.BufferGeometry();
    pathGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    path = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(path);

    // OrbitControlsの設定
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 慣性を有効にする
    controls.dampingFactor = 0.25; // 慣性のダンピングファクター
    controls.screenSpacePanning = false; // パン操作を無効にする
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI; // 上下の回転制限を無効にする
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: null // 右クリックでの操作を無効にする
    };

    // ウィンドウリサイズに対応
    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // 必ずアップデートを呼び出す

    // 回転のアニメーション
    const time = Date.now() * 0.001;
    const angle = time * 0.5; // 速度の調整
    point.position.set(Math.cos(angle), 0, Math.sin(angle));

    updatePath(point.position);

    renderer.render(scene, camera);
}

function updatePath(position: THREE.Vector3) {
    positions.set([position.x, position.y, position.z], drawCount * 3);
    drawCount = (drawCount + 1) % maxPoints;
    path.geometry.setDrawRange(0, drawCount);
    path.geometry.attributes.position.needsUpdate = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
