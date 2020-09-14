import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

import {GLTFLoader} from "https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/DRACOLoader.js';

class Loader {
    constructor(scene, controls) {
        this.manager = new THREE.LoadingManager();
        this.controls = controls;
        this.scene = scene;

        // group the sticky notes all together
        this.stickynote_group1 = new THREE.Group();
        this.stickynote_group1.name = "sticknote_group1";
        this.stickynote_group1.position.set(4, 2.5, 9.75);
        this.stickynote_group1.scale.set(4,4,4);
        this.stickynote_group1.rotateY(THREE.MathUtils.degToRad(30))
        this.stickynote_group1.matrixAutoUpdate = false;
        this.stickynote_group1.updateMatrix();
        this.controls.clickableOnZoom.push(this.stickynote_group1);
        this.controls.hoverable.push(this.stickynote_group1);
        this.scene.add(this.stickynote_group1);

        this.manager.onStart = function (url, itemsLoaded, itemsTotal) {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        
        this.loadModels();
        this.controls.clickableOnZoom.push(...this.controls.clickable.slice());
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
        }, undefined, function (e) {
            console.error(e);
        });

        loader.load('assets/models/bedroom-stickynotes-organized.gltf', (gltf) => {
            var model = gltf.scene;
            var sticky_note = model.children[0]
            sticky_note.position.set(0, 0, 0);
            this.stickynote_group1.add(sticky_note);
            this.controls.clickableOnZoom.push(sticky_note);
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
