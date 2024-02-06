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
camera.position.setZ(10);
camera.position.setX(0);

renderer.render( scene, camera );

//planet textures
const normalTexture = new THREE.TextureLoader().load('images/normal.jpg');

//moon texture
const moonTexture = new THREE.TextureLoader().load('images/moon.jpg');

//earth texture
const earthTexture = new THREE.TextureLoader().load('images/earth.jpg');

//sun texture
const sunTexture = new THREE.TextureLoader().load('images/sun.jpg');

// Function to create more celestial bodies
function createCelestialBody(geometry, texture, normalMap, position = new THREE.Vector3(), size = 1) {
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        normalMap: normalMap,
    });

    const body = new THREE.Mesh(geometry, material);
    body.position.copy(position);
    body.scale.set(size, size, size);

    scene.add(body);

    return body;
}

// Moon
const moon = createCelestialBody(
    new THREE.SphereGeometry(3, 32, 32),
    moonTexture,
    normalTexture
);

// Sun
const sun = createCelestialBody(
    new THREE.SphereGeometry(5, 50, 50),
    sunTexture,
    normalTexture,
    new THREE.Vector3(10, 10, -10)
);

// Earth (excluding normal map)
const earth = createCelestialBody(
    new THREE.SphereGeometry(4, 50, 50),
    earthTexture,
    null, // Pass null for normalMap to exclude it
    new THREE.Vector3(-20, -10, -2)
);

//light to point at object like flashlight
//first number is color, second parameter is intensity
const pointLight = new THREE.PointLight(0xFFFFFF, 1000);
pointLight.position.set(15,10,5);

const pointLightSun = new THREE.PointLight(0xFFFFFF, 1000);
pointLight.position.set(20,20,-20);

//ambient flood light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.035);
scene.add(pointLight, ambientLight, pointLightSun);

//light visualizer and grid
 //const lightHelper = new THREE.PointLightHelper(pointLightSun);
// const gridHelper = new THREE.GridHelper(200,50);
 //scene.add(lightHelper, gridHelper);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.05, 24, 300);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);
  
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(100));
  
    star.position.set(x, y, z);
    scene.add(star);
  }
  
  Array(200).fill().forEach(addStar);


const controls = new OrbitControls( camera, renderer.domElement );

//function to rotate thhe bodies
function rotateCelestialBody(body, config) {
    body.rotation.x += config.speedX;
    body.rotation.y += config.speedY;
    body.rotation.z += config.speedZ;
  }

  //celestial bodies
  const celestialBodies = [
    { body: moon, config: { speedX: 0.005, speedY: 0.005, speedZ: 0.005 } },
    { body: sun, config: { speedX: 0.0005, speedY: 0.0001, speedZ: 0.0005 } },
    { body: earth, config: { speedX: 0.0005, speedY: 0.0001, speedZ: 0.0005 } },
  ];


//background textures and intensity
const spaceTexture = new THREE.TextureLoader().load('images/space.jpg');
scene.background = spaceTexture;
scene.backgroundIntensity = .02;
scene.backgroundBlurriness = 0;

//Recursive function to animate the page
function animate() {
    requestAnimationFrame( animate );

    celestialBodies.forEach(({ body, config }) => {
        rotateCelestialBody(body, config);
      });

    controls.update();

    renderer.render( scene, camera);
}

animate();