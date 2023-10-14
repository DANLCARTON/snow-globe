import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { conwayStructure } from './conway_structures/index.js'
import { fancySnowflake } from './fancy_snowflakes/index.js'
import { lUrban } from "./l-urban/index.js";

// BASIC SETUP

// définition de la scene et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1100000);
camera.position.y = 5
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// lumières
scene.add(new THREE.AmbientLight(0xf4e99b, .2))
const p1 = new THREE.PointLight(0xffffff, 5000)
p1.castShadow = true
p1.position.set(0, 60, 0)
scene.add(p1)
    // définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)









// ACTUAL CODE
// ----------------------------------------------------------------

const ground = new THREE.PlaneGeometry(100, 100)
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
const groundMesh = new THREE.Mesh(ground, groundMaterial)
groundMesh.receiveShadow = true;
groundMesh.rotation.x = -Math.PI / 2
scene.add(groundMesh)

// CONWAY STRUCTURES
conwayStructure.position.y += 50
scene.add(conwayStructure)
const conwayStructure2 = conwayStructure.clone()
conwayStructure2.position.x = -50
conwayStructure2.position.z = -30
scene.add(conwayStructure2)

// FANCY SNOWFLAKES
for (let i = 0; i < 200; i++) {
    const snowflake = fancySnowflake.clone()
    snowflake.position.x += (Math.random() * 100) - 50
    snowflake.position.z += (Math.random() * 100) - 50
    snowflake.position.y += Math.random() * 60
    snowflake.rotation.x += Math.random() * 100
    snowflake.rotation.z += Math.random() * 100
    snowflake.rotation.y += Math.random() * 100
    scene.add(snowflake)
}

// L-URBAN
lUrban.position.y += .1
scene.add(lUrban)

// ----------------------------------------------------------------









// HELPERS
scene.add(new THREE.PointLightHelper(p1, 1))
scene.add(new THREE.AxesHelper(1))

// LOOP
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// on applique des règles autant de fois qu'on a défini d'itérations 
animate();