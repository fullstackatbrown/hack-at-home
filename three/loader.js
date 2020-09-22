import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

import {GLTFLoader} from "https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/DRACOLoader.js';
import {FaceNormalsHelper} from "https://unpkg.com/three@0.119.1/examples/jsm/helpers/FaceNormalsHelper.js";

class Loader {
    constructor(scene, controls) {
        this.manager = new THREE.LoadingManager();
        this.controls = controls;
        this.scene = scene;

        this.manager.onStart = function (url, itemsLoaded, itemsTotal) {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        
        this.loadModels();
    }

    // create a a plane facing the same direction as the model
    // param deg: degrees that the model was rotated 
    // returns the normal vector in world coordinates to be stored in userData
    getNormal = (deg) => {
        var geometry = new THREE.PlaneGeometry(1, 1);
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var plane = new THREE.Mesh( geometry, material );
        plane.rotateY(THREE.MathUtils.degToRad(deg));
        plane.updateMatrixWorld();
        var normalMatrix = new THREE.Matrix3().getNormalMatrix(plane.matrixWorld);
        return plane.geometry.faces[0].normal.clone().applyMatrix3( normalMatrix ).normalize();
    }

    // TODO: Modularize into individual loadModel functions
    loadModels = () => {
        // consider compressing with draco
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('node_modules/three/examples/js/libs/draco/gltf/');
        var loader = new GLTFLoader(this.manager);
        loader.setDRACOLoader(dracoLoader);
        loader.load('assets/models/room.glb', (gltf) => {
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

            // var geometry = new THREE.PlaneGeometry(1, 1);
            // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            // var plane = new THREE.Mesh( geometry, material );
            // plane.rotateY(THREE.MathUtils.degToRad(90))
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
