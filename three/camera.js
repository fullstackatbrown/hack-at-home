import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

class Camera {
    constructor() {
        this.lat = 0;
        this.lon = 0;
        this.camX = 0;
        this.camY = 0;
        this.camZ = 0;
        this.phi = 0;
        this.theta = 0;
        this.tiltX = 0;
        this.tiltY = 0;
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

        // set camera properties
        this.camera.position.set(0, 0, 0);
        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.camera.layers.enable(1);
    }

    update = () => {
        let speed = 0.2 // snap speed
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.MathUtils.degToRad(90)
        this.theta = THREE.MathUtils.degToRad(this.lon);
        this.phi += this.tiltY;
        this.theta += this.tiltX;
        this.lon = this.lon + ((Math.round(this.lon / 60.0) * 60 - this.lon) * speed)
        this.camera.position.x = this.camera.position.x + ((this.camX - this.camera.position.x) / 2)
        this.camera.position.y = this.camera.position.y + ((this.camY - this.camera.position.y) / 2)
        this.camera.position.z = this.camera.position.z + ((this.camZ - this.camera.position.z) / 2)
        this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        this.camera.target.y = 500 * Math.cos(this.phi);
        this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
        this.camera.lookAt(this.camera.target);
    }

    onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    zoomOnObject = (box, offset) => {
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

        this.camera.lookAt(center);
        // update y position of camera to level with the object
        this.camY = center.y;
        // move the camera closer to the object (change x or z to move closer to object)
        // adjust the other axis position to the center of the object
        if (Math.abs(center.x) == Math.max(Math.abs(center.x), Math.abs(center.z))) {
            this.camZ = center.z;
            let maxDim = Math.max(size.y, size.z); //check which dimension you have to fit view to
            if (maxDim === size.y) {
                cameraDist = maxDim / (2 * Math.tan(fov / 2));
                cameraDist += size.x / 2;
                cameraDist *= offset;
            } else { //do the same calculations but with horizontal field of view
                const aspect = this.camera.aspect;
                const hFOV = 2 * Math.atan(Math.tan(this.camera.fov / 2) * aspect);
                cameraDist = maxDim / (2 * Math.tan(hFOV / 2));
                cameraDist += size.x / 2;
                cameraDist *= offset;
            }
            if (center.x > 0) {
                this.camX = center.x - cameraDist;
            } else {
                this.camX = center.x + cameraDist;
            }
        } else { //set x, zoom on z axis
            this.camX = center.x;
            let maxDim = Math.max(size.y, size.x);
            if (maxDim === size.y) {
                cameraDist = maxDim / (2 * Math.tan(fov / 2));
                cameraDist += size.z / 2;
                cameraDist *= offset;
            } else {
                const aspect = this.camera.aspect;
                const hFOV = 2 * Math.atan(Math.tan(this.camera.fov / 2) * aspect);
                cameraDist = maxDim / (2 * Math.tan(hFOV / 2));
                cameraDist += size.z / 2;
                cameraDist *= offset;
            }
            if (center.z > 0) {
                this.camZ = center.z - cameraDist;
            } else {
                this.camZ = center.z + cameraDist;
            }
        }
        this.camera.updateProjectionMatrix();
    }
}

export default Camera
