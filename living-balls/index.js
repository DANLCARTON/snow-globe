import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { random3 } from "./max.js"

// PARAMETRES URL
const urlParams = new URLSearchParams(window.location.search)
const NN_WEIGHT_METHOD = urlParams.get("NNWeightMethod");
console.log(NN_WEIGHT_METHOD);
// la valeur "trained" va donner au créatures un réseau de neurones déjà entrainé
// n'importe quelle autre valeur va leur donner des valeurs aléatoires et débloquer la fonction de neuroévolution

// SETUP
const snowmanTexture = new THREE.TextureLoader().load("./assets/snowman")
snowmanTexture.wrapS = THREE.RepeatWrapping;
snowmanTexture.wrapT = THREE.RepeatWrapping;
snowmanTexture.repeat.set(1, 1)

const snowmanZoomedOutTexture = new THREE.TextureLoader().load("./assets/snowman-zoomed-out")
snowmanZoomedOutTexture.wrapS = THREE.RepeatWrapping;
snowmanZoomedOutTexture.wrapT = THREE.RepeatWrapping;
snowmanZoomedOutTexture.repeat.set(1, 1)

const attractivenessMaterial = new THREE.MeshPhongMaterial({ color: 0xffeeee })
const strengthMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeff })
const basicMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: snowmanTexture })
const maleHeadMaterial = [
    new THREE.MeshPhongMaterial({ map: snowmanTexture }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
]
const femaleHeadMaterial = new THREE.MeshPhongMaterial({ map: snowmanZoomedOutTexture })
const maleGeometry = new THREE.BoxGeometry(.4, .4, .4)
const femaleGeometry = new THREE.SphereGeometry(.2, 8, 8)

// PARAMETRES VARIABLES
let globalBallId = 0;

const area = 25
const sexDistrib = 0.48
const minAttractivenessNecessary = 0.4
const attractivenessBoost = 0.001
const maxSpeed = 2
const minSpeed = 0.1
const maxHP = 1500

class NN {
    // constructor(ni, w, no, nh, nhw) {
    constructor(ni, w, nh, wh, no) {
        this.ni = ni // neurones entrée
        this.w = w // poids neurones 
        this.no = no // neurones sortie
        this.nh = nh // neurones cachés
        this.wh = wh // poids des neurones cachés
    }
}

// CLASS DEF
class Ball {
    constructor(pos, angle, mesh, sex, attractiveness, strength, speed, inheritedNNWeights) {
        this.id = globalBallId
        globalBallId++
        this.pos = pos;
        this.angle = angle;
        this.mesh = mesh;
        this.sex = sex;
        this.attractiveness = attractiveness
        this.strength = strength
        this.speed = speed
        this.life = maxHP
        if (inheritedNNWeights !== undefined) {
            this.nn = new NN(
                [0, 0, 0],
                inheritedNNWeights.w, [0, 0, 0, 0, 0],
                inheritedNNWeights.wh, [0, 0]
            )
        } else {
            if (NN_WEIGHT_METHOD == "trained") {
                this.nn = new NN(
                    [0, 0, 0], // neurones d'entrée
                    [
                        [0.55905, 0.55905, 0.55905, 0.55905, 0.55905], // W_NI_0_0, W_NI_0_1, W_NI_0_2, W_NI_0_3, W_NI_0_4 
                        [0.10539, 0.10539, 0.10539, 0.10539, 0.10539], // W_NI_1_0, W_NI_1_1, W_NI_1_2, W_NI_1_3, W_NI_1_4
                        [0.19750, 0.19750, 0.19750, 0.19750, 0.19750] // W_NI_2_0, W_NI_2_1, W_NI_2_2, W_NI_2_3, W_NI_2_4
                    ], // poids des neurones d'entrée
                    [0, 0, 0, 0, 0], // neurones cachés
                    [
                        [-1.05700, -1.05700], // W_NH_0_0, N_NH_0_1
                        [-1.05700, -1.05700], // W_NH_1_0, N_NH_1_1
                        [-1.05700, -1.05700], // W_NH_2_0, N_NH_2_1
                        [-1.05700, -1.05700], // W_NH_3_0, N_NH_3_1
                        [-1.05700, -1.05700] // W_NH_4_0, N_NH_4_1
                    ], // poids des neurones cachés
                    [0, 0] // neurones de sortie
                )
            } else {
                this.nn = new NN(
                    [0, 0, 0], // neurones d'entrée
                    [
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NI_0_0, W_NI_0_1, W_NI_0_2, W_NI_0_3, W_NI_0_4 
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NI_1_0, W_NI_1_1, W_NI_1_2, W_NI_1_3, W_NI_1_4
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1] // W_NI_2_0, W_NI_2_1, W_NI_2_2, W_NI_2_3, W_NI_2_4
                    ], // poids des neurones d'entrée
                    [0, 0, 0, 0, 0], // neurones cachés
                    [
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_0_0, N_NH_0_1
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_1_0, N_NH_1_1
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_2_0, N_NH_2_1
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_3_0, N_NH_3_1
                        [(Math.random() * 2) - 1, (Math.random() * 2) - 1] // W_NH_4_0, N_NH_4_1
                    ], // poids des neurones cachés
                    [0, 0] // neurones de sortie
                )
            }
        }
    }

    distance = (oBall) => {
        return this.pos.distanceTo(oBall.pos)
    }

    relativeSpeed = (oBall) => {
        let thisVelocity = new THREE.Vector2(Math.cos(this.angle), Math.sin(this.angle)).multiplyScalar(this.speed)
        let oBallVelocity = new THREE.Vector2(Math.cos(oBall.angle), Math.sin(oBall.angle)).multiplyScalar(oBall.speed)
        let relativeVelocity = thisVelocity.clone().sub(oBallVelocity)
        let dotProduct = relativeVelocity.dot(this.pos.clone().sub(oBall.pos))
        if (dotProduct < 0) return -relativeVelocity.length()
        else return relativeVelocity.length()
    }

    sexualityOf = (oBall) => {
        if (oBall.sex == "F") return 1
        else if (oBall.sex == "M") return -1
    }
}

