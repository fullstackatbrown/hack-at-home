import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import Camera from './camera.js?v=1';
import Controls from './controls.js?v=1';
import Loader from './loader.js?v=1';

import {CSS3DRenderer, CSS3DObject} from 'https://unpkg.com/three@0.119.1/examples/jsm/renderers/CSS3DRenderer.js';

var container = document.body;

var iframe;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio * (8 / 10));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xffffff, 1);
container.appendChild(renderer.domElement);

var renderercss = new CSS3DRenderer();
renderercss.setSize(window.innerWidth, window.innerHeight);
renderercss.domElement.style.position = 'absolute';
renderercss.domElement.style.top = '0px';
renderercss.domElement.style.zIndex = '10000';
container.appendChild(renderercss.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new Camera();

// Shadow light
var light = new THREE.HemisphereLight(0xffffff, 0x8f8f8f, 1.0);
light.position.set(0, 3, 0);
scene.add(light);

// Ambient light
var light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);

var Stream = function (x, y, z, ry) {
    var div = document.createElement('div');
    div.style.backgroundColor = '#000';
    iframe = document.createElement('iframe');
    iframe.style.width = '586px';
    iframe.style.height = '320px';
    iframe.style.border = '0px';
    iframe.id = 'stream'
    // iframe.style.pointerEvents = 'none';
    iframe.src = 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fhackingathome%2Fposts%2F136587818172473&width=586&height=320';
    div.appendChild(iframe);
    var object = new CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;
    return object;
};

// TODO: bind horizontal scroll to room change

var stream = new Stream(-3095, -420, 3700, (7 * (Math.PI / 9)))
scene.add(stream);

const controls = new Controls(camera, scene, iframe);
const loader = new Loader(scene, controls)
loader.manager.onLoad = function () {
    console.log('Loading complete!');
    update();
    $(".spinner").animate({opacity: 0}, 500, () => {
        $(".clouds__right").removeClass("clouds__right_active")
        $(".clouds__left").removeClass("clouds__left_active")
        $("#arrow-left").removeClass("arrow__hidden")
        $("#arrow-right").removeClass("arrow__hidden")
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

// Animate spinner in
$(".spinner").animate({opacity: 1}, 500)
