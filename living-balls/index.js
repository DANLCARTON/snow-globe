import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { random3 } from "./max.js"

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
// lumières

// function getRandomColor() {
//     return Math.random() * 0xffffff;
// }

// scene.add(new THREE.AmbientLight(getRandomColor(), 1))

// const point1 = new THREE.PointLight(getRandomColor(), 200)
// point1.position.set(0, 2.5, 0)
// point1.castShadow = true
// scene.add(point1)

// définition des contrôles de la caméra
// const controls = new OrbitControls(camera, renderer.domElement);
// scene.add(camera)

// VARIABLES
let globalBallId = 0;

// PARAMS
// const urlParams = new URLSearchParams(window.location.search)

// let URL_START_POPULATION = urlParams.get("pop")
// let URL_AREA = urlParams.get("area")
// let URL_SEX_DISTRIBUTION = urlParams.get("sexDistrib")
// let URL_MINIMUM_ATTRACTIVENESS_NECESSARY = urlParams.get("man")
// let URL_ATTRACTIVENESS_BOOST = urlParams.get("aBoost")


// const startPopulation = URL_START_POPULATION
// const area = URL_AREA
// const sexDistrib = URL_SEX_DISTRIBUTION
// const minAttractivenessNecessary = URL_MINIMUM_ATTRACTIVENESS_NECESSARY
// const attractivenessBoost = URL_ATTRACTIVENESS_BOOST

const startPopulation = 50
const area = 100
const sexDistrib = 0.48
const minAttractivenessNecessary = 0.4
const attractivenessBoost = 0.001










// ACTUAL CODE
// ----------------------------------------------------------------

// GLOBAL ELEMENTS DEF
// const plane = new THREE.PlaneGeometry(area, area)
// const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x353535 })
// const ground = new THREE.Mesh(plane, groundMaterial)
// ground.receiveShadow = true;
// ground.rotation.x = -Math.PI / 2
// scene.add(ground)

// const sphere = new THREE.SphereGeometry(.2, 8, 8);
// const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
const attractivenessMaterial = new THREE.MeshPhongMaterial({ color: 0xffdddd })
const strengthMaterial = new THREE.MeshPhongMaterial({ color: 0xddffdd })
const basicMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
const maleGeometry = new THREE.BoxGeometry(.4, .4, .4)
const femaleGeometry = new THREE.SphereGeometry(.2, 8, 8)

// CLASS DEF
class Ball {
    constructor(pos, angle, mesh, sex, attractiveness, strength, speed) {
        this.id = globalBallId
        globalBallId++
        this.pos = pos;
        this.angle = angle;
        this.mesh = mesh;
        this.sex = sex;
        this.attractiveness = attractiveness
        this.strength = strength
        this.speed = speed
    }
}

// FUNCTION DEF
const generateSphere = (sex, attractiveness, strength, speed, scene) => {
    const ball = new Ball(
        new THREE.Vector3(Math.random() * 100 - 50, .2, Math.random() * 100 - 50),
        Math.random() * (2 * Math.PI),
        undefined,
        sex,
        attractiveness,
        strength,
        speed
    )

    console.log("1", ball.pos)

    ball.mesh = new THREE.Mesh(new THREE.SphereGeometry(ball.strength / 4 + .2, 8, 8), strengthMaterial)

    const attractivenessBall = new THREE.Mesh(new THREE.SphereGeometry(ball.attractiveness / 4 + .2, 8, 8), attractivenessMaterial)
    attractivenessBall.position.set(0, .5, 0);
    ball.mesh.add(attractivenessBall)
    attractivenessBall.castShadow = true
    attractivenessBall.receiveShadow = true

    const sexGeometry = new THREE.Mesh(ball.sex == "M" ? maleGeometry : femaleGeometry, basicMaterial)
    sexGeometry.position.set(0, 1, 0)
    ball.mesh.add(sexGeometry)
    sexGeometry.castShadow = true
    sexGeometry.receiveShadow = true

    ball.mesh.castShadow = true;
    ball.mesh.receiveShadow = true;

    scene.add(ball.mesh)

    console.log("🎉", ball.id, "is born!")

    return ball
}

const crossover = (super1, super2, scene, spheres) => {
    const kid1Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness,
        strength: random3() < .5 ? super1.strength : super2.strength,
        speed: random3() < .5 ? super1.speed : super2.speed
    }

    const kid2Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness,
        strength: random3() < .5 ? super1.strength : super2.strength,
        speed: random3() < .5 ? super1.speed : super2.speed
    }

    if (kid1Stats.attractiveness == super1.attractiveness) kid2Stats.attractiveness = super2.attractiveness
    else kid2Stats.attractiveness = super1.attractiveness

    if (kid1Stats.strength == super1.strength) kid2Stats.strength = super2.strength
    else kid2Stats.strength = super1.strength

    if (kid1Stats.speed == super1.speed) kid2Stats.speed = super2.speed
    else kid2Stats.speed = super1.speed

    let kid1 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid1Stats.attractiveness, kid1Stats.strength, kid1Stats.speed, scene)
    let kid2 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid2Stats.attractiveness, kid2Stats.strength, kid2Stats.speed, scene)

    Math.floor(Math.random()) < .5 ? mutation(kid1) : mutation(kid2)

    spheres.push(kid1)
    spheres.push(kid2)
}

