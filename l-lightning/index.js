import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';

// BASIC SETUP

// définition de la scene et de la caméra
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1100000);
// camera.position.y = 5
// const renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
// // lumières
// scene.add(new THREE.AmbientLight(0xd2b48c, 5))

let lLightning = new THREE.Mesh()

const light = new THREE.PointLight( 0x00ffff, 10000, 0 );
light.position.set( 0, -30, 0 );
lLightning.add( light );

const pointLightHelper = new THREE.PointLightHelper( light, 1 );
lLightning.add( pointLightHelper );

    // définition des contrôles de la caméra
// const controls = new OrbitControls(camera, renderer.domElement);
// scene.add(camera)

// Senpai, let's make an l-system magic~
const axiom = "F";
let sentence = axiom;
const rules = {
//   "F": "FF[F-F-F][F+F+F][F/F/F][F*F*F]"
//   "F": "F[[-F]F[+F][F]][[/F]F[*F][F]]"
//   "F": "F[+F]F[-F]F" // pas mal celui la
//   "F": "FF+[+F-F-F]-[-F+F+F]*[*F/F/F]/[/F*F*F]"
//   "F": "FF[F-F-F]F[*F/F+F]F"
    "F": "FF[/F*F-F]F[*F/F+F]F" // choix
};

let length = .28;
const generations = 3

// Generer l-system
function generate() {
//   length *= 0.5; // Tu peux ajuster ça pour la longueur de chaque segment
  const nextSentence = sentence.split('').reduce((acc, char) => {
    return acc + (rules[char] || char);
  }, "");

  sentence = nextSentence;
//   console.log(sentence)
//   draw();
}

// Dessiner en 3D, nyaa~
const angle = 30
function draw(axiom) {
    console.log(axiom)
    let geometry = new THREE.BufferGeometry();
    let material = new THREE.LineBasicMaterial({ color: 0xaaffff });

    let vertices = [];
    let stack = [];
    let position = new THREE.Vector3(0, 0, 0);
    let direction = new THREE.Vector3(0, -1, 0);

    for (let i = 0; i < axiom.length; i++) {
        let current = axiom.charAt(i);

        if (current === 'F') {
            vertices.push(position.x, position.y, position.z);
            position.add(direction.clone().multiplyScalar(length));
        } else if (current === '+') {
            direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(angle));
        } else if (current === '-') {
            direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), -THREE.MathUtils.degToRad(angle));
        } else if (current === '*') {
            direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(angle));
        } else if (current === '/') {
            direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), -THREE.MathUtils.degToRad(angle));
        } else if (current === '[') {
            stack.push({ position: position.clone(), direction: direction.clone() });
        } else if (current === ']') {
            let state = stack.pop();
            position.copy(state.position);
            direction.copy(state.direction);
        }
    }

    console.log(vertices)
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    let line = new THREE.Line(geometry, material);
    lLightning.add(line);
}

// Fonction pour faire tourner, desu~!
// function rotate(axis, angle) {
//   const matrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
//   camera.position.applyMatrix4(matrix);
//   camera.up.applyMatrix4(matrix);
// }

// Zoomer et positionner la caméra
// camera.position.z = 30;
// camera.position.y = 5;

// Ajouter un peu de kawaii mouvement
// document.addEventListener("keydown", (event) => {
//   if (event.key === "ArrowUp") camera.position.y += 1;
//   if (event.key === "ArrowDown") camera.position.y -= 1;
//   if (event.key === "ArrowLeft") camera.position.x -= 1;
//   if (event.key === "ArrowRight") camera.position.x += 1;
// });

// Senpai, let's animate this~!
for (let i = 0; i < generations; i++) {
    generate()
}
draw(sentence)

lLightning.add(new THREE.AxesHelper())

// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// //   if (frame <= generations) generate();
// //   frame++
// }

// animate();

lLightning.position.y += 26

export {lLightning}