// FUNCTION DEF
const generateSphere = (sex, attractiveness, strength, speed, scene, NN) => {
    const ball = new Ball(
        new THREE.Vector3(Math.random() * area - (area / 2), .2, Math.random() * area - (area / 2)),
        Math.random() * (2 * Math.PI),
        undefined, // on génère le mesh juste après
        sex,
        attractiveness,
        strength,
        speed,
        NN
    )

    ball.mesh = new THREE.Mesh(new THREE.SphereGeometry(ball.strength / 4 + .2, 8, 8), strengthMaterial)

    const attractivenessBall = new THREE.Mesh(new THREE.SphereGeometry(ball.attractiveness / 4 + .2, 8, 8), attractivenessMaterial)
    attractivenessBall.position.set(0, .5, 0);
    ball.mesh.add(attractivenessBall)
    attractivenessBall.castShadow = false
    attractivenessBall.receiveShadow = false

    const sexGeometry = new THREE.Mesh(ball.sex == "M" ? maleGeometry : femaleGeometry, ball.sex == "M" ? maleHeadMaterial : femaleHeadMaterial)
    sexGeometry.position.set(0, 1, 0)
    ball.mesh.add(sexGeometry)
    sexGeometry.castShadow = false
    sexGeometry.receiveShadow = false

    ball.mesh.castShadow = false;
    ball.mesh.receiveShadow = false;

    ball.mesh.add(new THREE.AxesHelper(1))

    scene.add(ball.mesh)

    console.log("🎉", ball.id, "is born!")

    return ball
}

