// L-LIGHTNING - L-SYSTEM
// CRÉATION D'UN ÉCLAIR D'ELECTRICITÉ EN UTILISANT DES FRACTALES

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

let lLightning = new THREE.Mesh() // Création du mesh dans lequel sera stocké l'éclair

// Création de la lumière générée par l'éclair sous la forme d'une lumière ponctuelle
const light = new THREE.PointLight( 0x00ffff, 10000, 0 );
light.position.set( 0, -30, 0 );
lLightning.add( light );

const pointLightHelper = new THREE.PointLightHelper( light, 1 );
lLightning.add( pointLightHelper );

// définition des contrôles de la caméra
// const controls = new OrbitControls(camera, renderer.domElement);
// scene.add(camera)

// Senpai, let's make an l-system magic~
const axiom = "F"; // Axiome de départ pour la génération du L-System
let sentence = axiom;
const rules = {
//   "F": "FF[F-F-F][F+F+F][F/F/F][F*F*F]"
//   "F": "F[[-F]F[+F][F]][[/F]F[*F][F]]"
//   "F": "F[+F]F[-F]F" // pas mal celui la
//   "F": "FF+[+F-F-F]-[-F+F+F]*[*F/F/F]/[/F*F*F]"
//   "F": "FF[F-F-F]F[*F/F+F]F"
    "F": "FF[/F*F-F]F[*F/F+F]F" // Règle qui sera appliquée pour générer l'axiome final
};

let length = .28; // Longeur des segments
const generations = 3 // nombre de fois qu'il faudra appliquer la règle
const angle = 30 // Angle entre chaque segment

function generate() { // Fonction permettant de générer le L-System
  const nextSentence = sentence.split('').reduce((acc, char) => {return acc + (rules[char] || char);}, "");
  sentence = nextSentence;
}

function draw(axiom) {
    // Définition des géométries et des matériaux pour l'éclair
    let geometry = new THREE.BufferGeometry();
    let material = new THREE.LineBasicMaterial({ color: 0xaaffff });

    let vertices = []; // tableau dans lequel sera stocké les vertices composant l'éclair
    let stack = []; // tableau permettant de stocker les positions et les angles de direction au moment de l'opération [
    let position = new THREE.Vector3(0, 0, 0) // point de départ
    let direction = new THREE.Vector3(0, -1, 0); // direction

    for (let i = 0; i < axiom.length; i++) {
        let current = axiom.charAt(i);
        if (current === 'F') { // F
            position.add(direction.clone().multiplyScalar(length)); // on avance
            vertices.push(position.x, position.y, position.z); // et on stocke la nouvelle position dans le tableau de vertices
        } else if (current === '+') { // +
            direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(angle)); // on tourne dans une direction donnée
        } else if (current === '-') {
            direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), -THREE.MathUtils.degToRad(angle));
        } else if (current === '*') {
            direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(angle));
        } else if (current === '/') {
            direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), -THREE.MathUtils.degToRad(angle));
        } else if (current === '[') { // [
            stack.push({ position: position.clone(), direction: direction.clone() }); // on stocke la position actuelle et l'angle dans le stack
        } else if (current === ']') { // ]
            let state = stack.pop();
            position.copy(state.position); // On récupère la position
            direction.copy(state.direction); // Et l'angle depuis le stack
        }
    }

    // console.log(vertices)
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); // on stocke dans la géométrie les vertices créés
    let line = new THREE.Line(geometry, material); // On génère le mesh
    lLightning.add(line); // On l'ajoute
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
// après avoir généré un axiome, on le dessine
draw(sentence)

// lLightning.add(new THREE.AxesHelper())

// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// //   if (frame <= generations) generate();
// //   frame++
// }

// animate();

lLightning.position.y += 26 // On change sa position pour qu'il entre dans la boule à neige

export {lLightning}