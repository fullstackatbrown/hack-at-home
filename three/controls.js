import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

class Controls {
    constructor(camera, iframe) {
        this.onMouseDownMouseX = 0;
        this.onMouseDownMouseY = 0;
        this.onMouseDownLon = 0;
        this.onMouseDownLat = 0;
        this.clickable = [];    //array that keeps track of zoomable items
        this.clickableOnZoom = [];
        this.hoverable = [];    //array that keeps track of hoverable groups of items
        this.intersected = false;
        this.iframe = iframe
        this.camera = camera;
        this.animateTimeout = null;
        this.isUserInteracting = false;
        this.shouldAnimate = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isZoomed = false;

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


    onPointerStart = (event) => {
        document.getElementsByTagName("body")[0].style.cursor = 'grabbing';
        // for disable interaction on drag
        this.iframe.style.pointerEvents = 'none';
        this.isUserInteracting = true;
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
            if (intersects.length > 0) {
                this.camera.zoomOnObject(intersects[0].object);
            } else {
                this.camera.camX = 0;
                this.camera.camY = 0;
                this.camera.camZ = 0;
                this.isZoomed = false;
            }
        } else { // only check for the first layer of clickable objects (e.g. the whiteboard but not the sticky notes)
            const intersects = this.raycaster.intersectObjects(this.clickable, true);
            if (intersects.length > 0) {
                this.camera.zoomOnObject(intersects[0].object);
                this.isZoomed = true;
            } else {
                this.camera.camX = 0;
                this.camera.camY = 0;
                this.camera.camZ = 0;
                this.isZoomed = false;
            }
        }
    }

    onPointerMove = (event) => {
        // Disable animations after mouse is stationary
        clearTimeout(this.animateTimeout)
        this.shouldAnimate = true;
        this.animateTimeout = setTimeout(() => {
            this.shouldAnimate = false;
        }, 600);
        if (this.isUserInteracting === true) {
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;
            this.camera.lon = (this.onMouseDownMouseX - clientX) * 0.1 + this.onMouseDownLon;
            this.camera.lat = (clientY - this.onMouseDownMouseY) * 0.1 + this.onMouseDownLat;
        }
        // jiggle screen
        this.camera.tiltX = this.camera.tiltX - ((this.camera.tiltX + (((window.innerWidth / 2) - event.clientX) / (window.innerWidth / 2)) / 25) / 4)
        this.camera.tiltY = this.camera.tiltY - ((this.camera.tiltY + (((window.innerHeight / 2) - event.clientY) / (window.innerHeight / 2)) / 25) / 4)

        // tiltX = window.innerWidth

        //calculates device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //update picking ray based off mouse and camera position
        this.raycaster.setFromCamera(this.mouse, this.camera.camera);
        const intersects = this.raycaster.intersectObjects(this.hoverable, true);
        // if the mouse intersects with an object in hoverable
        if (intersects.length > 0) {
            if (!this.intersected) {
                // search through hoverable to see if the intersection is of a hoverable model
                for (var i = 0; i < this.hoverable.length; i++) {
                    if (this.hoverable[i].children.includes(intersects[0].object)) {
                        // redefine intersected as the array of objects in the model
                        this.intersected = this.hoverable[i].children;
                        // for each object in the model, store the current hex and then highlight the model
                        for (var j = 0; j < this.intersected.length; j++) {
                            this.intersected[j].currentHex = this.intersected[j].material.color.getHex();
                            this.intersected[j].material.color.offsetHSL(0, 0.05, 0.05);
                            // if (this.intersected[j].currentHex == 16777215) {
                            //     this.intersected[j].material.color.offsetHSL(0.2, 0.3, -0.05);
                            // } else {
                            //     this.intersected[j].material.color.offsetHSL(0, 0.05, 0.05);
                            // }
                        }
                    }
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
            }
        }
    }

    onPointerUp = () => {
        document.getElementsByTagName("body")[0].style.cursor = 'default';
        // for disable interaction on drag
        this.iframe.style.pointerEvents = 'auto';
        this.isUserInteracting = false;
    }
}

export default Controls