const crossover = (super1, super2, scene, spheres) => {
    const kid1Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness,
        strength: random3() < .5 ? super1.strength : super2.strength,
        speed: random3() < .5 ? super1.speed : super2.speed,
    }

    const kid2Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness,
        strength: random3() < .5 ? super1.strength : super2.strength,
        speed: random3() < .5 ? super1.speed : super2.speed
    }

    if (NN_WEIGHT_METHOD != "trained") {
        kid1Stats.nn = {
            w: [
                [random3() < .5 ? super1.nn.w[0][0] : super2.nn.w[0][0], random3() < .5 ? super1.nn.w[0][1] : super2.nn.w[0][1], random3() < .5 ? super1.nn.w[0][2] : super2.nn.w[0][2], random3() < .5 ? super1.nn.w[0][3] : super2.nn.w[0][3], random3() < .5 ? super1.nn.w[0][4] : super2.nn.w[0][4]],
                [random3() < .5 ? super1.nn.w[1][0] : super2.nn.w[1][0], random3() < .5 ? super1.nn.w[1][1] : super2.nn.w[1][1], random3() < .5 ? super1.nn.w[1][2] : super2.nn.w[1][2], random3() < .5 ? super1.nn.w[1][3] : super2.nn.w[1][3], random3() < .5 ? super1.nn.w[1][4] : super2.nn.w[1][4]],
                [random3() < .5 ? super1.nn.w[2][0] : super2.nn.w[2][0], random3() < .5 ? super1.nn.w[2][1] : super2.nn.w[2][1], random3() < .5 ? super1.nn.w[2][2] : super2.nn.w[2][2], random3() < .5 ? super1.nn.w[2][3] : super2.nn.w[2][3], random3() < .5 ? super1.nn.w[2][4] : super2.nn.w[2][4]]
            ],
            wh: [
                [random3() < .5 ? super1.nn.wh[0][0] : super2.nn.wh[0][0], random3() < .5 ? super1.nn.wh[0][1] : super2.nn.wh[0][1]],
                [random3() < .5 ? super1.nn.wh[1][0] : super2.nn.wh[1][0], random3() < .5 ? super1.nn.wh[1][1] : super2.nn.wh[1][1]],
                [random3() < .5 ? super1.nn.wh[2][0] : super2.nn.wh[2][0], random3() < .5 ? super1.nn.wh[2][1] : super2.nn.wh[2][1]],
                [random3() < .5 ? super1.nn.wh[3][0] : super2.nn.wh[3][0], random3() < .5 ? super1.nn.wh[3][1] : super2.nn.wh[3][1]],
                [random3() < .5 ? super1.nn.wh[4][0] : super2.nn.wh[4][0], random3() < .5 ? super1.nn.wh[4][1] : super2.nn.wh[4][1]]
            ]
        }

        kid2Stats.nn = {
            w: [
                [random3() < .5 ? super1.nn.w[0][0] : super2.nn.w[0][0], random3() < .5 ? super1.nn.w[0][1] : super2.nn.w[0][1], random3() < .5 ? super1.nn.w[0][2] : super2.nn.w[0][2], random3() < .5 ? super1.nn.w[0][3] : super2.nn.w[0][3], random3() < .5 ? super1.nn.w[0][4] : super2.nn.w[0][4]],
                [random3() < .5 ? super1.nn.w[1][0] : super2.nn.w[1][0], random3() < .5 ? super1.nn.w[1][1] : super2.nn.w[1][1], random3() < .5 ? super1.nn.w[1][2] : super2.nn.w[1][2], random3() < .5 ? super1.nn.w[1][3] : super2.nn.w[1][3], random3() < .5 ? super1.nn.w[1][4] : super2.nn.w[1][4]],
                [random3() < .5 ? super1.nn.w[2][0] : super2.nn.w[2][0], random3() < .5 ? super1.nn.w[2][1] : super2.nn.w[2][1], random3() < .5 ? super1.nn.w[2][2] : super2.nn.w[2][2], random3() < .5 ? super1.nn.w[2][3] : super2.nn.w[2][3], random3() < .5 ? super1.nn.w[2][4] : super2.nn.w[2][4]]
            ],
            wh: [
                [random3() < .5 ? super1.nn.wh[0][0] : super2.nn.wh[0][0], random3() < .5 ? super1.nn.wh[0][1] : super2.nn.wh[0][1]],
                [random3() < .5 ? super1.nn.wh[1][0] : super2.nn.wh[1][0], random3() < .5 ? super1.nn.wh[1][1] : super2.nn.wh[1][1]],
                [random3() < .5 ? super1.nn.wh[2][0] : super2.nn.wh[2][0], random3() < .5 ? super1.nn.wh[2][1] : super2.nn.wh[2][1]],
                [random3() < .5 ? super1.nn.wh[3][0] : super2.nn.wh[3][0], random3() < .5 ? super1.nn.wh[3][1] : super2.nn.wh[3][1]],
                [random3() < .5 ? super1.nn.wh[4][0] : super2.nn.wh[4][0], random3() < .5 ? super1.nn.wh[4][1] : super2.nn.wh[4][1]]
            ]
        }
    }

    if (kid1Stats.attractiveness == super1.attractiveness) kid2Stats.attractiveness = super2.attractiveness
    else kid2Stats.attractiveness = super1.attractiveness

    if (kid1Stats.strength == super1.strength) kid2Stats.strength = super2.strength
    else kid2Stats.strength = super1.strength

    if (kid1Stats.speed == super1.speed) kid2Stats.speed = super2.speed
    else kid2Stats.speed = super1.speed

    let kid1 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid1Stats.attractiveness, kid1Stats.strength, kid1Stats.speed, scene, kid1Stats.nn)
    let kid2 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid2Stats.attractiveness, kid2Stats.strength, kid2Stats.speed, scene, kid2Stats.nn)

    Math.floor(Math.random()) < .5 ? mutation(kid1) : mutation(kid2)

    if (NN_WEIGHT_METHOD != "trained") {
        NNMutation(kid1)
        NNMutation(kid2)
    }

    spheres.push(kid1)
    spheres.push(kid2)

    super1.life < maxHP - 1000 ? super1.life += 1000 : super1.life = maxHP
    super2.life < maxHP - 1000 ? super2.life += 1000 : super2.life = maxHP
}

