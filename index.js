import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { conwayStructure1, conwayStructure2 } from './conway_structures/index.js'
import { fancySnowflake } from './fancy_snowflakes/index.js'
import { lUrban } from "./l-urban/index.js";
import { voroways, selectedPositions } from "./voroways/index.js";
import { moveSpheres, checkCollisions, generateSphere, death } from "./living-balls/index.js";
import { lLightning } from "./l-lightning/index.js";

// PARAMETERS
const nbBalls = 50
const nbSnowFlakes = 200

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
scene.add(p1);
// définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)

const conwayStructure = [conwayStructure1, conwayStructure2]

// ACTUAL CODE
// ----------------------------------------------------------------

// SOCLE
const base = new THREE.CylinderGeometry(26, 20, 5, 64)
const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const baseMesh = new THREE.Mesh(base, baseMaterial)
baseMesh.receiveShadow = false;
baseMesh.position.y -= 2.5
scene.add(baseMesh)

// SOL
const groundTexture = new THREE.TextureLoader().load("./assets/snowy-grass.jpg")
groundTexture.wrapS = THREE.RepeatWrapping
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(13, 13)

const skyTexture = new THREE.TextureLoader().load("./assets/bg")
skyTexture.wrapS = THREE.RepeatWrapping
skyTexture.wrapT = THREE.RepeatWrapping;
skyTexture.repeat.set(1, 1)

const ground = new THREE.CircleGeometry(26, 64)
const groundMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, map: groundTexture })
const groundMesh = new THREE.Mesh(ground, groundMaterial)
groundMesh.receiveShadow = false;
groundMesh.rotation.x = -Math.PI / 2
groundMesh.position.y += 0.01
scene.add(groundMesh)

// const sky = new THREE.SphereGeometry(100000, 64)
// const skyMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide, map: skyTexture })
// const skyMesh = new THREE.Mesh(sky, skyMaterial)
// scene.add(skyMesh)

// // CONWAY STRUCTURE - AUTOMATE CELLULAIRE
let structuresCollisions = []
for (let i = 0; i <= 2; i++) {
    //     console.log(selectedPositions)
    const structure = conwayStructure[i % 2].clone();
    structuresCollisions.push(structure)
    structure.position.x = selectedPositions[Math.floor(Math.random() * selectedPositions.length)][0]; // -9 parce que les structures ne sont pas centrées.
    structure.position.z = selectedPositions[Math.floor(Math.random() * selectedPositions.length)][1]; // -9 parce que les structures ne sont pas centrées.
    structure.rotation.y = Math.random() * 2 * Math.PI

    //     console.log(structure.position.x, structure.position.z)

    structure.position.y += 50

    const distanceToCenter = Math.sqrt(structure.position.x * structure.position.x + structure.position.z * structure.position.z)

    structure.scale.x *= .02
    structure.scale.y *= .02
    structure.scale.z *= .02
    structure.position.y -= 49

    structure.scale.x *= 25 * (1 - (distanceToCenter / 26))
    structure.scale.y *= 25 * (1 - (distanceToCenter / 26))
    structure.scale.z *= 25 * (1 - (distanceToCenter / 26))

    structure.position.y += 22 * (1 - (distanceToCenter / 26))

    scene.add(structure)
}

// FANCY SNOWFLAKES - FRACTALES
let snowflakes = []
for (let i = 0; i < nbSnowFlakes; i++) { // snowflakes number here
    const snowflake = fancySnowflake.clone()

    const angle = Math.random() * (2 * Math.PI)

    snowflake.position.x += Math.cos(angle) * (Math.random() * 26)
    snowflake.position.z += Math.sin(angle) * (Math.random() * 26)
    snowflake.position.y += Math.random() * Math.sqrt(620 - Math.pow(Math.sqrt(snowflake.position.x * snowflake.position.x + snowflake.position.z * snowflake.position.z), 2));

    snowflake.rotation.x += Math.random() * 100
    snowflake.rotation.z += Math.random() * 100
    snowflake.rotation.y += Math.random() * 100

    snowflake.scale.x = .3
    snowflake.scale.y = .3
    snowflake.scale.z = .3

    snowflakes.push(snowflake)
    scene.add(snowflake)
}

// VOROWAYS - DIAGRAMME DE VORONOI
voroways.position.y += .1
scene.add(voroways)

// LIVING BALLS - BIOEVOLUTION et RESEAU DE NEURONES et NEUROEVOLUTION
var spheres = []
for (let i = 0; i < nbBalls; i++) spheres.push(generateSphere(Math.random() <= 0.5 ? "M" : "F", Math.random(), Math.random(), Math.random(), scene))

