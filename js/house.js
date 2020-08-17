import * as THREE from "../node_modules/three/build/three.module.js"

import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js';

var container = document.body;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xffffff, 1);
container.appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 2, 8);

var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(5, 2, 8.01);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// add lighting
scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.4));
var dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 2, 8);
scene.add(dirLight);

camera.position.z = 5;

function init() {
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

init()

// consider compressing with draco

var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('../node_modules/three/examples/js/libs/draco/gltf/');
var loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load('../assets/models/LittlestTokyo.glb', function (gltf) {
    var model = gltf.scene;
    model.position.set(1, 1, 0);
    model.scale.set(0.01, 0.01, 0.01);
    scene.add(model);
}, undefined, function (e) {
    console.error(e);
});
animate()
