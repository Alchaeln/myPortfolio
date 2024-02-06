import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Settigng the Scene
const scene = new THREE.Scene();

//first number is distance
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1 , 1000 );

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
})

//render the scene
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera );

//add donut
//first is size
//second number is thickness
//third number is
//last number is how many sides
const geometryTorus = new THREE.TorusGeometry( 13 , 1, 16, 100);
const materialTorus = new THREE.MeshNormalMaterial( { color: 0xFF6347 } );

const torusCount = 7;
const tori = [];

for (let i = 0; i < torusCount; i++) {
  const torus = new THREE.Mesh(geometryTorus, materialTorus);
  scene.add(torus);
  tori.push(torus);
}


//add sphere in donut
const geometrySphere = new THREE.SphereGeometry( 10 );
const materialSphere = new THREE.MeshNormalMaterial( { color: 0xFF6347 } );
const sphere = new THREE.Mesh( geometrySphere, materialSphere );

scene.add(sphere)


//light to point at object like flashlight
//first number is color, second parameter is intensity
const pointLight = new THREE.PointLight(0xFFFFFF, 150);
pointLight.position.set(15,10,5);

//ambient flood light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, .01);
scene.add(pointLight, ambientLight);

//light visualizer
//const lightHelper = new THREE.PointLightHelper(pointLight);
//const gridHelper = new THREE.GridHelper(200,50);
//scene.add(lightHelper, gridHelper);

const controls = new OrbitControls( camera, renderer.domElement );

//Recursive function to animate the page
function animate() {
    requestAnimationFrame( animate );

    tori.forEach((torus, index) => {
        torus.rotation.x += 0.01 + index * 0.003;
        torus.rotation.y += 0.005 + index * 0.005;
        torus.rotation.z += 0.01 + index * 0.005;
      });

      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.005;
      sphere.rotation.z += 0.01;

    controls.update();

    renderer.render( scene, camera);
}

animate();