// METEO - CHAINE DE MARKOV
// FONCTIONS PERMETTANT DE FAIRE UNE METEO CHANGEANTE GRACE A UNE CHAINE DE MARKOV

let state = 1 // état de départ
let firstStateDone = false

function SunState() { // Fonction permettant de changer d'état
    scene.add(cube1) // on change le ciel qui doit s'afficher
    const rand = Math.random() // On tire un nombre aléatoire
    console.log(`SunState probability : ${rand}`)
    if (rand < 0.75) state = 1 // On tire aléatoirement un nouvel état parmi ceux possibles
    else state = 2 // ici 1 ou 2
    if (!firstStateDone) cube1.material.opacity = 1 
    firstStateDone = true
}

function GrayCloudState() { // 2
    scene.add(cube2)
    const rand = Math.random()
    console.log(`GrayCloudState probability : ${rand}`)
    if (rand < 0.1) state = 1
    else if (rand >= 0.1 && rand < 0.45) state = 2
    else if (rand >= 0.45 && rand < 0.8) state = 3
    else state = 4
    if (!firstStateDone) cube2.material.opacity = 1
    firstStateDone = true
}

function SnowState() { // 3
    scene.add(cube2)
    const rand = Math.random()
    console.log(`SnowState probability : ${rand}`)
    if (rand < 0.1) state = 2
    else state = 3
    if (!firstStateDone) cube2.material.opacity = 1
    firstStateDone = true
}

function BlackCloudState() { // 4
    scene.add(cube3)
    const rand = Math.random()
    console.log(`BlackCloudState probability : ${rand}`)
    if (rand < 0.2) state = 2
    else if (rand >= 0.2 && rand < 0.55) state = 4
    else if (rand >= 0.55 && rand < 0.9) state = 5
    else state = 6
    if (!firstStateDone) cube3.material.opacity = 1
    firstStateDone = true
}

function RainState() { // 5
    scene.add(cube3)
    const rand = Math.random()
    console.log(`RainState probability : ${rand}`)
    if (rand < 0.1) state = 4
    else if (rand >= 0.1 && rand < 0.9) state = 5
    else state = 7
    if (!firstStateDone) cube3.material.opacity = 1
    firstStateDone = true
}

function LightningCloudState() { // 6
    scene.add(cube3)
    const rand = Math.random()
    console.log(`LightningCloudState probability : ${rand}`)
    if (rand < 0.8) state = 4
    else state = 6
    if (!firstStateDone) cube3.material.opacity = 1
    firstStateDone = true
}

function LightningRainState() { // 7
    scene.add(cube3)
    const rand = Math.random()
    console.log(`LightningRainState probability : ${rand}`)
    if (rand < 0.8) state = 5
    else state = 7
    if (!firstStateDone) cube3.material.opacity = 1
    firstStateDone = true
}

function StateStart() {
    const rand = Math.random()
    console.log(`StateStart probability : ${rand}`)
    if (rand < 0.2) state = 1
    else if (rand >= 0.2 && rand < 0.4) state = 2
    else if (rand >= 0.4 && rand < 0.6) state = 3
    else if (rand >= 0.6 && rand < 0.8) state = 4
    else state = 5
        // state = 2
}

let currentCube // Variable permettant garder de coté le ciel affiché indépendament de l'état
// let currentOpacity = 1
let previousState = null; // Variable permettant de stocker l'état précédent au moment de changer

function changeState(currentState) { // Fonction permettant de changer d'état

    console.log("from climat" + state)

    if (currentState === previousState) {
        // Changement d'état
        if (currentState == 1) {
            SunState()
        } else if (currentState == 2) {
            GrayCloudState()
        } else if (currentState == 3) {
            SnowState()
        } else if (currentState == 4) {
            BlackCloudState()
        } else if (currentState == 5) {
            RainState()
        } else if (currentState == 6) {
            LightningCloudState()
        } else if (currentState == 7) {
            LightningRainState()
        }
    }

    // Vérifie si l'état actuel est différent de l'état précédent
    if (currentState !== previousState) {

        // Changement d'état
        if (currentState == 1) {
            SunState()
        } else if (currentState == 2) {
            GrayCloudState()
        } else if (currentState == 3) {
            SnowState()
        } else if (currentState == 4) {
            BlackCloudState()
        } else if (currentState == 5) {
            RainState()
        } else if (currentState == 6) {
            LightningCloudState()
        } else if (currentState == 7) {
            LightningRainState()
        }

        let cubeChanged = false
        let previousCube

        // Changement de Cube
        if (currentState == 1) {
            previousCube = currentCube
            currentCube = cube1;
            cubeChanged = true
        } else if (currentState == 2 || currentState == 3) {
            previousCube = currentCube
            currentCube = cube2;
            cubeChanged = true
        } else if (currentState >= 4 && currentState <= 7) {
            previousCube = currentCube
            currentCube = cube3;
            cubeChanged = true
        }

        previousState = currentState;

        if (cubeChanged) return { previous: previousCube, current: currentCube }

    }

    console.log("to climat" + state)
}

