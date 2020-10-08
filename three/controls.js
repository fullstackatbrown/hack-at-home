import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import {CSS3DObject} from 'https://unpkg.com/three@0.119.1/examples/jsm/renderers/CSS3DRenderer.js';

const trueMod = (n, m) => {
    return ((n % m) + m) % m;
}

class Controls {
    constructor(camera, scene, iframe) {
        this.onMouseDownMouseX = 0;
        this.onMouseDownMouseY = 0;
        this.onMouseDownLon = 0;
        this.onMouseDownLat = 0;
        this.clickable = [];    //array that keeps track of zoomable items
        this.clickableOnZoom = [];
        this.hoverable = [];    //array that keeps track of hoverable threejs groups of meshes and individual meshes
        this.hoverableOnZoom = [];
        this.intersected = false;
        this.iframe = iframe
        this.camera = camera;
        this.scene = scene;
        this.animateTimeout = null;
        this.isUserInteracting = false;
        this.shouldAnimate = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isZoomed = false;
        this.isZoomedSecond = false;
        // object to zoom in on out of the entire group (linked to toZoom in userData)
        // (e.g. zoom on top door, but make entire fridge clickable)
        this.objToZoom = null;

        this.raycaster.layers.set(0);
        this.addListeners()
    }

    addListeners = () => {
        window.addEventListener('mousedown', this.onPointerStart, false);
        window.addEventListener('mousemove', this.onPointerMove, false);
        window.addEventListener('mouseup', this.onPointerUp, false);
        window.addEventListener('touchstart', this.onPointerStart, false);
        window.addEventListener('touchmove', this.onPointerMove, false);
        window.addEventListener('touchend', this.onPointerUp, false);
        $("#arrow-left").on('click', () => {
            if(!this.isZoomed) {
                this.navigateTo(trueMod(this.camera.currentIndex - 1, 9))
            }
        })
        $("#arrow-right").on('click', () => {
            if(!this.isZoomed) {
                this.navigateTo(trueMod(this.camera.currentIndex + 1, 9))
            }
        })

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
    }


    playAnimations = () => {
        clearTimeout(this.animateTimeout)
        this.shouldAnimate = true;
        this.animateTimeout = setTimeout(() => {
            this.shouldAnimate = false;
        }, 600);
    }


    onPointerStart = (event) => {
        // If we are on the 10% margins of the screen, do not register
        if (Math.min(event.clientX, event.view.innerWidth - event.clientX) <= (event.view.innerWidth * 0.1)) {
            return
        }
        this.playAnimations()
        document.getElementsByTagName("body")[0].style.cursor = 'grabbing';
        // for disable interaction on drag
        this.iframe.style.pointerEvents = 'none';
        this.isUserInteracting = true;
        this.camera.isUserInteracting = true;
        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;
        this.onMouseDownMouseX = clientX;
        this.onMouseDownMouseY = clientY;
        this.onMouseDownLon = this.camera.lon;
        this.onMouseDownLat = this.camera.lat;

        //calculates device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //update picking ray based off mouse and camera position
        this.raycaster.setFromCamera(this.mouse, this.camera.camera);
        if (this.isZoomed) { // start checking for clicks on objects that are only clickable after zooming in (e.g. sticky notes)
            const intersects = this.raycaster.intersectObjects(this.clickableOnZoom, true);
            this.scene.remove(this.scene.getObjectByName("wkshop"));
            if (intersects.length > 0) {
                console.log(intersects)
                this.objToZoom = intersects[0].object;
                if (this.objToZoom.userData.html) { // if its a sticky note, add a new workshop
                    console.log("yes")
                    var wkshop = new Workshop(1000, 0, 1250, -5*Math.PI / 6, this.objToZoom.userData.html);
                    this.scene.add(wkshop);
                } else { // if its not a sticky note, zoom in on the object
                    if(this.objToZoom.userData.link) {
                        window.open(this.objToZoom.userData.link);
                    } else {
                        this.camera.zoomOnObject(this.objToZoom);
                        this.isZoomedSecond = true;
                    }
                }
            } else {
                //check if clicking off second, internal layer of clickables to the first layer of clickables
                const intersectsNew = this.raycaster.intersectObjects(this.clickable, true);
                if (this.isZoomedSecond && intersectsNew.length > 0) {
                    if (intersectsNew[0].object.parent.userData.toZoom) {
                        this.objToZoom = intersectsNew[0].object.parent.userData.toZoom;
                    } else {
                        this.objToZoom = intersectsNew[0].object;
                    }
                    this.camera.zoomOnObject(this.objToZoom);
                    this.isZoomed = true;
                    this.isZoomedSecond = false;
                } else { //check if clicking off all clickable objects completely
                    this.camera.camX = 0;
                    this.camera.camY = 0;
                    this.camera.camZ = 0;
                    this.isZoomed = false;
                    this.scene.remove(this.scene.getObjectByName("wkshop"));
                }
            }
        } else { // only check for the first layer of clickable objects (e.g. the whiteboard but not the sticky notes)
            const intersects = this.raycaster.intersectObjects(this.clickable, true);
            if (intersects.length > 0) {
                console.log(intersects)
                if (intersects[0].object.userData.link) {
                    window.open(intersects[0].object.userData.link);
                } else {
                    if (intersects[0].object.parent.userData.toZoom) {
                        this.objToZoom = intersects[0].object.parent.userData.toZoom;
                    } else {
                        this.objToZoom = intersects[0].object;
                    }
                    if (this.objToZoom.userData.offsetX) {
                        if (this.objToZoom.userData.angle) {
                            this.camera.zoomOnObject(this.objToZoom, this.objToZoom.userData.offsetX, this.objToZoom.userData.offsetZ, this.objToZoom.userData.angle);
                        } else {
                            this.camera.zoomOnObject(this.objToZoom, this.objToZoom.userData.offsetX, this.objToZoom.userData.offsetZ);
                        }
                    } else {
                        this.camera.zoomOnObject(this.objToZoom);
                    }
                    this.isZoomed = true;
                }
            } else {
                this.camera.camX = 0;
                this.camera.camY = 0;
                this.camera.camZ = 0;
                this.isZoomed = false;
                this.scene.remove(this.scene.getObjectByName("wkshop"));
            }
        }
    }

