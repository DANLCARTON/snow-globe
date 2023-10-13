import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import axioms from "./axioms.js"; // importation des axiomes déjà faits
import { FRules, plusRules, minusRules, timesRules, divRules } from "./rules.js" // importation des réègles déjà faites

// récupération des paramètres de la simulation dans l'URL
const urlParams = new URLSearchParams(window.location.search)
let URL_AXIOM = urlParams.get("axiom")
let URL_TYPED_AXIOM = urlParams.get("typed-axiom")
let URL_F_RULE = urlParams.get("f-rule")
let URL_TYPED_F_RULE = urlParams.get("typed-f-rule")
let URL_PLUS_RULE = urlParams.get("plus-rule")
let URL_TYPED_PLUS_RULE = urlParams.get("typed-plus-rule")
let URL_MINUS_RULE = urlParams.get("minus-rule")
let URL_TYPED_MINUS_RULE = urlParams.get("typed-minus-rule")
let URL_TIMES_RULE = urlParams.get("times-rule")
let URL_TYPED_TIMES_RULE = urlParams.get("typed-times-rule")
let URL_DIV_RULE = urlParams.get("div-rule")
let URL_TYPED_DIV_RULE = urlParams.get("typed-div-rule")
let URL_ITER = urlParams.get("iter")
let URL_ANIM = urlParams.get("anim")

// Fonction pour DRAW les plans qui forment la route
// draw() et drawAllPlanes() sont très silimilaires, l'une sert pour quand l'animation est activée et l'autre dessine tout d'un coup
const planeGeometry = new THREE.PlaneGeometry(1, 1) // on définir une géométrie qui servira partout
let currentPlane = 1; // Étape 1 : Initialiser la variable pour suivre le plan actuel
const draw = () => {
    if (currentPlane >= points.length) {
        return; // Si tous les plans ont été dessinés, sortir de la fonction
    }

    const plane = new THREE.Mesh(planeGeometry, material) // on definit le mesh à tracer
        // calcul des angles pour orienter les plans correctement
    const dx = points[currentPlane].x - points[currentPlane - 1].x
    const dz = points[currentPlane].z - points[currentPlane - 1].z
    const dy = points[currentPlane].y - points[currentPlane - 1].y // (on calcule aussi sur y même si c'est tout le temps à 0. On voulait intégrer un heightMap et faire du relief mais ça s'est pas fait :/)
    const distance = Math.sqrt(dx * dx + dz * dz)
    const angleZ = Math.atan2(dz, dx)
    const angleY = Math.atan2(dy, dy)
        // définition de la position de la rotation du plan à draw
    plane.scale.set(distance, 1, 1)
    plane.position.set((points[currentPlane].x + points[currentPlane - 1].x) / 2, (points[currentPlane].y + points[currentPlane - 1].y) / 2, (points[currentPlane].z + points[currentPlane - 1].z) / 2)
    plane.rotation.z = angleZ
    plane.rotation.y = angleY
    plane.rotation.x = Math.PI / 2
    scene.add(plane) // et on ajoute le plan dans la scène

    currentPlane++; // Passer au plan suivant
    requestAnimationFrame(draw); // Prochaine frame, on refait la même chose pour la route suivante
}

const drawAllPlanes = () => {
    for (let i = 1; i < points.length; i++) {
        const plane = new THREE.Mesh(planeGeometry, material);
        const dx = points[i].x - points[i - 1].x;
        const dz = points[i].z - points[i - 1].z;
        const dy = points[i].y - points[i - 1].y;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const angleZ = Math.atan2(dz, dx);
        const angleY = Math.atan2(dy, dy);
        plane.scale.set(distance, 1, 1);
        plane.position.set((points[i].x + points[i - 1].x) / 2, (points[i].y + points[i - 1].y) / 2, (points[i].z + points[i - 1].z) / 2);
        plane.rotation.z = angleZ;
        plane.rotation.y = angleY;
        plane.rotation.x = Math.PI / 2;
        scene.add(plane);
    }
}

