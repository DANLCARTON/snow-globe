import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { random3 } from "./max.js"

// VARIABLES
let globalBallId = 0;

const area = 25
const sexDistrib = 0.48
const minAttractivenessNecessary = 0.4
const attractivenessBoost = 0.001
const maxSpeed = 2
const minSpeed = 0.1


const attractivenessMaterial = new THREE.MeshPhongMaterial({ color: 0xffdddd })
const strengthMaterial = new THREE.MeshPhongMaterial({ color: 0xddffdd })
const basicMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
const maleGeometry = new THREE.BoxGeometry(.4, .4, .4)
const femaleGeometry = new THREE.SphereGeometry(.2, 8, 8)

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
        this.nn = new NN(
            [0, 0, 0], // neurones d'entrée
            [
                [(Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1], // W_NI_0_0, W_NI_0_1, W_NI_0_2, W_NI_0_3, W_NI_0_4 
                [(Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1], // W_NI_1_0, W_NI_1_1, W_NI_1_2, W_NI_1_3, W_NI_1_4
                [(Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1, (Math.random()*2)-1] // W_NI_2_0, W_NI_2_1, W_NI_2_2, W_NI_2_3, W_NI_2_4
            ], // poids des neurones d'entrée
            [0, 0, 0, 0, 0], // neurones cachés
            [
                [(Math.random()*2)-1, (Math.random()*2)-1], // W_NH_0_0, N_NH_0_1
                [(Math.random()*2)-1, (Math.random()*2)-1], // W_NH_1_0, N_NH_1_1
                [(Math.random()*2)-1, (Math.random()*2)-1], // W_NH_2_0, N_NH_2_1
                [(Math.random()*2)-1, (Math.random()*2)-1], // W_NH_3_0, N_NH_3_1
                [(Math.random()*2)-1, (Math.random()*2)-1] // W_NH_4_0, N_NH_4_1
            ], // poids des neurones cachés
            [0, 0] // neurones de sortie
        )
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
    
    // NNForward = (oBall) => {

    //     let simulatedNI = [this.distance(oBall), this.relativeSpeed(oBall), this.sexualityOf(oBall)]
    //     console.log(simulatedNI[3]*this.nn.w[0][3] , simulatedNI[1]*this.nn.w[1][3] , simulatedNI[2]*this.nn.w[2][3],)
    //     let simulatedNH = [
    //         simulatedNI[0]*this.nn.w[0][0] + simulatedNI[1]*this.nn.w[1][0] + simulatedNI[2]*this.nn.w[2][0],
    //         simulatedNI[0]*this.nn.w[0][1] + simulatedNI[1]*this.nn.w[1][1] + simulatedNI[2]*this.nn.w[2][1],
    //         simulatedNI[0]*this.nn.w[0][2] + simulatedNI[1]*this.nn.w[1][2] + simulatedNI[2]*this.nn.w[2][2],
    //         simulatedNI[0]*this.nn.w[0][3] + simulatedNI[1]*this.nn.w[1][3] + simulatedNI[2]*this.nn.w[2][3],
    //         simulatedNI[0]*this.nn.w[0][4] + simulatedNI[1]*this.nn.w[1][4] + simulatedNI[2]*this.nn.w[2][4]
    //     ]
    //     let simulatedNO = [
    //         simulatedNH[0]*this.nn.wh[0][0] + simulatedNH[1]*this.nn.wh[1][0] + simulatedNH[2]*this.nn.wh[2][0] + simulatedNH[3]*this.nn.wh[3][0] + simulatedNH[4]*this.nn.wh[4][0],
    //         simulatedNH[1]*this.nn.wh[0][1] + simulatedNH[1]*this.nn.wh[1][1] + simulatedNH[2]*this.nn.wh[2][1] + simulatedNH[3]*this.nn.wh[3][1] + simulatedNH[4]*this.nn.wh[4][1]
    //     ]
    //     console.log("simulatedNI : " +simulatedNI)
    //     console.log("simulatedNH : " +simulatedNH)
    //     console.log("simulatedNO : " +simulatedNO)
    //     return simulatedNO
    // }

    // NNBackward = (cost) => {
    //     let outputError = this.NNForward.map((o, i) => o)
    // }
}

// FUNCTION DEF
const generateSphere = (sex, attractiveness, strength, speed, scene) => {
    const ball = new Ball(
        new THREE.Vector3(Math.random()*area-(area/2), .2, Math.random()*area-(area/2)),
        Math.random() * (2 * Math.PI),
        undefined,
        sex,
        attractiveness,
        strength,
        speed
    )

    ball.mesh = new THREE.Mesh(new THREE.SphereGeometry(ball.strength / 4 + .2, 8, 8), strengthMaterial)

    const attractivenessBall = new THREE.Mesh(new THREE.SphereGeometry(ball.attractiveness / 4 + .2, 8, 8), attractivenessMaterial)
    attractivenessBall.position.set(0, .5, 0);
    ball.mesh.add(attractivenessBall)
    attractivenessBall.castShadow = false
    attractivenessBall.receiveShadow = false

    const sexGeometry = new THREE.Mesh(ball.sex == "M" ? maleGeometry : femaleGeometry, basicMaterial)
    sexGeometry.position.set(0, 1, 0)
    ball.mesh.add(sexGeometry)
    sexGeometry.castShadow = false
    sexGeometry.receiveShadow = false

    ball.mesh.castShadow = false;
    ball.mesh.receiveShadow = false;

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
    for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];
        const speed = ball.speed / 10 + 0.01;
        ball.pos.x += Math.cos(ball.angle) * speed;
        ball.pos.z += Math.sin(ball.angle) * speed;

        if (ball.pos.distanceTo(new THREE.Vector3(0, .2, 0)) > area) {
            let angle = Math.atan2(ball.pos.z, ball.pos.x)
            ball.angle = angle + Math.PI + ((Math.random()-.5)/2)
        }

        // Update the position of the mesh
        ball.mesh.position.copy(ball.pos);
    }
}

function drawSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        let sphere = spheres[i];
        sphere.mesh.position.copy(sphere.pos);
    }
}

function NNchange(ball1, ball2) {
    ball1.nn.ni[0] = ball1.distance(ball2)
    ball1.nn.ni[1] = ball1.relativeSpeed(ball2)
    ball1.nn.ni[2] = ball1.sexualityOf(ball2)

    ball1.nn.nh[0] = ball1.nn.ni[0]*ball1.nn.w[0][0] + ball1.nn.ni[1]*ball1.nn.w[1][0] + ball1.nn.ni[2]*ball1.nn.w[2][0]
    ball1.nn.nh[1] = ball1.nn.ni[0]*ball1.nn.w[0][1] + ball1.nn.ni[1]*ball1.nn.w[1][1] + ball1.nn.ni[2]*ball1.nn.w[2][1]
    ball1.nn.nh[2] = ball1.nn.ni[0]*ball1.nn.w[0][2] + ball1.nn.ni[1]*ball1.nn.w[1][2] + ball1.nn.ni[2]*ball1.nn.w[2][2]
    ball1.nn.nh[3] = ball1.nn.ni[0]*ball1.nn.w[0][3] + ball1.nn.ni[1]*ball1.nn.w[1][3] + ball1.nn.ni[2]*ball1.nn.w[2][3]
    ball1.nn.nh[4] = ball1.nn.ni[0]*ball1.nn.w[0][4] + ball1.nn.ni[1]*ball1.nn.w[1][4] + ball1.nn.ni[2]*ball1.nn.w[2][4]

    ball1.nn.no[0] = ball1.nn.nh[0]*ball1.nn.wh[0][0] + ball1.nn.nh[1]*ball1.nn.wh[1][0] * ball1.nn.nh[2]*ball1.nn.wh[2][0] + ball1.nn.nh[3]*ball1.nn.wh[3][0] + ball1.nn.nh[4]*ball1.nn.wh[4][0]
    ball1.nn.no[1] = ball1.nn.nh[0]*ball1.nn.wh[0][1] + ball1.nn.nh[1]*ball1.nn.wh[1][1] * ball1.nn.nh[2]*ball1.nn.wh[2][1] + ball1.nn.nh[3]*ball1.nn.wh[3][1] + ball1.nn.nh[4]*ball1.nn.wh[4][1]
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

                if (ball1.speed > minSpeed && ball1.speed < maxSpeed) ball1.speed += ball1.nn.no[0]/1000;
                ball1.angle += ball1.nn.no[1]/500


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

export { moveSpheres, checkCollisions, generateSphere, costFunction }