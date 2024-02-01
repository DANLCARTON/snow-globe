// VOROWAYS - JE SAIS PLUS
// GENERATION D'UN RESEAUDE ROUTES GRACE A UN DIAGRAMME DE VORONOI

import * as THREE from "three"
import * as d3 from "d3"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra

// BASIC SETUP
const width = 100
const height = 100
const nbVertices = 10
const maxSize = 25
const cells = 50

// Importation des textures
const roadTexture = new THREE.TextureLoader().load("./assets/road")
roadTexture.wrapS = THREE.RepeatWrapping
roadTexture.wrapT = THREE.RepeatWrapping;
// texture.rotation = Math.PI / 2
roadTexture.repeat.set(1, 1)

const urbanTexture = new THREE.TextureLoader().load("./assets/snowy-ground")
urbanTexture.wrapS = THREE.RepeatWrapping;
urbanTexture.wrapT = THREE.RepeatWrapping;
urbanTexture.repeat.set(0.21, 0.21)

const lakeTexture = new THREE.TextureLoader().load("./assets/lake")
lakeTexture.wrapS = THREE.RepeatWrapping;
lakeTexture.wrapT = THREE.RepeatWrapping;
lakeTexture.repeat.set(0.21, 0.21)

// géométires et matériaux
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, map: roadTexture })

// const urbanMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: urbanTexture })
const urbanMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: urbanTexture })
const lakeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: lakeTexture })

let voroways = new THREE.Mesh()

// FUCTIONS
// ---------------------------------------------------------------
const drawAllPlanes = (points) => { // fonction qui permet de placer les plans reprénsetnatn les routes après que le diagramme soit généré
    for (let i = 1; i < points.length; i++) {
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        const dx = points[i].x - points[i - 1].x; // on regarde où est le point de départ et où est le point d'arrivée de chaque plan
        const dz = points[i].z - points[i - 1].z;
        const dy = points[i].y - points[i - 1].y;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const angleZ = Math.atan2(dz, dx);
        const angleY = Math.atan2(dy, dy);
        plane.scale.set(distance, 1, 1); // On génère les caractéristiques du plan en fonction
        plane.position.set((points[i].x + points[i - 1].x) / 2, (points[i].y + points[i - 1].y) / 2, (points[i].z + points[i - 1].z) / 2);
        plane.rotation.z = angleZ;
        plane.rotation.y = angleY;
        plane.rotation.x = Math.PI / 2;
        voroways.add(plane);
    }
}

const gaussianRandom = () => { // Différentes lois aléatoires pour placer les points permettant de créer le diagramme
    let u, v, s;
    do {
        u = Math.random() * 2 - 1; // Étend la plage à [-1, 1] pour la moyenne de 0.5
        v = Math.random() * 2 - 1;
        s = u * u + v * v;
    } while (s >= 1 || s === 0);

    const multiplier = Math.sqrt(-2 * Math.log(s) / s);
    return 0.5 + 0.5 * u * multiplier; // Ajuste la moyenne à 0.5 et l'étend à [0, 1]
}

const logNormalRandom = () => {
    const mean = 0
    const sigma = 1
    return Math.exp(mean + sigma * gaussianRandom())
}

var vertices = d3.range(cells).map(function(d) { // Utilisation de la bibliothèque D3.js générer les emplacement des points
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 26;
    // console.log(gaussianRandom())
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    return [x, y];
});

// console.log(selectedPositions)

var delaunay = d3.Delaunay.from(vertices); 
const voronoi = delaunay.voronoi([-maxSize, -maxSize, maxSize, maxSize]); // Utilisation de la bibliothèque D3.js pour générer le diagramme
const polygons = Array.from(voronoi.cellPolygons()); // On récupère les informations des polygones

const wholePolyInRadius = (poly) => { // Fonction permettant de vérifier si un polygone est enntièrement dans un rayon défini
    const allPointsInRadius = poly.every(coord => {
        const distanceFromCenter = Math.sqrt((coord[0] - 0) ** 2 + (coord[1] - 0) ** 2);
        return distanceFromCenter < maxSize;
    });
    return allPointsInRadius;
};

// ACTUAL CODE
// ----------------------------------------------------------------

let mat = new THREE.LineBasicMaterial()
polygons.map(poly => { // Pour chaque polygone du diagramme généré
    let points = []
    if (wholePolyInRadius(poly)) { // Si il est entièrement dans le rayon
        poly.map(ver => {
            points.push(new THREE.Vector3(ver[0], 0, ver[1])); // on ajoute ses points à la liste des points
        })
    }
    drawAllPlanes(points) // à partir de la liste des points, on pourra générer les plans formant les routes
})

const selectedPositions = [];
vertices.map(ver => {
    const x = ver[0]
    const y = ver[1]
    if ((x >= -15 && x <= -5 || x >= 5 && x <= 15) && (y >= -15 && y <= -5 || y >= 5 && y <= 15)) {
        selectedPositions.push([x, y]); // Selection de quelques positions pour placer les structres de conway (bâtiments) à cet emplacement
    }
})


var lake = 0

polygons.map(poly => { /// Pour chaque polygone du diagramme généré
    var polyPoints = []
    if (wholePolyInRadius(poly)) { // Si il est entièrement dans le rayon
        poly.map(coord => {
            const distanceFromCenter = Math.sqrt((coord[0] - 0) * (coord[0] - 0) + (coord[1] - 0) * (coord[1] - 0))
            if (distanceFromCenter < maxSize) polyPoints.push(new THREE.Vector2(coord[0], coord[1])) // On récupère les sommets du polygone
            else return
        })
        var polyShape = new THREE.Shape(polyPoints) // Des sommets on en fait une forme en 2D
        var extrusionSettings = { // Paramètres pour l'extrusion
            size: 30, height: 4, curveSegments: 3, bevelThickness: 1, bevelSize: 2, bevelEnabled: false, material: 0, extrudeMaterial: 1
        };
        var polyGeometry = new THREE.ExtrudeGeometry(polyShape, extrusionSettings);// On l'extrude (cela permettra d'en faire un mesh)

        if (lake < 2) {
            var poly = new THREE.Mesh(polyGeometry, lakeMaterial); // Les deux premières polygones seront des lacs
            lake++
        } else {
            var poly = new THREE.Mesh(polyGeometry, urbanMaterial); // Les autres du sol pavé
        }

        poly.rotation.x += Math.PI / 2
        poly.position.y -= 0.01
        voroways.add(poly);
    }
})

export { voroways, selectedPositions }