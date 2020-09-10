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
        console.log(this.camX, this.camY, this.camZ)
    }

    onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

export default Camera
