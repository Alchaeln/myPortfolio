import './styles.css';
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import debounce from 'lodash/debounce';

  // Simulate loading completion after a delay (you can remove this in your actual code)
  setTimeout(function () {
    fadeOutLoadingScreen();
  }, 2000); // Adjust the delay as needed

  function fadeOutLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = 0; // Set opacity to 0 for a smooth fade-out effect

    // Remove the loading screen after the fade-out transition is complete
    setTimeout(function () {
      loadingScreen.style.display = 'none';
    }, 1000); // Adjust the delay to match the transition duration
  }

// Introduced Lodash to introduce reloading the page due to the page leaving white space when resizing to a bigger size
const reloadPage = debounce(() => {
  window.location.reload();
}, 300); // Adjust the debounce delay as needed

// Check if the screen width is greater than 768 pixels (adjust this threshold as needed)
if (window.innerWidth > 768) {
  window.addEventListener('resize', () => {
    reloadPage();
  });
}


//Setting the Scene
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

//renders the camera and scene
renderer.render( scene, camera );

//planet textures
const normalTexture = new THREE.TextureLoader().load('./images/normal.jpg');

//moon texture
const moonTexture = new THREE.TextureLoader().load('./images/moon.jpg');

//earth texture
const earthTexture = new THREE.TextureLoader().load('./images/earth.jpg');

//sun texture
const sunTexture = new THREE.TextureLoader().load('./images/sun.jpg');

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

const loader = new GLTFLoader();

// Loads model rocket ship WIP
loader.load('./resources/rocket_ship/scene.gltf', function (gltf) {
  const rocketShip = gltf.scene;

  // Set the scale of the model to make it smaller
  rocketShip.scale.set(0.005, 0.005, 0.005);
  
  // Set position
  rocketShip.position.set(1, -0.5, 10.75);

  // Add the scaled model to the scene
  scene.add(rocketShip);

  const gltfAnimations = gltf.animations;
  const rocketShipMixer = new THREE.AnimationMixer(rocketShip);
  const rocketShipAnimationsMap = new Map();

  gltfAnimations.forEach((a) => {
    rocketShipAnimationsMap.set(a.name, rocketShipMixer.clipAction(a));
  });

}, undefined, function (error) {
  console.error(error);
});

let astronaut;

// Loads model little astronaut WIP
loader.load('./resources/little_astronaut/scene.gltf', function (gltf) {
  astronaut = gltf.scene;

  // Set the scale of the model to make it smaller
  astronaut.scale.set(.115, .115, .115);
  
  // Set position
  astronaut.position.set(-.2, -0.25, 9.75);

  // Add the scaled model to the scene
  scene.add(astronaut);

  const gltfAnimations = gltf.animations;
  const astronautMixer = new THREE.AnimationMixer(astronaut);
  const astronautAnimationsMap = new Map();

  gltfAnimations.forEach((a) => {
    astronautAnimationsMap.set(a.name, astronautMixer.clipAction(a));
  });

}, undefined, function (error) {
  console.error(error);
});

let cosmos;

// Loads model Lot of stars
loader.load('./resources/need_some_space/scene.gltf', function (gltf) {
  cosmos = gltf.scene;

  // Set the scale of the model to make it smaller
  cosmos.scale.set(600, 600, 600);
  
  // Set position
  cosmos.position.set(1000, -650, 9.75);

  // Add the scaled model to the scene
  scene.add(cosmos);

  const gltfAnimations = gltf.animations;
  const cosmosvixer = new THREE.AnimationMixer(cosmos);
  const cosmosAnimationsMap = new Map();

  gltfAnimations.forEach((a) => {
    cosmosAnimationsMap.set(a.name, astronautMixer.clipAction(a));
  });


}, undefined, function (error) {
  console.error(error);
});


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
 //const gridHelper = new THREE.GridHelper(200,50);
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
const spaceTexture = new THREE.TextureLoader().load('./images/space.jpg');
scene.background = spaceTexture;
scene.backgroundIntensity = .02;
scene.backgroundBlurriness = 0;

// Initial camera position
const initialCameraPosition = new THREE.Vector3(0, 0, 10);

// camera motion
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Adjust the camera position based on the scroll with an offset
  camera.position.z = initialCameraPosition.z + t * -0.005;
  camera.position.x = initialCameraPosition.x + t * -0.00025;
  camera.rotation.y = initialCameraPosition.y + t * -0.00025;
}

document.body.onscroll = moveCamera;
moveCamera();

//Recursive function to animate the page
function animate() {
    requestAnimationFrame( animate );

    celestialBodies.forEach(({ body, config }) => {
        rotateCelestialBody(body, config);
      });

    // Rotate the astronaut model
    if (astronaut) {
      astronaut.rotation.y += 0.0005;
    }

    controls.update();

    //console.log('Camera Position:', camera.position);

    renderer.render( scene, camera);
}

animate();

