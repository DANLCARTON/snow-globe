import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { conwayStructure } from './conway_structures/index.js'
import { fancySnowflake } from './fancy_snowflakes/index.js'
import { lUrban } from "./l-urban/index.js";
import { voroways, selectedPositions } from "./voroways/index.js";
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
scene.add(new THREE.AmbientLight(0xffffff, .2))
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
const domeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, opacity:.3, transparent: true})
const domeMesh = new THREE.Mesh(dome, domeMaterial)
scene.add(domeMesh)

// CONWAY STRUCTURE - AUTOMATE CELLULAIRE
for (let i = 0; i < 3; i++) {
    const structure = conwayStructure.clone();
    structure.position.x = selectedPositions[i+20][0]-9;
    structure.position.z = selectedPositions[i+20][1]-9;
    structure.position.y += 50

    const distanceToCenter = Math.sqrt(structure.position.x*structure.position.x + structure.position.z*structure.position.z)

    structure.scale.x *= .02
    structure.scale.y *= .02
    structure.scale.z *= .02
    structure.position.y -= 49

    structure.scale.x *= 25 * (1-(distanceToCenter/26))
    structure.scale.y *= 25 * (1-(distanceToCenter/26))
    structure.scale.z *= 25 * (1-(distanceToCenter/26))
    
    structure.position.y += 22 * (1-(distanceToCenter/26))
    
    scene.add(structure)
}

// FANCY SNOWFLAKES - FRACTALES
let snowflakes = []
for (let i = 0; i < 1; i++) { // snowflakes number here
    const snowflake = fancySnowflake.clone()

    const angle = Math.random()* (2*Math.PI)

    snowflake.position.x += Math.cos(angle)*(Math.random()*26)
    snowflake.position.z += Math.sin(angle)*(Math.random()*26)
    snowflake.position.y += Math.random() * Math.sqrt(620 - Math.pow(Math.sqrt(snowflake.position.x*snowflake.position.x + snowflake.position.z*snowflake.position.z), 2));

    snowflake.rotation.x += Math.random() * 100
    snowflake.rotation.z += Math.random() * 100
    snowflake.rotation.y += Math.random() * 100

    snowflake.scale.x = .3
    snowflake.scale.y = .3
    snowflake.scale.z = .3

    snowflakes.push(snowflake)
    scene.add(snowflake)
}

// // L-URBAN - ALGORITHME EN TORTUE
// lUrban.scale.x = lUrban.scale.x/2
// lUrban.scale.z = lUrban.scale.z/2
// lUrban.position.y += .1
// scene.add(lUrban)

// VOROWAYS - DIAGRAMME DE VORONOI
voroways.position.y += .1
scene.add(voroways)

// LIVING BALLS - BIOEVOLUTION et RESEAU DE NEURONES
var spheres = []
// for (let i = 0; i < 50; i++) {
//     spheres.push(generateSphere(Math.random() <= 0.5 ? "M" : "F", Math.random(), Math.random(), Math.random(), scene))
// }


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

    snowflakes.map(sf => {
        sf.position.y -= .02
        sf.rotation.x += Math.random() * .02
        sf.rotation.z += Math.random() * .02
        sf.rotation.y += Math.random() * .02
        if (sf.position.y <= -.2) {
            const angle = Math.random()* (2*Math.PI)
            sf.position.x += Math.cos(angle)*(Math.random()*26)
            sf.position.z += Math.sin(angle)*(Math.random()*26)
            sf.position.y = Math.sqrt(620 - Math.pow(Math.sqrt(sf.position.x*sf.position.x + sf.position.z*sf.position.z), 2));
        }
    })

}

// on applique des règles autant de fois qu'on a défini d'itérations 
animate();