// importation et paramétrage de la texture de route
const texture = new THREE.TextureLoader().load("./texture2.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.rotation = Math.PI / 2
texture.repeat.set(1, 5);

// définition d'une fonction modulo gérant les nombres négatifs (ex. (-2).mod(8) = 6)
Number.prototype.mod = function(n) {
    "use strict";
    return ((this % n) + n) % n;
};

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
scene.add(new THREE.AmbientLight(0xd2b48c, 5))

const point = new THREE.PointLight(0xff8888, 12)
point.position.set(0, 2, 0)
point.castShadow = true
camera.add(point)

const point2 = new THREE.PointLight(0x88ff88, 12)
point2.position.set(0, -2, 0)
point2.castShadow = true
camera.add(point2)

const point3 = new THREE.PointLight(0x8888ff, 12)
point3.position.set(2, 0, 0)
point3.castShadow = true
camera.add(point3)

const point4 = new THREE.PointLight(0xffff88, 12)
point4.position.set(-2, 0, 0)
point4.castShadow = true
camera.add(point4)

// définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)


const material = new THREE.MeshBasicMaterial({ side: THREE.BackSide, map: texture });
let x = 0; // coordonnées de départ
let z = 0;
let dir = 0; // direction de départ
let angles = [ // toutes les directions possibles
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(5, 0, 5),
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(-5, 0, 5),
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(-5, 0, -5),
    new THREE.Vector3(0, 0, -5),
    new THREE.Vector3(5, 0, -5)
]

let axiomArray, selectedPatternF, selectedPatternPlus, selectedPatternMinus, selectedPatternTimes, selectedPatternDiv

// définition des axioms et des règles à utiliser en fonction des paramètres dans l'url. si une règle a été tapée, on ne prends pas en compte celle choisie 
URL_TYPED_AXIOM !== "" ? (axiomArray = [...URL_TYPED_AXIOM]) : (axiomArray = [...axioms[URL_AXIOM]])
URL_TYPED_F_RULE !== "" ? (selectedPatternF = [...URL_TYPED_F_RULE]) : (selectedPatternF = [...FRules[URL_F_RULE]])
URL_TYPED_PLUS_RULE !== "" ? (selectedPatternPlus = [...URL_TYPED_PLUS_RULE]) : (selectedPatternPlus = [...plusRules[URL_PLUS_RULE]])
URL_TYPED_MINUS_RULE !== "" ? (selectedPatternMinus = [...URL_TYPED_MINUS_RULE]) : (selectedPatternMinus = [...minusRules[URL_MINUS_RULE]])
URL_TYPED_TIMES_RULE !== "" ? (selectedPatternTimes = [...URL_TYPED_TIMES_RULE]) : (selectedPatternTimes = [...timesRules[URL_TIMES_RULE]])
URL_TYPED_DIV_RULE !== "" ? (selectedPatternDiv = [...URL_TYPED_DIV_RULE]) : (selectedPatternDiv = [...divRules[URL_DIV_RULE]])

console.log("length", axiomArray.length)
console.log("axiomArray", axiomArray)
console.log("selectedPatternF", selectedPatternF)
console.log("selectedPatternPlus", selectedPatternPlus)
console.log("selectedPatternMinus", selectedPatternMinus)
console.log("selectedPatternTimes", selectedPatternTimes)
console.log("selectedPatternDiv", selectedPatternDiv)

const applyRules = (axiomArray) => { // on applique les règles a utiliser pour chaque "lettre" de l'axiome
    let i = 0;
    while (axiomArray[i] != undefined) {
        if (axiomArray[i] == "F") { // pour F
            selectedPatternF.map((letter) => {
                axiomArray.splice(i + 1, 0, letter)
            })
            i += selectedPatternF.length + 1
        } else if (axiomArray[i] == "+") { // pour +
            selectedPatternPlus.map((letter) => {
                axiomArray.splice(i + 1, 0, letter)
            })
            i += selectedPatternPlus.length + 1
        } else if (axiomArray[i] == "-") { // pour -
            selectedPatternMinus.map((letter) => {
                axiomArray.splice(i + 1, 0, letter)
            })
            i += selectedPatternMinus.length + 1
        } else if (axiomArray[i] == '*') { // pour *
            selectedPatternTimes.map((letter) => {
                axiomArray.splice(i + 1, 0, letter)
            })
            i += selectedPatternTimes.length + 1
        } else if (axiomArray[i] == "/") { // pour /
            selectedPatternDiv.map((letter) => {
                axiomArray.splice(i + 1, 0, letter)
            })
            i += selectedPatternDiv.length + 1
        } else {
            i += 1
        }
    }
    return axiomArray
}

// boucle de rendu
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// on applique des règles autant de fois qu'on a défini d'itérations 
const iter = URL_ITER;
for (let i = 0; i <= iter - 1; i++) {
    axiomArray = applyRules(axiomArray); // 
}

var points = []; // tableau contenant les points à relier avec les plans
points.push(new THREE.Vector3(x, 0, z)); // point de départ
var savedPos = new THREE.Vector3(0, 0, 0); // dernièer position sauvegardée (pour les [ et ])
var savedDir = dir; // dernière direction sauvegardée
var p = 0; // index du dernier point placé
var y = 0; // hauteur sur l'axe y reste tout le temps à 0

axiomArray.map((letter) => {
    var currentAngle = angles[dir]
    if (letter == "F") {
        x += currentAngle.x; // avance
        z += currentAngle.z;
        p += 1 // on passe au point suivant
        points.push(new THREE.Vector3(x, y, z)); // on ajoute le point à la liste des points
    } else if (letter == "+") {
        dir = (dir + 1).mod(8) // on passe à la direction suivante dans le tableau de direction.
        currentAngle = angles[dir];
    } else if (letter == "*") {
        dir = (dir + 2).mod(8) // on avance de deux directions suivantes dans le tableau de direction.
        currentAngle = angles[dir];
    } else if (letter == "-") {
        dir = (dir - 1).mod(8) // on passe à la direction précédante dans le tableau de direction. 
        currentAngle = angles[dir];
    } else if (letter == "/") {
        dir = (dir - 2).mod(8) // on recule de deux directions dans la teableau de directions. 
        currentAngle = angles[dir];
    } else if (letter == "[") {
        console.log("[", "points", points, "points p", points[p])
        savedPos = points[p] // on sauvegarde la poisition
        savedDir = dir
    } else if (letter == "]") {
        console.log("]", "saved pos", savedPos, "points", points)
        drawAllPlanes()
        x = savedPos.x // on récupère la dernière position sauvegardée
        z = savedPos.z
        dir = savedDir
        points = []
        p = 0
        points.push(new THREE.Vector3(x, y, z))
    }
})
console.log(points)
URL_ANIM == "on" ? draw() : drawAllPlanes() // on choisit quelle fonction de draw on utilise en fonction du paramètre rentré pour l'animation.

animate();