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
            fridge.add(this.scene.getObjectByName("Fridge_Handle_1"));
            this.controls.hoverable.push(fridge);
            // specify which part of the fridge to zoom in on
            fridge.userData = {toZoom: fridge.children[2]};
            // give the top door information for camera.zoomOnObject
            fridge.children[2].userData = {offsetX: 0.54, offsetZ: 0.52};
            // fridge.children[2].userData = {normal: new THREE.Vector3(0, 0, 0), offset: 50};
            this.controls.clickable.push(fridge);
            model.add(fridge);

            // button links
            var donate = this.scene.getObjectByName("Cube078")
            donate.userData = {link: "https://payment.brown.edu/C20460_ustores/web/product_detail.jsp?PRODUCTID=3823&SINGLESTORE=true"}
            this.controls.hoverable.push(donate);
            this.controls.clickable.push(donate);

            var discord = this.scene.getObjectByName("Cube073")
            discord.userData = {link: "https://discord.com/invite/3beg2cZ"}
            this.controls.hoverable.push(discord);
            this.controls.clickable.push(discord);

            var minecraft = this.scene.getObjectByName("Cube074")
            minecraft.userData = {link: "https://docs.google.com/document/d/1SE-BYPjhGQVgYiQ-w-MMmPsh8x7QXLjFD0DPUK7SyhY/edit"}
            this.controls.hoverable.push(minecraft);
            this.controls.clickable.push(minecraft);

            var form = this.scene.getObjectByName("Cube075")
            form.userData = {link: "https://docs.google.com/forms/d/e/1FAIpQLSfRUbCAt5AFFu7T_KsmI0VSbn2alpN1mc5m0lat9Af85JvJ1w/viewform"}
            this.controls.hoverable.push(form);
            this.controls.clickable.push(form);

            // sponsor links
            var berg = this.scene.getObjectByName("logoBBGblck_Reg")
            berg.userData = {link: "https://bloomberg.com"}
            this.controls.hoverableOnZoom.push(berg);
            this.controls.clickableOnZoom.push(berg);

            var mule = this.scene.getObjectByName("sticker-mule-logo-light-stacked")
            mule.userData = {link: "http://hackp.ac/mlh-stickermule-hackathons"}
            this.controls.hoverableOnZoom.push(mule);
            this.controls.clickableOnZoom.push(mule);

            var fb = this.scene.getObjectByName("FB_Fam_Logo")
            fb.userData = {link: "https://www.facebook.com/"}
            this.controls.hoverableOnZoom.push(fb);
            this.controls.clickableOnZoom.push(fb);

            var thm = this.scene.getObjectByName("THMlogo")
            thm.userData = {link: "https://tryhackme.com"}
            this.controls.hoverableOnZoom.push(thm);
            this.controls.clickableOnZoom.push(thm);

            var google = this.scene.getObjectByName("Google_Cloud_horizontal_grey_text_-_for_light_background_only_0")
            google.userData = {link: "https://cloud.google.com/"}
            this.controls.hoverableOnZoom.push(google);
            this.controls.clickableOnZoom.push(google);

            var cit = this.scene.getObjectByName("Citizens_TM_Horz_RGB_HEX_(1)")
            cit.userData = {link: "https://www.citizensbank.com/HomePage.aspx"}
            this.controls.hoverableOnZoom.push(cit);
            this.controls.clickableOnZoom.push(cit);

            var eye = this.scene.getObjectByName("logo_kinetic_eye")
            eye.userData = {link: "http://kineticeye.io/"}
            this.controls.hoverableOnZoom.push(eye);
            this.controls.clickableOnZoom.push(eye);

            var wolf = this.scene.getObjectByName("Hackathon_Logo_Wolfram_2020_Vector")
            wolf.userData = {link: "https://www.wolfram.com/language/"}
            this.controls.hoverableOnZoom.push(wolf);
            this.controls.clickableOnZoom.push(wolf);

            var on = this.scene.getObjectByName("Onshape")
            on.userData = {link: "https://www.onshape.com/"}
            this.controls.hoverableOnZoom.push(on);
            this.controls.clickableOnZoom.push(on);

            var pan = this.scene.getObjectByName("Pangea_Logo_2020")
            pan.userData = {link: "https://www.about.pangea.app/"}
            this.controls.hoverableOnZoom.push(pan);
            this.controls.clickableOnZoom.push(pan);

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
            ctf.userData = {link: "http://tryhackme.com/jr/hackhome"}
            this.controls.hoverableOnZoom.push(ctf);
            this.controls.clickableOnZoom.push(ctf);

            var proj = this.scene.getObjectByName("Cube071")
            proj.userData = {link: "https://hack-home.devpost.com/"}
            this.controls.hoverableOnZoom.push(proj);
            this.controls.clickableOnZoom.push(proj);

            var data = this.scene.getObjectByName("Cube015")
            data.userData = {link: "https://hack-home.devpost.com/"}
            this.controls.hoverableOnZoom.push(data);
            this.controls.clickableOnZoom.push(data);

            // play links
            var ice1 = this.scene.getObjectByName("Text064")
            ice1.userData = {link: "https://brown.zoom.us/j/99364996618"}
            this.controls.hoverable.push(ice1);
            this.controls.clickable.push(ice1);

            var ice2 = this.scene.getObjectByName("Text065")
            ice2.userData = {link: "https://brown.zoom.us/j/99364996618"}
            this.controls.hoverable.push(ice2);
            this.controls.clickable.push(ice2);

            var ice3 = this.scene.getObjectByName("Text066")
            ice3.userData = {link: "https://brown.zoom.us/j/99364996618"}
            this.controls.hoverable.push(ice3);
            this.controls.clickable.push(ice3);

            var ice4 = this.scene.getObjectByName("Text067")
            ice4.userData = {link: "https://brown.zoom.us/j/99364996618"}
            this.controls.hoverable.push(ice4);
            this.controls.clickable.push(ice4);

            // var kickoff = this.scene.getObjectByName("Text068")
            // kickoff.userData = {link: "http://google.com"}
            // this.controls.hoverable.push(kickoff);
            // this.controls.clickable.push(kickoff);

            var airforce = this.scene.getObjectByName("Text069")
            airforce.userData = {link: "https://brown.zoom.us/j/93153349690"}
            this.controls.hoverable.push(airforce);
            this.controls.clickable.push(airforce);

            var lightcomp = this.scene.getObjectByName("Text070")
            lightcomp.userData = {link: "https://brown.zoom.us/j/92332648228"}
            this.controls.hoverable.push(lightcomp);
            this.controls.clickable.push(lightcomp);

            var cloudhero = this.scene.getObjectByName("Text071")
            cloudhero.userData = {link: "https://www.youtube.com/watch?v=Hgv_CerTBjw"}
            this.controls.hoverable.push(cloudhero);
            this.controls.clickable.push(cloudhero);

            var among1 = this.scene.getObjectByName("Text072")
            among1.userData = {link: "https://brown.zoom.us/j/94661706666"}
            this.controls.hoverable.push(among1);
            this.controls.clickable.push(among1);

            var bobross = this.scene.getObjectByName("Text073")
            bobross.userData = {link: "https://brown.zoom.us/j/92443062135"}
            this.controls.hoverable.push(bobross);
            this.controls.clickable.push(bobross);

            var among2 = this.scene.getObjectByName("Text074")
            among2.userData = {link: "https://brown.zoom.us/j/91421738929"}
            this.controls.hoverable.push(among2);
            this.controls.clickable.push(among2);

            var talent = this.scene.getObjectByName("Text075")
            talent.userData = {link: "https://brown.zoom.us/j/8228456147"}
            this.controls.hoverable.push(talent);
            this.controls.clickable.push(talent);

            var cribs = this.scene.getObjectByName("Text076")
            cribs.userData = {link: "https://brown.zoom.us/j/92345421016"}
            this.controls.hoverable.push(cribs);
            this.controls.clickable.push(cribs);

            // whiteboard with workshops
            var whiteboard = new THREE.Group()
            this.scene.getObjectByName("Cube017").userData = {offsetX: 0.53, offsetZ: 0.5}
            whiteboard.add(this.scene.getObjectByName("Cube017"))
            whiteboard.add(this.scene.getObjectByName("Sticky_Notes001"), this.scene.getObjectByName("Sticky_Notes002"), this.scene.getObjectByName("Sticky_Notes003"))
            whiteboard.add(this.scene.getObjectByName("Sticky_Notes004"), this.scene.getObjectByName("Sticky_Notes005"), this.scene.getObjectByName("Sticky_Notes006"))
            whiteboard.add(this.scene.getObjectByName("Sticky_Notes007"), this.scene.getObjectByName("Sticky_Notes008"), this.scene.getObjectByName("Sticky_Notes009"), this.scene.getObjectByName("Sticky_Notes010"))
            whiteboard.userData = {toZoom: whiteboard.children[0]}
            this.controls.hoverable.push(whiteboard);
            this.controls.clickable.push(whiteboard);
            model.add(whiteboard);

            var git = whiteboard.children[1];
            git.userData = {html: 'frames/git.html'};
            var sql = whiteboard.children[2];
            sql.userData = {html: 'frames/sql.html'};
            var html = whiteboard.children[3];
            html.userData = {html: 'frames/htmlcss.html'};
            var maya = whiteboard.children[4];
            maya.userData = {html: 'frames/maya.html'};
            var py = whiteboard.children[5];
            py.userData = {html: 'frames/flaskpython.html'};
            var asm = whiteboard.children[6];
            asm.userData = {html: 'frames/assembly.html'};
            var sec = whiteboard.children[8];
            sec.userData = {html: 'frames/security.html'};
            var lin = whiteboard.children[9];
            lin.userData = {html: 'frames/linux.html'};
            var graph = whiteboard.children[10];
            graph.userData = {html: 'frames/graphql.html'};
            var react = whiteboard.children[7];
            react.userData = {html: 'frames/reactnative.html'};

            this.controls.hoverableOnZoom.push(...whiteboard.children.slice(1))
            this.controls.clickableOnZoom.push(...whiteboard.children.slice(1))

            var blueno = new THREE.Group()
            blueno.add(this.scene.getObjectByName("Sphere099"), this.scene.getObjectByName("Sphere106"));
            blueno.add(this.scene.getObjectByName("Sphere104"), this.scene.getObjectByName("Sphere103"),this.scene.getObjectByName("Sphere102"));
            blueno.add(this.scene.getObjectByName("Sphere101"), this.scene.getObjectByName("Sphere105"),this.scene.getObjectByName("Sphere108"),this.scene.getObjectByName("Sphere107"));
            blueno.userData = {toZoom: blueno.children[6]}
            blueno.children[6].userData = {offsetX: 0.82, offsetZ: 0.85}
            this.controls.hoverable.push(blueno);
            this.controls.clickable.push(blueno);
            model.add(blueno)
            
            model.matrixAutoUpdate = false;
            model.updateMatrix();
        }, undefined, function (e) {
            console.error(e);
        });
    }
}

export default Loader