// Simulation pour la météo
StateStart()

// textures
const blue_sky = new THREE.TextureLoader().load("./assets/ciel_bleu_360")
blue_sky.wrapS = THREE.RepeatWrapping;
blue_sky.wrapT = THREE.RepeatWrapping;
blue_sky.repeat.set(1, 1)

const gray_cloud = new THREE.TextureLoader().load("./assets/ciel_gris_360")
gray_cloud.wrapS = THREE.RepeatWrapping;
gray_cloud.wrapT = THREE.RepeatWrapping;
gray_cloud.repeat.set(1, 1)

const black_cloud = new THREE.TextureLoader().load("./assets/ciel_noir_360")
black_cloud.wrapS = THREE.RepeatWrapping;
black_cloud.wrapT = THREE.RepeatWrapping;
black_cloud.repeat.set(1, 1)

// mesh et matériau pour le ciel 1
const geometry1 = new THREE.SphereGeometry(26, 64, Math.round(64 / 4), 0, Math.PI * 2, 0, Math.PI * 0.5)
const material1 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: blue_sky, side: THREE.BackSide, opacity: 0, transparent: true });
const cube1 = new THREE.Mesh(geometry1, material1);


// mesh et matériau pour le ciel 2
const geometry2 = new THREE.SphereGeometry(26, 64, Math.round(64 / 4), 0, Math.PI * 2, 0, Math.PI * 0.5)
const material2 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: gray_cloud, side: THREE.BackSide, opacity: 0, transparent: true });
const cube2 = new THREE.Mesh(geometry2, material2);

// mesh et matériau pour le ciel 3
const geometry3 = new THREE.SphereGeometry(26, 64, Math.round(64 / 4), 0, Math.PI * 2, 0, Math.PI * 0.5)
const material3 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: black_cloud, side: THREE.BackSide, opacity: 0, transparent: true });
const cube3 = new THREE.Mesh(geometry3, material3);

// mesh et matériau pour les gouttes de pluie
const geometry4 = new THREE.CylinderGeometry(.1, .1, 3, 3)
const material4 = new THREE.MeshBasicMaterial({ color: 0xffffff });
const rain = new THREE.Mesh(geometry4, material4);

// Mesh vide pour quand il n'y ni pluie ni neige (que le temps est clair), cela permet de garder une continuité
const geometry5 = new THREE.BoxGeometry(0, 0, 0)
const material5 = new THREE.MeshPhongMaterial({ opacity: 0, transparent: true });
const nothing = new THREE.Mesh(geometry5, material5);

let snowing = false; // Variable permettant de savoir s'il neige
let raining = false; // Variable permettant de savoir s'il pleut
let clearWeather = false // Variable permettant de savoir si le temps est clair

let rained = false // Variable permettant de savoir si la pluie est apparue
let snowed = false // Variable permettant de sacoir si la neige est apparue
let cleared = false // Variable permettant de sacoir si la neige et la pluie ont disparu

// boucle de rendu
let frame = 0
let cubeState = { previous: cube2, current: cube2 }

// LOOP

