import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import Camera from './camera.js?v=1';
import Controls from './controls.js?v=1';
import Loader from './loader.js?v=1';

import {CSS3DRenderer, CSS3DObject} from 'https://unpkg.com/three@0.119.1/examples/jsm/renderers/CSS3DRenderer.js';
import {EffectComposer} from 'https://unpkg.com/three@0.119.1/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://unpkg.com/three@0.119.1/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'https://unpkg.com/three@0.119.1/examples/jsm/postprocessing/ShaderPass.js';

var container = document.body;

var iframe;

var renderer = new THREE.WebGLRenderer({antialias: true});
// resolution
renderer.setPixelRatio(window.devicePixelRatio * (9 / 10));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xffffff, 1);
container.appendChild(renderer.domElement);

var renderercss = new CSS3DRenderer();
renderercss.setSize(window.innerWidth, window.innerHeight);
renderercss.domElement.style.position = 'absolute';
renderercss.domElement.style.top = '0px';
renderercss.domElement.style.zIndex = '10000';
container.appendChild(renderercss.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new Camera();
function getDistortionShaderDefinition()
{
    return {

        uniforms: {
            "tDiffuse":         { type: "t", value: null },
            "strength":         { type: "f", value: 0 },
            "height":           { type: "f", value: 1 },
            "aspectRatio":      { type: "f", value: 1 },
            "cylindricalRatio": { type: "f", value: 1 }
        },

        vertexShader: [
            "uniform float strength;",          // s: 0 = perspective, 1 = stereographic
            "uniform float height;",            // h: tan(verticalFOVInRadians / 2)
            "uniform float aspectRatio;",       // a: screenWidth / screenHeight
            "uniform float cylindricalRatio;",  // c: cylindrical distortion ratio. 1 = spherical

            "varying vec3 vUV;",                // output to interpolate over screen
            "varying vec2 vUVDot;",             // output to interpolate over screen

            "void main() {",
            "gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));",

            "float scaledHeight = strength * height;",
            "float cylAspectRatio = aspectRatio * cylindricalRatio;",
            "float aspectDiagSq = aspectRatio * aspectRatio + 1.0;",
            "float diagSq = scaledHeight * scaledHeight * aspectDiagSq;",
            "vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));",

            "float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;",
            "float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);",

            "vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;",
            "vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);",
            "vUV.xy += uv;",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform sampler2D tDiffuse;",      // sampler of rendered scene?s render target
            "varying vec3 vUV;",                // interpolated vertex output data
            "varying vec2 vUVDot;",             // interpolated vertex output data

            "void main() {",
            "vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;",
            "gl_FragColor = texture2DProj(tDiffuse, uv);",
            "}"
        ].join("\n")

    };
}
// Fish-eye
// // Create effect composer
// let composer = new EffectComposer( renderer );
// composer.addPass( new RenderPass( scene, camera.camera ) );
//
// // Add distortion effect to effect composer
// var effect = new ShaderPass( getDistortionShaderDefinition() );
// composer.addPass( effect );
// effect.renderToScreen = true;
//
// // Setup distortion effect
// var horizontalFOV = 140;
// var strength = 0.5;
// var cylindricalRatio = 2;
// var height = Math.tan(THREE.Math.degToRad(horizontalFOV) / 2) / camera.camera.aspect;
//
// camera.camera.fov = Math.atan(height) * 0.5 * 180 / 3.1415926535;
// camera.camera.updateProjectionMatrix();
//
// effect.uniforms[ "strength" ].value = strength;
// effect.uniforms[ "height" ].value = height;
// effect.uniforms[ "aspectRatio" ].value = camera.camera.aspect;
// effect.uniforms[ "cylindricalRatio" ].value = cylindricalRatio;

// Shadow light
var light = new THREE.HemisphereLight(0xffffff, 0x8f8f8f, 1.0);
light.position.set(0, 3, 0);
scene.add(light);

// Ambient light
var light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);

var Stream = function (x, y, z, ry) {
    var div = document.createElement('div');
    div.style.backgroundColor = '#000';
    iframe = document.createElement('iframe');
    iframe.style.width = '586px';
    iframe.style.height = '320px';
    iframe.style.border = '0px';
    iframe.id = 'stream'
    // iframe.style.pointerEvents = 'none';
    iframe.src = 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhackingathome%2Fvideos%2F1094526801003303%2F&show_text=0&width=1280';
    div.appendChild(iframe);
    var object = new CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;
    return object;
};

// TODO: bind horizontal scroll to room change

var stream = new Stream(-3095, -420, 3700, (7 * (Math.PI / 9)))
scene.add(stream);

// var html = [
//     '<div style="width:' + 1100 + 'px; height:' + 900 + 'px;">',
//     '<iframe src="' + '/workshops/htmlcss.html' + '" width="' + 1100 + '" height="' + 900 + '"style="border-width:0px;">',
//     '</iframe>',
//     '</div>'
//   ].join('\n');

// var div = document.createElement('div');

//   $(div).html(html);
//   $(div).css("background-color","white");

// var cssObject = new CSS3DObject(div);

// cssObject.name = "wkshop";
// cssObject.position.set(-5595,-320,-2700);
// cssObject.rotation.y = (3 * (Math.PI / 9));

// scene.add(cssObject);

// Test sphere
// var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
// var sphere = new THREE.Mesh( geometry, material );
// sphere.position.set(-19.794935691667966, -6.325510698485902, -34.6286650156092)
// scene.add(sphere)

const controls = new Controls(camera, scene, iframe);
const loader = new Loader(scene, controls)
loader.manager.onLoad = function () {
    console.log('Loading complete!');
    update();
    $(".spinner").animate({opacity: 0}, 500, () => {
        $(".clouds__right").removeClass("clouds__right_active")
        $(".clouds__left").removeClass("clouds__left_active")
        $("#arrow-left").removeClass("arrow__hidden")
        $("#arrow-right").removeClass("arrow__hidden")
        $(".return").removeClass("arrow__hidden")
    })
};

function animate() {
    requestAnimationFrame(animate);
    camera.update()
    // POWER SAVE
    if (controls.shouldAnimate) {
        update();
    }
}

function update() {
    renderer.render(scene, camera.camera);
    renderercss.render(scene, camera.camera);
}

function onWindowResize() {
    camera.onResize()
    renderercss.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // if we are not animating frames, update manually
    if (!controls.shouldAnimate) {
        update();
    }
}

window.addEventListener('resize', onWindowResize, false);

animate()

// Animate spinner in
$(".spinner").animate({opacity: 1}, 500)
