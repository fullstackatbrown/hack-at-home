import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

import {GLTFLoader} from "https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/DRACOLoader.js';
import {CSS3DRenderer, CSS3DObject} from 'https://unpkg.com/three@0.119.1/examples/jsm/renderers/CSS3DRenderer.js';

// camera control vars
var isUserInteracting = false, shouldAnimate = false, animateTimeout = null,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0,
    tiltX = 0, tiltY = 0;

// hover/click control
var INTERSECTED;

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
        document.getElementsByTagName("body")[0].style.cursor = 'grabbing';
        // for disable interaction on drag
        iframe.style.pointerEvents = 'none';
        isUserInteracting = true;
        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;
        onMouseDownMouseX = clientX;
        onMouseDownMouseY = clientY;
        onMouseDownLon = lon;
        onMouseDownLat = lat;

        //calculates device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //update picking ray based off mouse and camera position
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickable, true);
        for (var i = 0; i < intersects.length; i++) {
            console.log(intersects[i].object);
        };
    }

    function onPointerMove(event) {
        // Disable animations after mouse is stationary
        clearTimeout(animateTimeout)
        shouldAnimate = true;
        animateTimeout = setTimeout(function () {
            shouldAnimate = false
        }, 600);
        if (isUserInteracting === true) {
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;
            lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
            lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
        }
        // jiggle screen
        tiltX = tiltX - ((tiltX + (((window.innerWidth / 2) - event.clientX) / (window.innerWidth / 2)) / 25) / 4)
        tiltY = tiltY - ((tiltY + (((window.innerHeight / 2) - event.clientY) / (window.innerHeight / 2)) / 25) / 4)

        // tiltX = window.innerWidth

        //calculates device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //update picking ray based off mouse and camera position
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickable, true);
        // if the mouse intersects with an object in clickable
        if (intersects.length > 0){
            if (!INTERSECTED) {
                // search through clickable to see if the intersection is of a clickable model
                for (var i = 0; i < clickable.length; i++){
                    if (clickable[i].children.includes(intersects[0].object)){
                        // redefine INTERSECTED as the array of objects in the model
                        INTERSECTED = clickable[i].children;
                        // for each object in the model, store the current hex and then highlight the model
                        for (var j = 0; j < INTERSECTED.length; j++) {
                            INTERSECTED[j].currentHex = INTERSECTED[j].material.color.getHex();
                            INTERSECTED[j].material.color.offsetHSL(0,0.05,0.035);
                        }
                    }
                }
            }
        // if mouse hovers off a clickable object (no intersections)
        } else {
            // if a model's color was changed/highlighted, revert to original and set INTERSECTED to null
            if (INTERSECTED) {
                for (var j = 0; j < INTERSECTED.length; j++) {
                    INTERSECTED[j].material.color.setHex(INTERSECTED[j].currentHex);
                }
                INTERSECTED = null;
            }    
        }
    }

    function onPointerUp() {
        document.getElementsByTagName("body")[0].style.cursor = 'default';
        // for disable interaction on drag
        iframe.style.pointerEvents = 'auto';
        isUserInteracting = false;
    }
}


var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 0);
camera.target = new THREE.Vector3(0, 0, 0);
camera.layers.enable(1);

var light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

var raycaster = new THREE.Raycaster();
raycaster.layers.set(0);
var mouse = new THREE.Vector2();

//array that keeps track of clickable items
var clickable = [];

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
    phi += tiltY;
    theta += tiltX;
    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);
    renderer.render(scene, camera);
    renderercss.render(scene, camera);
}


function init() {
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderercss.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // if we are not animating frames, update manually
    if (!shouldAnimate) {
        update();
    }
}

init()

var manager = new THREE.LoadingManager();

manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function () {
    console.log('Loading complete!');
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
    model.scale.set(4, 4, 4);
    model.matrixAutoUpdate = false;
    model.updateMatrix()
    scene.add(model);
}, undefined, function (e) {
    console.error(e);
});
loader.load('assets/models/cubby.glb', function (gltf) {
    var model = gltf.scene;
    model.position.set(10, -2.2, 1);
    model.scale.set(1, 1, 1);
    model.rotateY(THREE.MathUtils.degToRad(180))
    model.matrixAutoUpdate = false;
    model.updateMatrix()
    model.name = "cubby";
    clickable.push(model.children[2]);
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

// TODO: fix stream overlapping with drag
var stream = new Stream(800, 100, 0, -Math.PI / 2)
scene.add(stream);

var controls = new Controls()

animate()
