import * as THREE from "three"
import * as d3 from "d3"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra

// BASIC SETUP
const width = 100
const height = 100
const nbVertices = 10
const maxSize = 25
const cells = 50

// textures
const texture = new THREE.TextureLoader().load("./voroways/road.png")
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.rotation = Math.PI / 2
texture.repeat.set(1, 5)

// géométires et matériaux
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, map: texture })

// définition de la scene et de la caméra
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1100000);
// camera.position.y = 5
// const renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
// scene.add(new THREE.AmbientLight(0xd2b48c, 5))
// const controls = new OrbitControls(camera, renderer.domElement);
// scene.add(camera)

let voroways = new THREE.Mesh()






// FUCTIONS
// ---------------------------------------------------------------

const drawAllPlanes = (points) => {
    for (let i = 1; i < points.length; i++) {
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
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
        voroways.add(plane);
    }
}

const gaussianRandom = () => {
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

const selectedPositions = []
var vertices = d3.range(cells).map(function(d) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 26;
    // console.log(gaussianRandom())
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    // console.log(x, y)
    if (x < 20 && y < 20 && x > -20 && y > -20) selectedPositions.push([x, y])
    return [x, y];
});

console.log(selectedPositions)

var delaunay = d3.Delaunay.from(vertices);
// console.log(delaunay)
const voronoi = delaunay.voronoi([-maxSize, -maxSize, maxSize, maxSize]);
const polygons = Array.from(voronoi.cellPolygons());

// console.log(polygons);



// geom.vertices.push(v1);
// geom.vertices.push(v2);
// geom.vertices.push(v3);

// geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
// geom.computeFaceNormals();

// var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );

// scene.add(object);

// ACTUAL CODE
// ----------------------------------------------------------------

let mat = new THREE.LineBasicMaterial()
polygons.map(poly => {
    let points = []
    poly.map(ver => {
        // console.log(ver[0], ver[1])
        const distanceFromCenter = Math.sqrt((ver[0]-0)*(ver[0]-0) + (ver[1]-0)*(ver[1]-0))
        // console.log(distanceFromCenter)
        if (distanceFromCenter < maxSize) points.push(new THREE.Vector3(ver[0], 0, ver[1]))
        // if ((ver[0] < maxSize && ver[0] > -maxSize) && (ver[1] < maxSize && ver[1] > -maxSize)) points.push(new THREE.Vector3(ver[0], 0, ver[1]))

    })
    // const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // const line = new THREE.Line(geometry, mat);
    // scene.add(line)
    drawAllPlanes(points)
})


// const shape = new THREE.BoxGeometry(1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
// const mesh = new THREE.Mesh(shape, material)
// scene.add(mesh)

// ----------------------------------------------------------------









// LOOP

// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }

// on applique des règles autant de fois qu'on a défini d'itérations 
// animate();

export {voroways, selectedPositions}