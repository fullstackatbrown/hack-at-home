import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

import {GLTFLoader} from "https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/DRACOLoader.js';

class Loader {
    constructor(scene, controls) {
        this.manager = new THREE.LoadingManager();
        this.controls = controls;
        this.scene = scene;
        this.quaternion = new THREE.Quaternion();
        this.rotationMatrix = new THREE.Matrix4();
        this.yAxis = new THREE.Vector3(0, 1, 0);
        this.normalMatrix = new THREE.Matrix3();
        this.defaultPlaneNormal = new THREE.Vector3(0, 0, 1);

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
    loadModels = (array, offset) => {
        // consider compressing with draco
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('node_modules/three/examples/js/libs/draco/gltf/');
        var loader = new GLTFLoader(this.manager);
        loader.setDRACOLoader(dracoLoader);
        loader.load('assets/models/room.gltf?v=1', (gltf) => {
            var model = gltf.scene;
            model.scale.set(4, 4, 4);
            model.position.set(0, 2.45, 0);

            // center room
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);

            // offset room so that it is centered
            model.position.x -= -2.825
            model.position.z -= 1.08

            this.scene.add(model);

            //make the fridge clickable and hoverable
            var fridge = new THREE.Group();
            fridge.add(...model.children.slice(34, 38));
            fridge.add(this.scene.getObjectByName("Text151"), this.scene.getObjectByName("Text152"), this.scene.getObjectByName("Text153"), this.scene.getObjectByName("Plane036"))
            this.controls.hoverable.push(fridge);
            // specify which part of the fridge to zoom in on
            fridge.userData = {toZoom: fridge.children[2]};
            // give the top door information for camera.zoomOnObject
            fridge.children[2].userData = {offsetX: 0.54, offsetZ: 0.52};
            // fridge.children[2].userData = {normal: new THREE.Vector3(0, 0, 0), offset: 50};
            this.controls.clickable.push(fridge);
            model.add(fridge);


            var donate = this.scene.getObjectByName("Cube078")
            donate.userData = {link: "http://stackoverflow.com"}
            this.controls.hoverable.push(donate);
            this.controls.clickable.push(donate);

            var discord = this.scene.getObjectByName("Cube073")
            discord.userData = {link: "http://discord.com"}
            this.controls.hoverable.push(discord);
            this.controls.clickable.push(discord);

            var minecraft = this.scene.getObjectByName("Cube074")
            minecraft.userData = {link: "http://minecraft.com"}
            this.controls.hoverable.push(minecraft);
            this.controls.clickable.push(minecraft);

            var form = this.scene.getObjectByName("Cube075")
            form.userData = {link: "http://google.com"}
            this.controls.hoverable.push(form);
            this.controls.clickable.push(form);

            var sponsors = this.scene.getObjectByName("Cube076")
            sponsors.userData = {offsetX: .35, offsetZ: .35}
            this.controls.hoverable.push(sponsors);
            this.controls.clickable.push(sponsors);

            var sponsors_white = this.scene.getObjectByName("Plane023")
            this.controls.hoverable.push(sponsors_white);
            this.controls.clickable.push(sponsors_white);

            var laptop = this.scene.getObjectByName("Laptop001")
            laptop.userData = {toZoom: laptop.children[0]}
            laptop.children[0].userData = {offsetX: .63, offsetZ: .71, angle:20}
            this.controls.hoverable.push(laptop);
            this.controls.clickable.push(laptop);

            var ctf = this.scene.getObjectByName("Cube072")
            ctf.userData = {link: "http://google.com"}
            this.controls.hoverableOnZoom.push(ctf);
            this.controls.clickableOnZoom.push(ctf);

            var proj = this.scene.getObjectByName("Cube071")
            proj.userData = {link: "http://google.com"}
            this.controls.hoverableOnZoom.push(proj);
            this.controls.clickableOnZoom.push(proj);

            var data = this.scene.getObjectByName("Cube015")
            data.userData = {link: "http://google.com"}
            this.controls.hoverableOnZoom.push(data);
            this.controls.clickableOnZoom.push(data);

            var whiteboard = new THREE.Group()
            this.scene.getObjectByName("Cube017").userData = {offsetX: 0.53, offsetZ: 0.5}
            whiteboard.add(this.scene.getObjectByName("Cube017"))
            whiteboard.add(...model.children.slice(288, 298))
            whiteboard.add(model.children[744])
            whiteboard.userData = {toZoom: whiteboard.children[0]}
            this.controls.hoverable.push(whiteboard);
            this.controls.clickable.push(whiteboard);
            model.add(whiteboard);

            // var git = whiteboard.children[1];
            // git.userData = {html: '/workshops/git.html'};
            // var sql = whiteboard.children[2];
            // sql.userData = {html: '/workshops/sql.html'};
            // var html = whiteboard.children[3];
            // html.userData = {html: '/workshops/htmlcss.html'};
            // var maya = whiteboard.children[4];
            // maya.userData = {html: '/workshops/maya.html'};
            // var python = whiteboard.children[5];
            // python.userData = {html: '/workshops/flaskpython.html'};
            // var asm = whiteboard.children[6];
            // asm.userData = {html: '/workshops/assembly.html'};
            // var react = whiteboard.children[7];
            // react.userData = {html: '/workshops/reactnative.html'};
            // var security = whiteboard.children[8];
            // security.userData = {html: '/workshops/security.html'};
            // var linux = whiteboard.children[9];
            // linux.userData = {html: '/workshops/linux.html'};
            // var graphql = whiteboard.children[11];
            // graphql.userData = {html: '/workshops/graphql.html'};

            // index 4 = html
            console.log(whiteboard.children)
            var git = whiteboard.children[1];
            git.userData = {html: '/workshops/git.html'};
            var sql = whiteboard.children[2];
            sql.userData = {html: '/workshops/sql.html'};
            var maya = whiteboard.children[3];
            maya.userData = {html: '/workshops/maya.html'};
            var py = whiteboard.children[4];
            py.userData = {html: '/workshops/flaskpython.html'};
            var asm = whiteboard.children[5];
            asm.userData = {html: '/workshops/assembly.html'};
            var react = whiteboard.children[6];
            react.userData = {html: '/workshops/reactnative.html'};
            var linux = whiteboard.children[8];
            linux.userData = {html: '/workshops/linux.html'};
            var graphql = whiteboard.children[9];
            graphql.userData = {html: '/workshops/graphql.html'};
            var html = whiteboard.children[10];
            html.userData = {html: '/workshops/htmlcss.html'};
            var sec = whiteboard.children[7];
            sec.userData = {html: '/workshops/security.html'};


            this.controls.hoverableOnZoom.push(...whiteboard.children.slice(1))
            this.controls.clickableOnZoom.push(...whiteboard.children.slice(1))

            model.matrixAutoUpdate = false;
            model.updateMatrix();
        }, undefined, function (e) {
            console.error(e);
        });
        //
        // loader.load('assets/models/cubby.glb', (gltf) => {
        //     var model = gltf.scene;
        //     model.position.set(10, -2.2, 1);
        //     model.scale.set(1, 1, 1);
        //     model.rotateY(THREE.MathUtils.degToRad(180))
        //     model.matrixAutoUpdate = false;
        //     model.updateMatrix()
        //     model.name = "cubby";
        //     this.controls.clickable.push(model.children[2].children[0]);
        //     this.controls.hoverable.push(model.children[2]);
        //     this.scene.add(model);
        //     model.children[2].children[0].userData = {normal: this.getNormal(90)};
        // }, undefined, function (e) {
        //     console.error(e);
        // });

        // loader.load('assets/models/bedroom-whiteboard.gltf', (gltf) => {
        //     var model = gltf.scene;
        //     model.position.set(2, -4.2, 11.25);
        //     model.scale.set(4, 4, 4);
        //     model.rotateY(THREE.MathUtils.degToRad(30))
        //     model.matrixAutoUpdate = false;
        //     model.updateMatrix()
        //     model.name = "whiteboard";
        //     this.controls.clickable.push(model.children[0]);
        //     this.controls.hoverable.push(model);
        //     this.scene.add(model);
        //     model.children[0].userData = {normal: this.getNormal(30)};
        // }, undefined, function (e) {
        //     console.error(e);
        // });

        // loader.load('assets/models/bedroom-stickynotes-organized.gltf', (gltf) => {
        //     var model = gltf.scene;
        //     model.position.set(2, -4.2, 11.25);
        //     model.scale.set(4, 4, 4);
        //     model.rotateY(THREE.MathUtils.degToRad(30))
        //     model.matrixAutoUpdate = false;
        //     model.updateMatrix()
        //     this.controls.clickableOnZoom.push(model.children[0]);
        //     this.controls.hoverableOnZoom.push(model.children[0]);
        //     model.children[0].userData = {normal: this.getNormal(30), html: '/workshops/git.html'};
        //     this.scene.add(model);
        // }, undefined, function (e) {
        //     console.error(e);
        // });

        // loader.load('assets/models/bedroom-stickynotes-organized.gltf', (gltf) => {
        //     var model = gltf.scene;
        //     model.position.set(2, -5.2, 11.25);
        //     model.scale.set(4, 4, 4);
        //     model.rotateY(THREE.MathUtils.degToRad(30))
        //     model.matrixAutoUpdate = false;
        //     model.updateMatrix()
        //     this.controls.clickableOnZoom.push(model.children[0]);
        //     this.controls.hoverableOnZoom.push(model.children[0]);
        //     model.children[0].userData = {normal: this.getNormal(30), html: '/workshops/sql.html'};
        //     this.scene.add(model);
        // }, undefined, function (e) {
        //     console.error(e);
        // });

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
