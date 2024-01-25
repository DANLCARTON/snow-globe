// CONWAY STRUCTURES - AUTOMATE CELLULAIRE
// GENERATION DE STRUCTURES VERTICALES BASÉES SUR LES GENERATIONS DU JEU DE LA VIE

import * as THREE from 'three'; // importation de three.js
import models from "./models.js" // importation des modèles préfaits pour la simulation

const possibleModels = ["snowGlobePulsar", "snowGlobePentadecathlon", "snowGlobe4Blinkers", "snowGlobeDiehard"] // modèles utilisables
const model1 = possibleModels[Math.floor(Math.random() * possibleModels.length)] // deux modèles seront choisis aléatoirement pour être affichés
const model2 = possibleModels[Math.floor(Math.random() * possibleModels.length)]
let gen = 50 // La simulation du jeu de la vie se fera sur 50 itérations

// SETUP

// Importation des textures
const window = new THREE.TextureLoader().load("./assets/window")
window.wrapS = THREE.RepeatWrapping;
window.wrapT = THREE.RepeatWrapping;
window.repeat.set(1, 1)

const wall = new THREE.TextureLoader().load("./assets/wall")
wall.wrapS = THREE.RepeatWrapping;
wall.wrapT = THREE.RepeatWrapping;
wall.repeat.set(1, 1)

const roof = new THREE.TextureLoader().load("./assets/roof")
roof.wrapS = THREE.RepeatWrapping;
roof.wrapT = THREE.RepeatWrapping;
roof.repeat.set(1, 1)

// Définition du matériau pour les cubes de la structure
const wallMaterial = [
    new THREE.MeshPhongMaterial({ map: window }),
    new THREE.MeshPhongMaterial({ map: wall }),
    new THREE.MeshPhongMaterial({ map: roof }),
    new THREE.MeshPhongMaterial({ color: 0x888888 }),
    new THREE.MeshPhongMaterial({ map: wall }),
    new THREE.MeshPhongMaterial({ map: wall })
]

// fonction permettant de supprimer les bords de chaque couche de la simulation parce que ça cause des problèmes. 
const deleteBorders = (layer) => {
    let result = layer.map(row => row.slice());

    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            if (i === 0 || i === result.length - 1 || j === 0 || j === result[i].length - 1) {
                result[i][j] = 0;
            }
        }
    }

    return result;
}

// fonction permettant de compter le nombre de cellules vivantes dans le voisinage de chaque cellule. 
const countNeighbours = (x, z, cubes) => {
    let nb = 0; // on part de 0

    const isValid = (i, j) => i >= 0 && j >= 0 && i < cubes.length && j < cubes[0].length; // fonction pour regarder si les cellules voisines de la cellule qu'on regarde ne sont pas out of bounds. sinon c'est undefined et c'est les problèmes

    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ]; // toutes les directions dans lesquelles on regarde. En gros les coordonnées des cellules voisines

    for (const [dx, dz] of directions) {
        const newX = x + dx;
        const newZ = z + dz;

        if (isValid(newX, newZ) && cubes[newX][newZ] === 1) { // si la cellule voisine est pas out of bounds et qu'elle est vivante, on incrémente de 1
            nb++;
        }
    }

    return nb; // on retourne le nombre de voisines vivantes
};

// fonction pour générer la prochaine couche de cubes. Correspond à la prochaine génération de la simulation. 
const generateNextLayer = (cubesLayer) => {
    // console.log(cubesLayer)
    let nextLayer = []; // Création d'un nouveau tableau vide pour stocker la prochaine génération

    for (let i = 0; i < cubesLayer.length; i++) {
        let row = [];
        for (let j = 0; j < cubesLayer[i].length; j++) {
            row.push(cubesLayer[i][j]);
        }
        nextLayer.push(row);
    } // on remplit le tableau de la prochaine couche avec les valeurs de la couche qu'on regarde. 
    // si on avait fait juste nextLayer = cubesLayer ça aurait juste fait une copie et ça aurait rien changé. 

    for (let x = 0; x < 49; x++) {
        for (let z = 0; z < 49; z++) { // on défile dans toutes les cellules de la couche (50x50)
            const nb = countNeighbours(x, z, cubesLayer); // on compte les cellules voisines vivantes.
            if (cubesLayer[x][z] === 1) { // si la cellule qu'on regarde est vivante
                if (nb < 2 || nb > 3) { // si la cellule a 0, 1, 4, 5, 6, 7 ou 8 voisines vivantes
                    nextLayer[x][z] = 0; // La cellule meurt
                } else { // si la cellule a 2 ou 3 voisines vivantes
                    nextLayer[x][z] = 1; // La cellule survit
                }
            } else { // si la cellule qu'on regarde est morte
                if (nb === 3) { // si elle a 3 voisines vivantes
                    nextLayer[x][z] = 1; // Une nouvelle cellule naît
                } else { // si elle a 0, 1, 2, 4, 5, 6, 7 ou 8 voisines vivantes
                    nextLayer[x][z] = 0; // La cellule reste morte
                }
            }
        }
    }
    return nextLayer; // on retourne la prochaine couche. 
}
const conwayStructure1 = new THREE.Mesh()
const conwayStructure2 = new THREE.Mesh()
let cubes1 = []; // tableau qui va représenter la couche initiale, à partir de laquelle on va faire tourner la simulation. 
let cubes2 = []; // tableau qui va représenter la couche initiale, à partir de laquelle on va faire tourner la simulation. 