const fight = (ball1, ball2, index1, index2, scene, spheres) => {
    if (ball1.strength > ball2.strength) {
        spheres.splice(index2, 1)
        scene.remove(ball2.mesh)
        console.log("🪓", ball2.id, "was slain by", ball1.id)
        ball1.life < maxHP - 500 ? ball1.life += 500 : ball1.life = maxHP
    } else {
        spheres.splice(index1, 1)
        scene.remove(ball1.mesh)
        console.log("🪓", ball1.id, "was slain by", ball2.id)
        ball2.life < maxHP - 500 ? ball2.life += 500 : ball2.life = maxHP
    }
}

const death = (ball, index, scene, shperes) => {
    shperes.splice(index, 1)
    scene.remove(ball.mesh)
    console.log("💀", ball.id, "died of old age")
}

const enhanceAttractiveness = (ball1, ball2) => {
    if (ball1.attractiveness < ball2.attractiveness) {
        console.log("👏", ball2.id, "makes", ball1.id, "more attractive")
        ball1.attractiveness += attractivenessBoost
        ball2.life < maxHP - 20 ? ball2.life += 20 : ball2.life = maxHP
    } else {
        console.log("👏", ball1.id, "makes", ball2.id, "more attractive")
        ball2.attractiveness += attractivenessBoost
        ball1.life < maxHP - 20 ? ball1.life += 20 : ball1.life = maxHP
    }

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

const NNMutation = (kid) => {
    const layerIndex = Math.floor(Math.random() * 2)
    if (layerIndex == 0) {
        const weightIndex = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 5)] // [0~2, 0~4]
        kid.nn.w[weightIndex[0]][weightIndex[1]] = random3()
    } else if (layerIndex == 1) {
        const weightIndex = [Math.floor(Math.random() * 5), Math.floor(Math.random() * 1)] // [0~4, 0~1]
        kid.nn.wh[weightIndex[0]][weightIndex[1]] = random3()
    }
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

function moveSpheres(spheres, hitMeshs) {
    for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];
        const speed = ball.speed / 10 + 0.01;
        ball.pos.x += Math.cos(ball.angle) * speed;
        ball.pos.z += Math.sin(ball.angle) * speed;

        // // console.log(targetMeshs)
        // hitMeshs.map(mesh => {
        //     const meshCopy = mesh.clone()
        //     meshCopy.position.y = 0
        //     if (ball.mesh.position.distanceTo(meshCopy.position) < 5) {
        //         // Collision détectée ! Fais quelque chose de super cool ici (´｡• ω •｡`) ♡
        //         // console.log("Kya~! Collision avec le Mesh cible!");
        //         let angle = Math.atan2(ball.pos.z, ball.pos.x)
        //         ball.angle = angle + Math.PI + ((Math.random() - .5) / 2)
        //     }
        // })

        if (ball.pos.distanceTo(new THREE.Vector3(0, .2, 0)) > area) {
            let angle = Math.atan2(ball.pos.z, ball.pos.x)
            ball.angle = angle + Math.PI + ((Math.random() - .5) / 2)
        }

        // Update the position of the mesh
        ball.mesh.position.copy(ball.pos);
        ball.mesh.rotation.y = -ball.angle
    }
}

function drawSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        let sphere = spheres[i];
        sphere.mesh.position.copy(sphere.pos);
    }
}

function NNchange(ball1, ball2) {
    ball1.nn.ni[0] = ball1.distance(ball2) / 52 // 52 étant la distance max mesurable en théorie ça permet d'avoir une valeur entre 0 et 1
    ball1.nn.ni[1] = ball1.relativeSpeed(ball2) / (maxSpeed * 2) // la vitesse relative maximale entre deux individus est de 2 * maxspeed cela permet des valeurs entre -1 et 1
    ball1.nn.ni[2] = ball1.sexualityOf(ball2)

    ball1.nn.nh[0] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][0] + ball1.nn.ni[1] * ball1.nn.w[1][0] + ball1.nn.ni[2] * ball1.nn.w[2][0]))   
    ball1.nn.nh[1] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][1] + ball1.nn.ni[1] * ball1.nn.w[1][1] + ball1.nn.ni[2] * ball1.nn.w[2][1]))
    ball1.nn.nh[2] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][2] + ball1.nn.ni[1] * ball1.nn.w[1][2] + ball1.nn.ni[2] * ball1.nn.w[2][2]))
    ball1.nn.nh[3] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][3] + ball1.nn.ni[1] * ball1.nn.w[1][3] + ball1.nn.ni[2] * ball1.nn.w[2][3]))
    ball1.nn.nh[4] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][4] + ball1.nn.ni[1] * ball1.nn.w[1][4] + ball1.nn.ni[2] * ball1.nn.w[2][4]))

    ball1.nn.no[0] = 1/(1+Math.exp(ball1.nn.nh[0] * ball1.nn.wh[0][0] + ball1.nn.nh[1] * ball1.nn.wh[1][0] * ball1.nn.nh[2] * ball1.nn.wh[2][0] + ball1.nn.nh[3] * ball1.nn.wh[3][0] + ball1.nn.nh[4] * ball1.nn.wh[4][0]))
    ball1.nn.no[1] = 1/(1+Math.exp(ball1.nn.nh[0] * ball1.nn.wh[0][1] + ball1.nn.nh[1] * ball1.nn.wh[1][1] * ball1.nn.nh[2] * ball1.nn.wh[2][1] + ball1.nn.nh[3] * ball1.nn.wh[3][1] + ball1.nn.nh[4] * ball1.nn.wh[4][1]))

    backPropagation(ball1)
}