let lightningEndFrame = 0 // Variable permettant de savoir quand faire disparaitre un éclair
function animate() {
    // console.log(spheres)
    requestAnimationFrame(animate);
    controls.update();

    moveSpheres(spheres, structuresCollisions) // Fonction permettant de faire se déplacer les personnages
    spheres = checkCollisions(spheres, scene); // Fonction permettant de savoir quoi faire quand des personnages se croisent

    renderer.render(scene, camera);

    spheres.map((ball, id) => { // À chaque frame 
        if (ball.life <= 0) death(ball, id, scene, spheres) // Si un personnage n'a plus de PV, il meurt
        ball.life--; // sinon il perd 1 PV
        ball.mesh.scale.y = ball.life * 2 / 1500 // Son échelle dépend du nombre de PV qui lui reste
    })

    if (spheres.length == 0) // Si il n'y a plus de personnage dans la scene, il en respawn un certain nombre
        for (let i = 0; i < nbBalls; i++) spheres.push(generateSphere(Math.random() <= 0.5 ? "M" : "F", Math.random(), Math.random(), Math.random(), scene))

    if (raining && !rained) { // Conditions permettant de changer ce qui tombe, ici dans le cas de la pluie
        snowflakes.forEach(sf => {sf.add(rain.clone());}); // On change tout les éléments qui n'ont à ce moment plus de mesh associé par des gouttes de pluie
        rained = true // On change toutes les variables permettant de savoir la météo actuelle
        snowed = false
        cleared = false
    } else if (snowing && !snowed) {
        snowflakes.map(sf => {sf.add(fancySnowflake.clone())})
        rained = false
        snowed = true
        cleared = false
    } else if (clearWeather && !cleared) {
        snowflakes.map(sf => {sf.add(nothing.clone())})
        rained = false
        snowed = false
        cleared = true
    }

    // Autres conditions permettant de changer ce qui tombe
    if ((state == 5 && !raining || state == 7 && !raining) && !rained) { // Dans le cas de la pluie
        snowflakes.map(sf => { // On retire à tout ce qui tombe leurs meshs
            while (sf.children.length > 0) {
                sf.remove(sf.children[0]);
            }
        })
        raining = true // On change toutes les variables permettant de savoir les changements de météo
        snowing = false
        clearWeather = false
    } else if ((state == 3) && !snowed) {
        snowflakes.map(sf => {
            while (sf.children.length > 0) {
                sf.remove(sf.children[0]);
            }
        })
        snowing = true
        raining = false
        clearWeather = false
    } else if ((state == 1 || state == 2 || state == 4 || state == 6) && !cleared) {
        snowflakes.map(sf => {
            while (sf.children.length > 0) {
                sf.remove(sf.children[0]);
            }
        })
        snowing = false
        raining = false
        clearWeather = true
    }

    if ((frame % 20 == 0 && frame != 0 && raining) || (frame % 100 == 0 && frame != 0 && snowing)) {
        for (let i = 0; i <= 1; i++) {
            let sf = fancySnowflake.clone()
            if (raining) {
                while (sf.children.length > 0) {
                    sf.remove(sf.children[0]);
                }
                sf.add(rain.clone());
            } else if (clearWeather) {
                while (sf.children.length > 0) {
                    sf.remove(sf.children[0]);
                }
                sf.add(nothing.clone());
            }
            sf.scale.x = .3
            sf.scale.y = .3
            sf.scale.z = .3
            snowflakes.push(sf)
            scene.add(sf)
        }
    }

    snowflakes.map(sf => { // Boucle permettant de changer la manière de tomber
        if (snowing) {
            sf.position.y -= .02 // La neige descend de 0.02/frame
            sf.rotation.x += Math.random() * .02 // Et tourne légèrement sur lui-même
            sf.rotation.z += Math.random() * .02
            sf.rotation.y += Math.random() * .02
        } else if (raining) {
            sf.position.y -= 1 // La pluie descend de 1/frame
            sf.rotation.x = 0 // est tombe droite
            sf.rotation.z = 0
            sf.rotation.y = 0
        }

        if (sf.position.y <= -.2) { // si les éléments tombent au sol, ils retournent en haut
            const angle = Math.random() * (2 * Math.PI)
            sf.position.x += Math.cos(angle) * (Math.random() * 26)
            sf.position.z += Math.sin(angle) * (Math.random() * 26)
            sf.position.y = Math.sqrt(620 - Math.pow(Math.sqrt(sf.position.x * sf.position.x + sf.position.z * sf.position.z), 2));
        }
    })

    frame++ // compteur de frames

    if (frame % 80 == 0) { // On essaye de changer d'état toute les 80 frames
        cubeState = changeState(state)
    }

    if (cubeState !== undefined) { // Partie permettant de changer d'apparence du ciel
        scene.add(cubeState.current) 
        if (cubeState.previous !== undefined) cubeState.previous.material.opacity -= 0.01;
        cubeState.current.material.opacity += 0.01; // via un fondu fade-out → fade-in

        if (cubeState.previous !== undefined && cubeState.previous.material.opacity <= 0) {
            scene.remove(cubeState.previous);
        }
        if (cubeState.current.material.opacity > 0.8) {
            cubeState.current.material.opacity = .8
        }
    }

    // console.log(state, frame, lightningEndFrame )
    if ((state == 7 || state == 6) && frame % 200 == 0) { // pendant un état où il y a de la foudre
        scene.add(lLightning) // on ajoute un éclair
        lightningEndFrame = frame+10 // et 10 frames plus tard
    } 
    if (frame == lightningEndFrame) { 
        scene.remove(lLightning) // on le fait disparaître
    }
}

animate();