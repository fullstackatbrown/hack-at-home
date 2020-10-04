import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

class Camera {
    constructor() {
        this.speed = 0.2 // snap speed
        this.lat = 0;
        this.lon = 0;
        this.camX = 0;
        this.camY = 0;
        this.camZ = 0;
        this.phi = 0;
        this.theta = 0;
        this.tiltX = 0;
        this.tiltY = 0;
        this.targetAngle = -1;
        this.currentIndex = 0;
        this.isUserInteracting = false;
        this.camera = new THREE.PerspectiveCamera(22, window.innerWidth / window.innerHeight, 0.1, 100);

        // set camera properties
        this.camera.position.set(0, 0, 0);
        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.camera.layers.enable(1);
    }

    update = () => {
        this.currentIndex = Math.round(this.lon / (360/9))
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.MathUtils.degToRad(90)
        this.theta = THREE.MathUtils.degToRad(this.lon);
        this.phi += this.tiltY/2;
        this.theta += this.tiltX/2;
        this.theta += THREE.MathUtils.degToRad(10)  // Offset so that we look directly at a wall
        if (this.targetAngle === -1) {
            this.lon = this.isUserInteracting ? this.lon : this.lon + ((Math.round(this.lon / (360/9)) * (360/9) - this.lon) * this.speed)
        } else {
            if (this.isUserInteracting) {
                this.targetAngle = -1
            } else {
                this.lon = this.lon + (this.targetAngle - this.lon) * this.speed
            }
        }
        this.camera.position.x = this.camera.position.x + ((this.camX - this.camera.position.x) / 2)
        this.camera.position.y = this.camera.position.y + ((this.camY - this.camera.position.y) / 2)
        this.camera.position.z = this.camera.position.z + ((this.camZ - this.camera.position.z) / 2)
        this.camera.target.x = 500 * (Math.sin(this.phi) * Math.cos(this.theta));
        this.camera.target.y = 500 * Math.cos(this.phi);
        this.camera.target.z = 500 * (Math.sin(this.phi) * Math.sin(this.theta));

        // uncomment to look at the ground
        // this.camera.target.x = 0
        // this.camera.target.y = -1
        // this.camera.target.z = 0

        this.camera.lookAt(this.camera.target);
    }

    onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    zoomOnObject = (box, normal, offset) => {
        let center = new THREE.Vector3();
        let size = new THREE.Vector3();
        let cameraDist;
        let distToTravel;
        let delX;
        let delZ;
        let theta;
        //increase cameraDist so object isn't the entire screen
        offset = offset || 2.5;

        // create bounding box from object and get center and dimensions of object
        let boundingBox = new THREE.Box3();
        boundingBox.setFromObject(box);
        boundingBox.getCenter(center);
        boundingBox.getSize(size);
        let maxDim = Math.max(size.x, size.y, size.z); //check which dimension you have to fit view to
        this.camera.lookAt(center);
        // update y position of camera to level with the object
        this.camY = center.y;
        // console.log(normal);
        theta = Math.atan(center.z/center.x);
        if (maxDim === size.y) {
            cameraDist = maxDim / (2 * Math.tan(this.camera.fov / 2));
        } else { //do the same calculations but with horizontal field of view
            const aspect = this.camera.aspect;
            const hFOV = 2 * Math.atan(Math.tan(this.camera.fov / 2) * aspect);
            cameraDist = maxDim / (2 * Math.tan(hFOV / 2));
        }

        // calculate distance the camera needs to travel to be cameraDist away from object
        distToTravel = Math.hypot(center.x, center.z) - cameraDist;
        // decrease the distance to give buffer space

        //calculate how much of distToTravel is in the x and z
        delZ = Math.abs(Math.sin(theta)) * distToTravel;
        delX = Math.cos(theta) * distToTravel;

        if (center.x > 0) {
            this.camX = delX - Math.abs(normal.x)*offset;
        } else {
            this.camX = -delX + Math.abs(normal.x)*offset;
        }
        if (center.z > 0) {
            this.camZ = delZ - Math.abs(normal.z)*offset;
        } else {
            this.camZ = -delZ + Math.abs(normal.z)*offset;
        }
        this.camera.updateProjectionMatrix();
    }
}

export default Camera
