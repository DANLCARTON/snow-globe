import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { conwayStructure } from './conway_structures/index.js'
import { fancySnowflake } from './fancy_snowflakes/index.js'
import { lUrban } from "./l-urban/index.js";
import { moveSpheres, checkCollisions, generateSphere } from "./living-balls/index.js";

// BASIC SETUP

// définition de la scene et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1100000);
camera.position.y = 50
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// lumières
scene.add(new THREE.AmbientLight(0xf4e99b, .2))
const p1 = new THREE.PointLight(0xffffff, 1000)
p1.castShadow = false
p1.position.set(0, 20, 0)
scene.add(p1)
    // définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)









// ACTUAL CODE
// ----------------------------------------------------------------

const ground = new THREE.CylinderGeometry(26, 26, 5, 64)
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const groundMesh = new THREE.Mesh(ground, groundMaterial)
groundMesh.receiveShadow = false;
// groundMesh.rotation.x = -Math.PI / 2
groundMesh.position.y -= 2.5
scene.add(groundMesh)

const dome = new THREE.SphereGeometry(26, 64, Math.round(64 / 4), 0, Math.PI * 2, 0, Math.PI * 0.5)
const domeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, opacity:.5, transparent: true})
const domeMesh = new THREE.Mesh(dome, domeMaterial)
scene.add(domeMesh)

// // CONWAY STRUCTURES
// conwayStructure.position.y += 50
// scene.add(conwayStructure)
// const conwayStructure2 = conwayStructure.clone()
// conwayStructure2.position.x = -50
// conwayStructure2.position.z = -30
// scene.add(conwayStructure2)

// // FANCY SNOWFLAKES
// for (let i = 0; i < 200; i++) {
//     const snowflake = fancySnowflake.clone()
//     snowflake.position.x += (Math.random() * 100) - 50
//     snowflake.position.z += (Math.random() * 100) - 50
//     snowflake.position.y += Math.random() * 60
//     snowflake.rotation.x += Math.random() * 100
//     snowflake.rotation.z += Math.random() * 100
//     snowflake.rotation.y += Math.random() * 100
//     scene.add(snowflake)
// }

// L-URBAN
lUrban.scale.x = lUrban.scale.x/2
lUrban.scale.z = lUrban.scale.z/2
lUrban.position.y += .1
scene.add(lUrban)

// LIVING BALLS
var spheres = []
for (let i = 0; i < 50; i++) {
    spheres.push(generateSphere(Math.random() <= 0.5 ? "M" : "F", Math.random(), Math.random(), Math.random(), scene))
}


// ----------------------------------------------------------------









// HELPERS
scene.add(new THREE.PointLightHelper(p1, 1))
scene.add(new THREE.AxesHelper(1))

// LOOP

function animate() {
    // console.log(spheres)
    requestAnimationFrame(animate);
    controls.update();
    moveSpheres(spheres)
    spheres = checkCollisions(spheres, scene);
    renderer.render(scene, camera);
}

// on applique des règles autant de fois qu'on a défini d'itérations 
animate();