    onPointerMove = (event) => {
        this.playAnimations()
        if (this.isUserInteracting === true && !this.isZoomed) {
            let clientX = event.clientX || event.touches[0].clientX;
            let clientY = event.clientY || event.touches[0].clientY;
            this.camera.lon = (this.onMouseDownMouseX - clientX) * 0.045 + this.onMouseDownLon;
            this.camera.lat = (clientY - this.onMouseDownMouseY) * 0.045 + this.onMouseDownLat;
        }
        // jiggle screen
        this.camera.tiltX = this.camera.tiltX - ((this.camera.tiltX + (((window.innerWidth / 2) - event.clientX) / (window.innerWidth / 2)) / 55) / 3)
        this.camera.tiltY = this.camera.tiltY - ((this.camera.tiltY + (((window.innerHeight / 2) - event.clientY) / (window.innerHeight / 2)) / 55) / 3)

        //calculates device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //update picking ray based off mouse and camera position
        this.raycaster.setFromCamera(this.mouse, this.camera.camera);
        let intersects = [];
        if (this.isZoomed) {
            intersects = this.raycaster.intersectObjects(this.hoverableOnZoom, true);
        } else {
            intersects = this.raycaster.intersectObjects(this.hoverable, true);
        }
        // if the mouse intersects with an object in hoverable
        if (intersects.length > 0) {
            if (!this.intersected) {
                document.getElementsByTagName("body")[0].style.cursor = 'pointer';
                if (this.isZoomed) {
                    this.highlightObj(this.hoverableOnZoom, intersects);
                } else {
                    this.highlightObj(this.hoverable, intersects);
                }
            }
            // if mouse hovers off a hoverable object (no intersections)
        } else {
            // if a model's color was changed/highlighted, revert to original and set intersected to null
            if (this.intersected) {
                for (var j = 0; j < this.intersected.length; j++) {
                    this.intersected[j].material.color.setHex(this.intersected[j].currentHex);
                }
                this.intersected = null;
                document.getElementsByTagName("body")[0].style.cursor = 'default';
            }
            // TODO: this breaks grabbing dragging
            // document.getElementsByTagName("body")[0].style.cursor = 'default';
        }
    }

    highlightObj = (hoverType, intersects) => {
        for (var i = 0; i < hoverType.length; i++) {
            if (hoverType[i].children.includes(intersects[0].object)) {
                // redefine intersected as the array of objects in the model
                this.intersected = hoverType[i].children;
                // for each object in the model, store the current hex and then highlight the model
                for (var j = 0; j < this.intersected.length; j++) {
                    this.intersected[j].currentHex = this.intersected[j].material.color.getHex();
                    this.intersected[j].material.color.offsetHSL(-0.025, 0.05, 0.05);
                }
            } else if (hoverType[i] == intersects[0].object) {
                // redefine intersected as the single object in the model
                this.intersected = [hoverType[i]];
                this.intersected[0].currentHex = intersects[0].object.material.color.getHex();
                this.intersected[0].material.color.offsetHSL(-0.025, 0.05, 0.05);
            }
        }
    }

    onPointerUp = () => {
        this.playAnimations()
        document.getElementsByTagName("body")[0].style.cursor = 'default';
        // for disable interaction on drag
        this.iframe.style.pointerEvents = 'auto';
        this.isUserInteracting = false;
        this.camera.isUserInteracting = false;
    }

    navigateTo = (index) => {
        // TODO: GET THE MATH RIGHT
        this.playAnimations()
        const distanceLeft = (index - trueMod(Math.round(this.camera.lon / (360/9)), 9))
        const distanceRight = (index + 9*(!index) - 9*(!trueMod(Math.round(this.camera.lon / (360/9)), 9)) - trueMod(Math.round(this.camera.lon / (360/9)), 9))
        console.log(index, trueMod(Math.round(this.camera.lon / (360/9)), 9), distanceRight, distanceLeft)
        const minDirect = Math.abs(distanceLeft) < Math.abs(distanceRight) ? distanceLeft : distanceRight
        // const minDirect = distanceLeft
        this.camera.targetAngle = (Math.round(this.camera.lon / (360/9)) + minDirect) * (360/9)
    }
}

function Workshop(x, y, z, ry, url) {

    var html = [

      '<div style="width:' + 1100 + 'px; height:' + 900 + 'px;">',
      '<iframe src="' + url + '" width="' + 1100 + '" height="' + 900 + '"style="border-width:0px;">',
      '</iframe>',
      '</div>'

    ].join('\n');

    var div = document.createElement('div');

    $(div).html(html);
    $(div).css("background-color","white");

    var cssObject = new CSS3DObject(div);

    cssObject.name = "wkshop";
    cssObject.position.set(x,y,z);
    cssObject.rotation.y = ry;
    return cssObject;
}

export default Controls