// si on a rentré un modèle spécifique dans les paramèters de l'URL, on initie la première couche avec. voir models.js
// if (model === "blincker") cubes = models["blincker"]
// else if (model === "toad") cubes = models["toad"]
// else if (model === "beacon") cubes = models["beacon"]
if (model1 === "snowGlobePulsar") cubes1 = models["snowGlobePulsar"]
else if (model1 === "snowGlobePentadecathlon") cubes1 = models["snowGlobePentadecathlon"]
else if (model1 === "snowGlobe4Blinkers") cubes1 = models["snowGlobe4Blinkers"]
else if (model1 === "snowGlobe44p5h2v0") cubes1 = models["snowGlobe44p5h2v0"]
else if (model1 === "snowGlobeDiehard") cubes1 = models["snowGlobeDiehard"]

if (model2 === "snowGlobePulsar") cubes2 = models["snowGlobePulsar"]
else if (model2 === "snowGlobePentadecathlon") cubes2 = models["snowGlobePentadecathlon"]
else if (model2 === "snowGlobe4Blinkers") cubes2 = models["snowGlobe4Blinkers"]
else if (model2 === "snowGlobe44p5h2v0") cubes2 = models["snowGlobe44p5h2v0"]
else if (model2 === "snowGlobeDiehard") cubes2 = models["snowGlobeDiehard"]
    // else if (model === "pulsar") cubes = models["pulsar"]
    // else if (model === "pentadecathlon") cubes = models["pentadecathlon"]
    // else if (model === "4blinckers") cubes = models["4blinckers"]
    // else if (model === "oscillators") cubes = models["oscillators"]
    // else if (model === "block") cubes = models["block"]
    // else if (model === "beehive") cubes = models["beehive"]
    // else if (model === "loaf") cubes = models["loaf"]
    // else if (model === "boat") cubes = models["boat"]
    // else if (model === "tub") cubes = models["tub"]
    // else if (model === "pond") cubes = models["pond"]
    // else if (model === "cthulhu") cubes = models["cthulhu"]
    // else if (model === "stills") cubes = models["stills"]
    // else if (model === "glider") cubes = models["glider"]
    // else if (model === "lwss") cubes = models["lwss"]
    // else if (model === "mwss") cubes = models["mwss"]
    // else if (model === "hwss") cubes = models["hwss"]
    // else if (model === "44p5h2v0") cubes = models["44p5h2v0"]
    // else if (model === "spaceships") cubes = models["spaceships"]
    // else if (model === "rpentomino") cubes = models["rpentomino"]
    // else if (model === "diehard") cubes = models["diehard"]
    // else if (model === "acorn") cubes = models["acorn"]
    // else if (model === "metuselahs") cubes = models["metuselahs"]

// si aucun modèle spécifique n'a été rentré, on part sur une génération random. 
// else {
//     for (let i = 0; i <= 49; i++) {
//         let row = [];
//         for (let j = 0; j <= 49; j++) {
//             if (Math.round(Math.random() * 8) == 1) row.push(1);
//             else row.push(0)
//         }
//         cubes.push(row);
//     }
// }

// tableau dans lequel il y aura toutes les couches. 
let layers1 = []
let layers2 = []

layers1.push(cubes1) // on y met la couche initiale
layers2.push(cubes2) // on y met la couche initiale

// création de la géométrie pour tous les cubes
const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshPhongMaterial({ color: 0xffffff })

// on va générer ici toutes les couches
if (gen == null) gen = 50; // si aucun paramètre du nombre de générations n'a été rentré, on part sur 50 comme valeur par défaut.
for (let i = 1; i <= gen; i++) {
    layers1.push(deleteBorders(generateNextLayer(layers1[i - 1]))) // on génère toutes les couches. En gros on fait tourner le code pour le jeu de la vie, sauf qu'on enregistre toutes les générations une par une dans le tableau layers
    layers2.push(deleteBorders(generateNextLayer(layers2[i - 1]))) 
}

// code pour placer les cubes dans la scène.
let y = 0; // on part d'une hauteur de 0
layers1.map((layer) => {
    for (let x = 0; x <= 49; x++) {
        for (let z = 0; z <= 49; z++) {
            if (layer[x][z] == 1) {
                const cube = new THREE.Mesh(geometry, wallMaterial)
                cube.rotation.y += Math.PI / 2 * Math.floor(Math.random() * 4)
                cube.position.set(x, y, z);
                cube.castShadow = false;
                cube.receiveShadow = false
                conwayStructure1.add(cube)
            }
        }
    }
    y-- // et on déscend d'un cran a chaque boucle
})

y = 0
layers2.map((layer) => {
    for (let x = 0; x <= 49; x++) {
        for (let z = 0; z <= 49; z++) {
            if (layer[x][z] == 1) {
                const cube = new THREE.Mesh(geometry, wallMaterial)
                cube.rotation.y += Math.PI / 2 * Math.floor(Math.random() * 4)
                cube.position.set(x, y, z);
                cube.castShadow = false;
                cube.receiveShadow = false
                conwayStructure2.add(cube)
            }
        }
    }
    y-- // et on déscend d'un cran a chaque boucle
})

conwayStructure1.add(new THREE.AxesHelper(1))
conwayStructure2.add(new THREE.AxesHelper(1))

// Exportation des structures générées
export { conwayStructure1, conwayStructure2 }