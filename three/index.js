import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import Camera from './camera.js';
import Controls from './controls.js';
import Loader from './loader.js';

import {CSS3DRenderer, CSS3DObject} from 'https://unpkg.com/three@0.119.1/examples/jsm/renderers/CSS3DRenderer.js';
var container = document.body;

var iframe;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xffffff, 1);
container.appendChild(renderer.domElement);

var renderercss = new CSS3DRenderer();
renderercss.setSize(window.innerWidth, window.innerHeight);
renderercss.domElement.style.position = 'absolute';
renderercss.domElement.style.top = '0px';
container.appendChild(renderercss.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new Camera();

// Shadow light
// var light = new THREE.HemisphereLight( 0xffffff, 0x474747, 1.2 );
// light.position.set( 0, 3, 0 );
// scene.add(light);

// Ambient light
var light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

var Stream = function (x, y, z, ry) {
    var div = document.createElement('div');
    div.style.width = '480px';
    div.style.height = '320px';
    div.style.backgroundColor = '#000';
    iframe = document.createElement('iframe');
    iframe.style.width = '480px';
    iframe.style.height = '320px';
    iframe.style.border = '0px';
    iframe.id = 'stream'
    // iframe.style.pointerEvents = 'none';
    iframe.src = 'https://player.twitch.tv/?channel=starlitedrivein&parent=localhost';
    div.appendChild(iframe);
    var object = new CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;
    return object;
};

// TODO: bind horizontal scroll to room change

var stream = new Stream(2800, 100, -1500, -Math.PI / 4)
scene.add(stream);

const controls = new Controls(camera, scene, iframe);
const loader = new Loader(scene, controls)
loader.manager.onLoad = function () {
    console.log('Loading complete!');
    update();
    $(".spinner").animate({opacity: 0}, 500, () => {
        $(".clouds__right").removeClass("clouds__right_active")
        $(".clouds__left").removeClass("clouds__left_active")
    })
};

function animate() {
    requestAnimationFrame(animate);
    camera.update()
    // POWER SAVE
    if (controls.shouldAnimate) {
        update();
    }
}

function update() {
    renderer.render(scene, camera.camera);
    renderercss.render(scene, camera.camera);
}

function onWindowResize() {
    camera.onResize()
    renderercss.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // if we are not animating frames, update manually
    if (!controls.shouldAnimate) {
        update();
    }
}

window.addEventListener('resize', onWindowResize, false);

animate()
