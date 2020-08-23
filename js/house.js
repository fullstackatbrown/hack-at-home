import * as THREE from "../node_modules/three/build/three.module.js"

import {GLTFLoader} from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import {CSS3DRenderer, CSS3DObject} from '../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';

// camera control vars
var isUserInteracting = false, shouldAnimate = false, animateTimeout = null,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

var container = document.body;

var iframe;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xffffff, 1);
container.appendChild(renderer.domElement);

var labelRenderer = new CSS3DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';

container.appendChild(labelRenderer.domElement);

var Controls = function () {
    window.addEventListener('mousedown', onPointerStart, false);
    window.addEventListener('mousemove', onPointerMove, false);
    window.addEventListener('mouseup', onPointerUp, false);
    window.addEventListener('touchstart', onPointerStart, false);
    window.addEventListener('touchmove', onPointerMove, false);
    window.addEventListener('touchend', onPointerUp, false);

    window.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, false);

    window.addEventListener('dragenter', function () {
        document.body.style.opacity = 0.5;
    }, false);

    window.addEventListener('dragleave', function () {
        document.body.style.opacity = 1;
    }, false);

    window.addEventListener('drop', function (event) {
        event.preventDefault();
        var reader = new FileReader();
        reader.addEventListener('load', function (event) {
            material.map.image.src = event.target.result;
            material.map.needsUpdate = true;
        }, false);
        reader.readAsDataURL(event.dataTransfer.files[0]);
        document.body.style.opacity = 1;
    }, false);

    function onPointerStart(event) {
        // POWER SAVE
        clearTimeout(animateTimeout)
        // for disable interaction on drag
        iframe.style.pointerEvents = 'none';
        shouldAnimate = true;
        isUserInteracting = true;
        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;
        onMouseDownMouseX = clientX;
        onMouseDownMouseY = clientY;
        onMouseDownLon = lon;
        onMouseDownLat = lat;
    }

    function onPointerMove(event) {
        if (isUserInteracting === true) {
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;
            lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
            lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
        }
    }

    function onPointerUp() {
        // POWER SAVE
        animateTimeout = setTimeout(function () {
            shouldAnimate = false
        }, 400);

        // for disable interaction on drag
        iframe.style.pointerEvents = 'auto';
        isUserInteracting = false;
    }
}


var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 0);
camera.target = new THREE.Vector3(0, 0, 0);

var light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

function animate() {
    // TODO: remove unneeded animation frame requests
    requestAnimationFrame(animate);

    // POWER SAVE
    if (shouldAnimate) {
        update();
    }
}

let speed = 0.2 // snap speed
function update() {
    lat = Math.max(-85, Math.min(85, lat));
    // phi = THREE.MathUtils.degToRad( 90 - lat );
    phi = THREE.MathUtils.degToRad(90)
    if (isUserInteracting === false) {
        // snap to grid
        let diff = Math.round(lon / 60.0) * 60 - lon;
        lon = lon + (diff * speed)
    }
    theta = THREE.MathUtils.degToRad(lon);
    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}


function init() {
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // if we are not animating frames, update manually
    if (!shouldAnimate) {
        update();
    }
}

init()

var manager = new THREE.LoadingManager();

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
    console.log( 'Loading complete!');
    update()
};

// consider compressing with draco
var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('node_modules/three/examples/js/libs/draco/gltf/');
var loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoLoader);
loader.load('assets/models/room.glb', function (gltf) {
    var model = gltf.scene;
    model.position.set(0, -4, 0);
    model.scale.set(3, 3, 3);
    model.matrixAutoUpdate = false
    model.updateMatrix()
    scene.add(model);
}, undefined, function (e) {
    console.error(e);
});
loader.load('assets/models/cubby.glb', function (gltf) {
    var model = gltf.scene;
    model.position.set(7, -2.2, 1);
    model.scale.set(1, 1, 1);
    model.rotateY(THREE.MathUtils.degToRad(180))
    model.matrixAutoUpdate = false
    model.updateMatrix()
    scene.add(model);
}, undefined, function (e) {
    console.error(e);
});

var Stream = function (x, y, z, ry) {
    var div = document.createElement('div');
    div.style.width = '480px';
    div.style.height = '320px';
    div.style.backgroundColor = '#000';
    iframe = document.createElement('iframe');
    iframe.style.width = '480px';
    iframe.style.height = '320px';
    iframe.style.border = '0px';
    // iframe.style.pointerEvents = 'none';
    iframe.src = 'https://player.twitch.tv/?channel=starlitedrivein&parent=localhost';
    div.appendChild(iframe);
    var object = new CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;
    return object;
};

// TODO: bind horizontal scroll to room change

// TODO: fix stream overlapping with drag
var twitch = new Stream(800, 100, 0, -Math.PI / 2)
scene.add(twitch);

var controls = new Controls()

animate()