const fight = (ball1, ball2, index1, index2, scene, spheres) => {
    if (ball1.strength > ball2.strength) {
        spheres.splice(index2, 1)
        scene.remove(ball2.mesh)
        console.log("💀", ball2.id, "was slain by", ball1.id)
    } else {
        spheres.splice(index1, 1)
        scene.remove(ball1.mesh)
        console.log("💀", ball1.id, "was slain by", ball2.id)
    }
}

const enhanceAttractiveness = (ball1, ball2) => {
    ball1.attractiveness < ball2.attractiveness ? console.log("👏", ball2.id, "makes", ball1.id, "more attractive") : console.log("👏", ball1.id, "makes", ball2.id, "more attractive")
    ball1.attractiveness < ball2.attractiveness ? ball1.attractiveness += attractivenessBoost : ball2.attractiveness += attractivenessBoost
    ball1.mesh.children[0].scale.set(1 + ball1.attractiveness / 4 + 0.2, 1 + ball1.attractiveness / 4 + 0.2, 1 + ball1.attractiveness / 4 + 0.2);
    ball2.mesh.children[0].scale.set(1 + ball2.attractiveness / 4 + 0.2, 1 + ball2.attractiveness / 4 + 0.2, 1 + ball2.attractiveness / 4 + 0.2);
}

const mutation = (kid) => {
    console.log("🕴", kid.id, "is a mutant")
    const statIndex = Math.floor(Math.random() * 3)
    if (statIndex == 0) kid.attractiveness = random3()
    else if (statIndex == 1) kid.strength = random3()
    else if (statIndex == 2) kid.speed = random3()
}

const meet = (ball1, ball2, index1, index2, scene, spheres) => {

    if (ball1.sex != ball2.sex) {
        if (Math.abs(ball1.attractiveness - ball2.attractiveness) <= minAttractivenessNecessary) { // ok mais je pense que là il faudrait utiliser tous les paramètres : attractivité, force et vitesse, pas juste l'attractivité. En gros vraaiment calculer un fitness à partir de tout ça | mais sinon ça marche
            crossover(ball1, ball2, scene, spheres)
            if (ball1.sex == "F") {
                scene.remove(ball1.mesh)
                spheres.splice(index1, 1)
            } else {
                scene.remove(ball2.mesh)
                spheres.splice(index2, 1)
            }
        } else {
            console.log("👨‍🦯", ball1.id, "&", ball2.id, "won't mate")
        }
    } else if (ball1.sex == "M" && ball2.sex == "M") {
        fight(ball1, ball2, index1, index2, scene, spheres)
    } else if (ball1.sex == "F" && ball2.sex == "F") {
        enhanceAttractiveness(ball1, ball2)
    }
}

function moveSpheres(spheres) {
    // console.log(spheres)
    for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];
        const speed = ball.speed / 10 + 0.01;
        ball.pos.x += Math.cos(ball.angle) * speed;
        ball.pos.z += Math.sin(ball.angle) * speed;

        // gestion des bords du plan
        if (ball.pos.x < -area / 2) ball.pos.x = area / 2;
        if (ball.pos.x > area / 2) ball.pos.x = -area / 2;
        if (ball.pos.z < -area / 2) ball.pos.z = area / 2;
        if (ball.pos.z > area / 2) ball.pos.z = -area / 2;

        // Update the position of the mesh
        ball.mesh.position.copy(ball.pos);
    }
}

// function drawSpheres(spheres) {
//     for (let i = 0; i < spheres.length; i++) {
//         let sphere = spheres[i];
//         sphere.mesh.position.copy(sphere.pos);
//     }
// }

function checkCollisions(spheres, scene) {
    for (let i = 0; i < spheres.length; i++) {
        for (let j = 0; j < spheres.length; j++) {
            if (i != j) {
                let ball1 = spheres[i];
                let ball2 = spheres[j];

                const distance = ball1.pos.distanceTo(ball2.pos);
                const sumRadii = ball1.mesh.geometry.parameters.radius + ball2.mesh.geometry.parameters.radius;

                if (distance < sumRadii) {
                    meet(ball1, ball2, i, j, scene, spheres)
                    return spheres
                }
                if (distance > sumRadii) {
                    continue
                }
            }
        }
    }
    return spheres
}

// LE CODE
// let spheres = []

// for (let i = 0; i < startPopulation; i++) {
//     spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
// }


// ------------------------------------------------------------------------------------------------









// HELPERS
// scene.add(new THREE.PointLightHelper(point1, 1))

// LOOP
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     moveSpheres()
//     spheres = checkCollisions();
//     drawSpheres()
//     renderer.render(scene, camera);
// }

// animate();

export { moveSpheres, checkCollisions, generateSphere }