function backPropagation(ball) {

    // dnoi = oi * (1-oi) * (ti-oi) | output neuron
    // dnhi = oi * (1-oi) * (S(dnok * whk)) | hidden neuron

    // dwij = n*dj*oi

    const io = ball.nn.ni
    const oo = ball.nn.no
    const ho = ball.nn.nh
    const hw = ball.nn.wh

    const eta = 0.1 // learning rate

    let target = []

    if (ball.nn.ni[0] < 0.5 && ball.nn.ni[1] < 0 && ball.nn.ni[2] == 1) { // cas d'un personnage se rapprochant d'une femelle
        target = [1, 0] // on s'attend a ce que le personnage accélère et ne tourne plus
        const error = [target[0]-oo[0], target[1]-oo[1]]
    } else if (ball.nn.ni[0] < 0.5 && ball.nn.ni[1] > 0 && ball.nn.ni[2] == 1) { // cas d'un personnage s'éloignant d'une femelle
        target = [-1, 1] // on s'attend à ce que le persommage ralentisse et tourne
        const error = [target[0]-oo[0], target[1]-oo[1]]
    } else if (ball.nn.ni[0] < 0.5 && ball.nn.ni[1] < 0 && ball.nn.ni[2] == -1) { // cas d'un personnage qui se rapproche d'un mâle
        target = [-1, -1] // on s'attend à ce que le personnage ralentisse et tourne
        const error = [target[0]-oo[0], target[1]-oo[1]]
    } else { // dans tous les autres cas
        target = [0, 0] // on s'attend à ce que le personnage continue à se déplacer comme avant
        const error = [target[0]-oo[0], target[1]-oo[1]]
    }

    // modification des poids des neurones cachés (ceux qui vont vers les outputs)
    const dno6 = oo[0] * (1-oo[0]) * (target[0]-oo[0]) // no 0
    const dno7 = oo[1] * (1-oo[1]) * (target[0]-oo[1]) // no 1

    // modification des poids des neurones d'entrée (ceux qui vont vers la couche cachée)
    const dnh1 = ho[0] * (1-ho[0]) * ((dno6*hw[0][0]) + (dno7*hw[0][1])) // nh 0
    const dnh2 = ho[1] * (1-ho[1]) * ((dno6*hw[1][0]) + (dno7*hw[1][1])) // nh 1
    const dnh3 = ho[2] * (1-ho[2]) * ((dno6*hw[2][0]) + (dno7*hw[2][1])) // nh 2
    const dnh4 = ho[3] * (1-ho[3]) * ((dno6*hw[3][0]) + (dno7*hw[3][1])) // nh 3
    const dnh5 = ho[4] * (1-ho[4]) * ((dno6*hw[4][0]) + (dno7*hw[4][1])) // nh 4

    // calcul des deltas
    const dwno00 = eta * ho[0] * dno6 
    const dwno01 = eta * ho[0] * dno7 

    const dwno10 = eta * ho[1] * dno6
    const dwno11 = eta * ho[1] * dno7

    const dwno20 = eta * ho[2] * dno6
    const dwno21 = eta * ho[2] * dno7

    const dwno30 = eta * ho[3] * dno6
    const dwno31 = eta * ho[3] * dno7

    const dwno40 = eta * ho[4] * dno6
    const dwno41 = eta * ho[4] * dno7

    const dwnh00 = eta * io[0] * dnh1
    const dwnh01 = eta * io[0] * dnh2
    const dwnh02 = eta * io[0] * dnh3
    const dwnh03 = eta * io[0] * dnh4
    const dwnh04 = eta * io[0] * dnh5

    const dwnh10 = eta * io[1] * dnh1
    const dwnh11 = eta * io[1] * dnh2
    const dwnh12 = eta * io[1] * dnh3
    const dwnh13 = eta * io[1] * dnh4
    const dwnh14 = eta * io[1] * dnh5

    const dwnh20 = eta * io[2] * dnh1
    const dwnh21 = eta * io[2] * dnh2
    const dwnh22 = eta * io[2] * dnh3
    const dwnh23 = eta * io[2] * dnh4
    const dwnh24 = eta * io[2] * dnh5

    // changement des poids
    ball.nn.w[0][0] += dwnh00
    ball.nn.w[0][1] += dwnh01
    ball.nn.w[0][2] += dwnh02
    ball.nn.w[0][3] += dwnh03
    ball.nn.w[0][4] += dwnh04

    ball.nn.w[1][0] += dwnh10
    ball.nn.w[1][1] += dwnh11
    ball.nn.w[1][2] += dwnh12
    ball.nn.w[1][3] += dwnh13
    ball.nn.w[1][4] += dwnh14

    ball.nn.w[2][0] += dwnh20
    ball.nn.w[2][1] += dwnh21
    ball.nn.w[2][2] += dwnh22
    ball.nn.w[2][3] += dwnh23
    ball.nn.w[2][4] += dwnh24

    ball.nn.wh[0][0] += dwno00
    ball.nn.wh[0][1] += dwno01

    ball.nn.wh[1][0] += dwno10
    ball.nn.wh[1][1] += dwno11

    ball.nn.wh[2][0] += dwno20
    ball.nn.wh[2][1] += dwno21

    ball.nn.wh[3][0] += dwno30
    ball.nn.wh[3][1] += dwno31

    ball.nn.wh[4][0] += dwno40
    ball.nn.wh[4][1] += dwno41
}


