import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

import {GLTFLoader} from "https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/DRACOLoader.js';
import {FaceNormalsHelper} from "https://unpkg.com/three@0.119.1/examples/jsm/helpers/FaceNormalsHelper.js";

class Loader {
    constructor(scene, controls) {
        this.manager = new THREE.LoadingManager();
        this.controls = controls;
        this.scene = scene;
        this.quaternion = new THREE.Quaternion();
        this.rotationMatrix = new THREE.Matrix4();
        this.yAxis = new THREE.Vector3( 0, 1, 0 );
        this.normalMatrix = new THREE.Matrix3();
        this.defaultPlaneNormal = new THREE.Vector3(0,0,1);

        this.manager.onStart = function (url, itemsLoaded, itemsTotal) {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };

        this.loadModels();
    }

    // create a rotation matrix from the input degrees
    // param deg: degrees that a hypothetical plane has to be rotated to match the forward face of the model
    //            *NOT ALWAYS THE SAME as the degrees the model is rotated*
    //            *double check angle by adding a plane in when loading the model and rotating until matching the face*
            // ex:
            // var geometry = new THREE.PlaneGeometry(1, 1);
            // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            // var plane = new THREE.Mesh( geometry, material );
            // plane.rotateY(THREE.MathUtils.degToRad(90))
            // model.add(plane)
    // returns the normal vector in world coordinates to be stored in userData (normal vector of the forward face)
    getNormal = (deg) => {
        // encode the rotation in a quarternion
        this.quaternion.setFromAxisAngle(this.yAxis, THREE.MathUtils.degToRad(deg));
        // apply the rotation to the rotation matrix
        this.rotationMatrix.makeRotationFromQuaternion(this.quaternion);
        // get the normal matrix from this new matrix
        var normalMatrix = this.normalMatrix.getNormalMatrix(this.rotationMatrix);
        // apply this normal matrix to the local coordinates of the default plane normal
        return this.defaultPlaneNormal.clone().applyMatrix3(normalMatrix).normalize();
    }

    // TODO: Modularize into individual loadModel functions
    loadModels = () => {
        // consider compressing with draco
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('node_modules/three/examples/js/libs/draco/gltf/');
        var loader = new GLTFLoader(this.manager);
        loader.setDRACOLoader(dracoLoader);
        loader.load('assets/models/room.gltf', (gltf) => {
            var model = gltf.scene;
            model.position.set(0, -4, 0);
            model.scale.set(4, 4, 4);
            model.matrixAutoUpdate = false;
            model.updateMatrix();
            this.scene.add(model);;
        }, undefined, function (e) {
            console.error(e);
        });

        loader.load('assets/models/cubby.glb', (gltf) => {
            var model = gltf.scene;
            model.position.set(10, -2.2, 1);
            model.scale.set(1, 1, 1);
            model.rotateY(THREE.MathUtils.degToRad(180))
            model.matrixAutoUpdate = false;
            model.updateMatrix()
            model.name = "cubby";
            this.controls.clickable.push(model.children[2].children[0]);
            this.controls.hoverable.push(model.children[2]);
            this.scene.add(model);
            model.children[2].children[0].userData = {normal: this.getNormal(90)};
        }, undefined, function (e) {
            console.error(e);
        });

        loader.load('assets/models/bedroom-whiteboard.gltf', (gltf) => {
            var model = gltf.scene;
            model.position.set(2, -4.2, 11.25);
            model.scale.set(4, 4, 4);
            model.rotateY(THREE.MathUtils.degToRad(30))
            model.matrixAutoUpdate = false;
            model.updateMatrix()
            model.name = "whiteboard";
            this.controls.clickable.push(model.children[0]);
            // this.controls.hoverable.push(model);
            this.scene.add(model);
            model.children[0].userData = {normal: this.getNormal(30)};
        }, undefined, function (e) {
            console.error(e);
        });

        loader.load('assets/models/bedroom-stickynotes-organized.gltf', (gltf) => {
            var model = gltf.scene;
            model.position.set(2, -4.2, 11.25);
            model.scale.set(4, 4, 4);
            model.rotateY(THREE.MathUtils.degToRad(30))
            model.matrixAutoUpdate = false;
            model.updateMatrix()
            this.controls.clickableOnZoom.push(model.children[0]);
            this.controls.hoverable.push(model.children[0]);
            model.children[0].userData = {normal: this.getNormal(30)};
            this.scene.add(model);
        }, undefined, function (e) {
            console.error(e);
        });

        // loader.load('assets/models/bedroom-stickynotes-organized.gltf', (gltf) => {
        //     var model = gltf.scene;
        //     // this.controls.clickable.push(model.children[2].children[0]);
        //     // this.controls.hoverable.push(model.children[0]);
        //     var sticky_note = model.children[0]
        //     sticky_note.position.set(0.75, 0, 0);
        //     this.stickynote_group1.add(sticky_note);
        // }, undefined, function (e) {
        //     console.error(e);
        // });
    }
}

export default Loader
