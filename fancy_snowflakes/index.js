import * as THREE from "three"

const URL_X = 2
const URL_Y = 2
const URL_Z = 2
const URL_MAX_ITER = 3
const URL_WIREFRAME = false
const URL_PROBA = 1
const URL_SHAPE = "tetrahedron"


// fonction qui retourne la position dans la scène des sommets d'un mesh donné. 
const getGlobalVerticesPositions = (mesh) => {
    const positions = mesh.geometry.attributes.position.array; // on obtiens les positions locales des sommets du mesh. (dans son propre repère)
    const positionsArray = []; // 

    const position = mesh.position.clone(); // Copie la position du mesh
    const scale = mesh.scale.clone(); // Copie la mise à l'échelle du mesh

    for (let i = 0; i < positions.length; i += 3) { // on défile dans les valeurs. on augemente de 3 à chaque boucle car les coordonnées sont stockées comme suit : x, y, z, x, y, z, x, y, z dans le tableau
        const x = positions[i] * scale.x + position.x;
        const y = positions[i + 1] * scale.y + position.y;
        const z = positions[i + 2] * scale.z + position.z;
        positionsArray.push({ x: x, y: y, z: z }); // on ajoute les coordonnées rangées dans un objet comme ça {x:x, y:y, z:z} pour chaque sommet
    }

    var uniquePositions = positionsArray.reduce((acc, pos) => {
        if (!acc.some(p => p.x === pos.x && p.y === pos.y && p.z === pos.z)) { // on filtre parce que certaines coordonnées peuvent être en plusieurs fois
            acc.push(pos);
        }
        return acc;
    }, []);

    return uniquePositions // on return le tableau avec les coordonnées de chaque sommet du mesh
}

// fonction qui permet de dessiner un mesh à une position donnée
const drawCubeAtPosition = (position, iter) => { // Ajout de 'iter' comme argument
    if (iter > URL_MAX_ITER) { // condition d'arrêt au cas où on atteint le nombre d'itération maximales définies.
        return;
    }

    const nb = Math.floor(Math.random() * (URL_PROBA + (iter / 10))) // tire un nombre entre 0 et un nombre donné dans les paramètres avant. arrondi à l'unité inférieure
    if (nb == 0 || iter == 1) { // si le nombre tiré est = à 0 ou si on est à la première itération (pour éviter d'avoir un rendu vide)
        const cube = new THREE.Mesh(geometry, material) // on définit un nouveau mesh
            // cube.castShadow = true; // il pourra générer des ombres
            // cube.receiveShadow = true // il pourra recevoir des ombres
        cube.position.set(position.x, position.y, position.z) // il sera à la position donnée en paramètres
        cube.scale.set( // rétrécissement du mesh par rapport à chaque itération de manière à ce qu'il soient de plus en plus petits
            1 / Math.pow(URL_X, iter),
            1 / Math.pow(URL_Y, iter),
            1 / Math.pow(URL_Z, iter)
        );
        fancySnowflake.add(cube) // on ajoute le mesh à la scene 3D
        const verticesPositions = getGlobalVerticesPositions(cube) // on appelle la fonction qui récupère les coordonnées des sommets du mesh
        verticesPositions.forEach((position) => { // pour chaque sommet
            drawCubeAtPosition(position, iter + 1); // Appel récursif avec iter décrémenté
        })
    }
}

let geometry
let materialProperties

// if (URL_SHAPE == "cube") geometry = new THREE.BoxGeometry() // choix du type de mesh utilisé en fonction du paramètre rentré
if (URL_SHAPE == "tetrahedron") geometry = new THREE.TetrahedronGeometry()
    // else if (URL_SHAPE == "dodecahedron") geometry = new THREE.DodecahedronGeometry()
    // else if (URL_SHAPE == "isocahedron") geometry = new THREE.IcosahedronGeometry()
    // else if (URL_SHAPE == "octahedron") geometry = new THREE.OctahedronGeometry()
    // else geometry = new THREE.BoxGeometry()

if (URL_WIREFRAME) { // choix des paramètres du matériau (wireframes ou pas)
    materialProperties = {
        color: 0xffffff,
        transparent: true,
        wireframe: true
    }
} else {
    materialProperties = {
        color: 0xffffff,
        clearcoat: 1.0,
        emissive: 0x888888
    }
}
const material = new THREE.MeshPhongMaterial(materialProperties)

let fancySnowflake = new THREE.Mesh()

// premier appel de la fonction récursive
var iter = 1
drawCubeAtPosition({ x: 0, y: 0, z: 0 }, iter)

export { fancySnowflake }