function checkCollisions(spheres, scene) {
    for (let i = 0; i < spheres.length; i++) {
        for (let j = 0; j < spheres.length; j++) {
            if (i != j) {
                let ball1 = spheres[i];
                let ball2 = spheres[j];

                const distance = ball1.pos.distanceTo(ball2.pos);
                const sumRadii = ball1.mesh.geometry.parameters.radius + ball2.mesh.geometry.parameters.radius;

                NNchange(ball1, ball2)
                    // console.log(ball1.nn.no)

                if (ball1.speed > minSpeed && ball1.speed < maxSpeed) ball1.speed += ball1.nn.no[0] / 1000;
                ball1.angle += ball1.nn.no[1] / 50

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










// // ENTRAINEMENT DU NN

// function NNForward(ball, inputs) {
//     ball.nn.ni[0] = inputs[0]
//     ball.nn.ni[1] = inputs[1]
//     ball.nn.ni[2] = inputs[2]

//     for (let i = 0; i < ball.nn.nh.length; i++) {
//         ball.nn.nh[i] = 0;
//         for (let j = 0; j < ball.nn.ni.length; j++) {
//             ball.nn.nh[i] += ball.nn.ni[j] * ball.nn.w[j][i];
//         }
//         ball.nn.nh[i] = sigmoid(ball.nn.nh[i]); // Applique une fonction d'activation, par exemple sigmoid
//     }

//     for (let i = 0; i < ball.nn.no.length; i++) {
//         ball.nn.no[i] = 0;
//         for (let j = 0; j < ball.nn.nh.length; j++) {
//             ball.nn.no[i] += ball.nn.nh[j] * ball.nn.wh[j][i];
//         }
//         ball.nn.no[i] = sigmoid(ball.nn.no[i]); // Applique une fonction d'activation, par exemple sigmoid
//     }

//     return ball.nn.no
// }

// function sigmoid(x) {
//     return 1 / (1 + Math.exp(-x));
// }


// function NNBackward(ball, loss) {
//     // Rétropropagation du gradient pour ajuster les poids du réseau

//     // Calcul des gradients pour les poids entre les neurones de sortie et les neurones cachés
//     for (let i = 0; i < ball.nn.wh.length; i++) {
//         for (let j = 0; j < ball.nn.wh[i].length; j++) {
//             let delta = ball.nn.no[j] * (1 - ball.nn.no[j]) * loss; // Dérivée de la fonction d'activation
//             ball.nn.wh[i][j] -= ball.nn.nh[i] * delta;
//         }
//     }

//     // Calcul des gradients pour les poids entre les neurones d'entrée et les neurones caché
//     for (let i = 0; i < ball.nn.w.length; i++) {
//         for (let j = 0; j < ball.nn.w[i].length; j++) {
//             let sum = 0;
//             for (let k = 0; k < ball.nn.no.length; k++) {
//                 sum += ball.nn.wh[j][k] * (ball.nn.no[k] * (1 - ball.nn.no[k]) * loss);
//             }
//             let delta = ball.nn.nh[j] * (1 - ball.nn.nh[j]) * sum; // Dérivée de la fonction d'activation
//             ball.nn.w[i][j] -= ball.nn.ni[i] * delta;
//         }
//     }
// }

// function trainNetwork(ball, inputs, expectedOutputs, learningRate) {
//     // Forward pass
//     let output = NNForward(ball, inputs);

//     // Calculate loss
//     let loss = calculateLoss(output, expectedOutputs);

//     // Backward pass
//     NNBackward(ball, loss);

//     // Update weights using gradient descent
//     updateWeights(ball, learningRate);
// }

// function calculateLoss(output, expected) {
//     // Calcul de la perte (loss), par exemple, erreur quadratique moyenne
//     let sum = 0;
//     for (let i = 0; i < output.length; i++) {
//         sum += Math.pow(output[i] - expected[i], 2);
//     }
//     return sum / output.length;
// }

// function updateWeights(ball, learningRate) {
//     // Mise à jour des poids du réseau en utilisant le gradient descent

//     // Mise à jour des poids entre les neurones d'entrée et les neurones cachés
//     for (let i = 0; i < ball.nn.w.length; i++) {
//         for (let j = 0; j < ball.nn.w[i].length; j++) {
//             ball.nn.w[i][j] -= learningRate * ball.nn.w[i][j];
//         }
//     }

//     // Mise à jour des poids entre les neurones de sortie et les neurones cachés
//     for (let i = 0; i < ball.nn.wh.length; i++) {
//         for (let j = 0; j < ball.nn.wh[i].length; j++) {
//             ball.nn.wh[i][j] -= learningRate * ball.nn.wh[i][j];
//         }
//     }
// }



export { moveSpheres, checkCollisions, generateSphere, death }