import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import Camera from './camera.js'

import {GLTFLoader} from "https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/DRACOLoader.js';
import {CSS3DRenderer, CSS3DObject} from 'https://unpkg.com/three@0.119.1/examples/jsm/renderers/CSS3DRenderer.js';

// camera control vars
var isUserInteracting = false, shouldAnimate = false, animateTimeout = null,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    onMouseDownLon = 0, onMouseDownLat = 0;

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
        onMouseDownLon = camera.lon;
        onMouseDownLat = camera.lat;

        //calculates device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //update picking ray based off mouse and camera position
        raycaster.setFromCamera(mouse, camera.camera);
        const intersects = raycaster.intersectObjects(clickable, true);
        if (intersects.length > 0) {
            zoomOnObject(intersects[0].object);
        } else {
            camera.camX = 0;
            camera.camY = 0;
            camera.camZ = 0;
        }
        // let zoomedIn;
        // if (zoomedIn) {
        //     camera.position.set(0,0,0);
        // } else {
        //     for (var i = 0; i <clickable.length; i++) {
        //         if ( raycaster.ray.intersectsBox(clickable[i]) === true ) {
        //             zoomOnObject(clickable[i]);
        //             zoomedIn = true;
        //         }
        //     }
        // }
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
            camera.lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
            camera.lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
        }
        // jiggle screen
        camera.tiltX = camera.tiltX - ((camera.tiltX + (((window.innerWidth / 2) - event.clientX) / (window.innerWidth / 2)) / 25) / 4)
        camera.tiltY = camera.tiltY - ((camera.tiltY + (((window.innerHeight / 2) - event.clientY) / (window.innerHeight / 2)) / 25) / 4)

        // tiltX = window.innerWidth

        //calculates device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //update picking ray based off mouse and camera position
        raycaster.setFromCamera(mouse, camera.camera);
        const intersects = raycaster.intersectObjects(hoverable, true);
        // if the mouse intersects with an object in hoverable
        if (intersects.length > 0) {
            if (!INTERSECTED) {
                // search through hoverable to see if the intersection is of a hoverable model
                for (var i = 0; i < hoverable.length; i++) {
                    if (hoverable[i].children.includes(intersects[0].object)) {
                        // redefine INTERSECTED as the array of objects in the model
                        INTERSECTED = hoverable[i].children;
                        // for each object in the model, store the current hex and then highlight the model
                        for (var j = 0; j < INTERSECTED.length; j++) {
                            INTERSECTED[j].currentHex = INTERSECTED[j].material.color.getHex();
                            INTERSECTED[j].material.color.offsetHSL(0, 0.05, 0.035);
                        }
                    }
                }
            }
            // if mouse hovers off a hoverable object (no intersections)
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

const camera = new Camera();

var light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

var raycaster = new THREE.Raycaster();
raycaster.layers.set(0);
var mouse = new THREE.Vector2();

//array that keeps track of zoomable items
var clickable = [];
//array that keeps track of hoverable items
var hoverable = [];

function animate() {
    // TODO: remove unneeded animation frame requests
    requestAnimationFrame(animate);
    camera.update()
    // POWER SAVE
    if (shouldAnimate) {
        update();
    }
}

function update() {
    if (isUserInteracting === false) {
        // snap to grid
        // TODO: Camera movement
    }
    renderer.render(scene, camera.camera);
    renderercss.render(scene, camera.camera);
}


function init() {
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.onResize()
    renderercss.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // if we are not animating frames, update manually
    if (!shouldAnimate) {
        update();
    }
}

function zoomOnObject(box, offset) {
    let center = new THREE.Vector3();
    let size = new THREE.Vector3();
    let cameraDist;
    //increase cameraDist so object isn't the entire screen
    offset = offset || 1.75;

    // create bounding box from object and get center and dimensions of object
    let boundingBox = new THREE.Box3();
    boundingBox.setFromObject(box);
    boundingBox.getCenter(center);
    boundingBox.getSize(size);

    camera.camera.lookAt(center);
    // update y position of camera to level with the object
    camera.camY = center.y;
    // move the camera closer to the object (change x or z to move closer to object)
    // adjust the other axis position to the center of the object
    if (Math.abs(center.x) == Math.max(Math.abs(center.x), Math.abs(center.z))) {
        camera.camZ = center.z;
        let maxDim = Math.max(size.y, size.z); //check which dimension you have to fit view to
        if (maxDim === size.y) {
            cameraDist = maxDim / (2 * Math.tan(fov / 2));
            cameraDist += size.x / 2;
            cameraDist *= offset;
        } else { //do the same calculations but with horizontal field of view
            const aspect = camera.camera.aspect;
            const hFOV = 2 * Math.atan(Math.tan(camera.camera.fov / 2) * aspect);
            cameraDist = maxDim / (2 * Math.tan(hFOV / 2));
            cameraDist += size.x / 2;
            cameraDist *= offset;
        }
        if (center.x > 0) {
            camera.camX = center.x - cameraDist;
        } else {
            camera.camX = center.x + cameraDist;
        }
    } else { //set x, zoom on z axis
        camera.camX = center.x;
        let maxDim = Math.max(size.y, size.x);
        if (maxDim === size.y) {
            cameraDist = maxDim / (2 * Math.tan(fov / 2));
            cameraDist += size.z / 2;
            cameraDist *= offset;
        } else {
            const aspect = camera.camera.aspect;
            const hFOV = 2 * Math.atan(Math.tan(camera.camera.fov / 2) * aspect);
            cameraDist = maxDim / (2 * Math.tan(hFOV / 2));
            cameraDist += size.z / 2;
            cameraDist *= offset;
        }
        if (center.z > 0) {
            camera.camZ = center.z - cameraDist;
        } else {
            camera.camZ = center.z + cameraDist;
        }
    }
    camera.camera.updateProjectionMatrix();
}

init()

var manager = new THREE.LoadingManager();

manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function () {
    console.log('Loading complete!');
    update();
    $(".clouds__right").removeClass("clouds__right_active")
    $(".clouds__left").removeClass("clouds__left_active")
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
    // let zoomable = model.children[2].children[0].clone();
    // zoomable.position.set(10, -2.2, 1);
    // zoomable.rotateY(THREE.MathUtils.degToRad(180));
    // zoomable.scale.set(0.5,0.5,0.5)
    // var box = new THREE.BoxHelper();
    // box.setFromObject(zoomable);
    // clickable.push(box);
    clickable.push(model.children[2].children[0]);
    hoverable.push(model.children[2]);
    scene.add(model);
    // scene.add(box);
    // scene.add(zoomable);
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

var stream = new Stream(800, 100, 0, -Math.PI / 2)
scene.add(stream);

var controls = new Controls()

animate()
