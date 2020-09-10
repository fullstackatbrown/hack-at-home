import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

import {GLTFLoader} from "https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/DRACOLoader.js';

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

    // TODO: Modularize into individual loadModel functions
    loadModels = () => {
        // consider compressing with draco
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('node_modules/three/examples/js/libs/draco/gltf/');
        var loader = new GLTFLoader(this.manager);
        loader.setDRACOLoader(dracoLoader);
        loader.load('assets/models/room.glb', (gltf) => {
            console.log(gltf.scene)
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
            // let zoomable = model.children[2].children[0].clone();
            // zoomable.position.set(10, -2.2, 1);
            // zoomable.rotateY(THREE.MathUtils.degToRad(180));
            // zoomable.scale.set(0.5,0.5,0.5)
            // var box = new THREE.BoxHelper();
            // box.setFromObject(zoomable);
            // clickable.push(box);
            this.controls.clickable.push(model.children[2].children[0]);
            this.controls.hoverable.push(model.children[2]);
            this.scene.add(model);
            // scene.add(box);
            // scene.add(zoomable);
        }, undefined, function (e) {
            console.error(e);
        });
    }
}

export default Loader
