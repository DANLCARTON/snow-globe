// LIVING BALLS - BIOEVOLUTION, RESEAU DE NEURONES, NEUROEVOLUTION
// PETITS PERSONNAGES EVOLUANT DANS LA SCENE
// (ILS SONT SOUVENT APPELÉS SPHERES OU BALLS DANS LES VARIABLES)

import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import { random3 } from "./max.js"

// PARAMETRES URL

// SETUP

// Importation des textures
const snowmanTexture = new THREE.TextureLoader().load("./assets/snowman")
snowmanTexture.wrapS = THREE.RepeatWrapping;
snowmanTexture.wrapT = THREE.RepeatWrapping;
snowmanTexture.repeat.set(1, 1)

const snowmanZoomedOutTexture = new THREE.TextureLoader().load("./assets/snowman-zoomed-out")
snowmanZoomedOutTexture.wrapS = THREE.RepeatWrapping;
snowmanZoomedOutTexture.wrapT = THREE.RepeatWrapping;
snowmanZoomedOutTexture.repeat.set(1, 1)

// Création des matériaux
const attractivenessMaterial = new THREE.MeshPhongMaterial({ color: 0xffeeee })
const strengthMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeff })
// const basicMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: snowmanTexture })
const maleHeadMaterial = [
    new THREE.MeshPhongMaterial({ map: snowmanTexture }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
]
const femaleHeadMaterial = new THREE.MeshPhongMaterial({ map: snowmanZoomedOutTexture })

// Création des géométries pour la tête des personnages
const maleGeometry = new THREE.BoxGeometry(.4, .4, .4)
const femaleGeometry = new THREE.SphereGeometry(.2, 8, 8)

// PARAMETRES VARIABLES
let globalBallId = 0; // permet de donner à chaque personange un id unique

const area = 25 // Rayon de l'aire dans laquelle les personnages évoluent
const sexDistrib = 0.48 // Probabilité, lors de la naissance d'un nouveaux personnage, qu'il soit un mâle
const minAttractivenessNecessary = 0.4 // Chaque personnage à une attractivité, si la différence d'attractivité entre un mâle et une femelle est inférieur à la valeur ils pourront se reproduire
const attractivenessBoost = 0.001 // Lorsque deux personnages femelles entrent en contact, elles augmentent leurs attractivités respectives 
const maxSpeed = 2 // Vitesse maximale des personnages
const minSpeed = 0.1 // Vitesse minimale des personnages
const maxHP = 1500 // Points de vie maximum des personnages

// CLASS DEF
class NN { // Classe du réseau de neurones - RESEAU DE NEURONES
    // constructor(ni, w, no, nh, nhw) {
    constructor(ni, w, nh, wh, no) {
        this.ni = ni // neurones entrée
        this.w = w // poids neurones 
        this.no = no // neurones sortie
        this.nh = nh // neurones cachés
        this.wh = wh // poids des neurones cachés
    }
}

class Ball { // Classe des personnages
    constructor(pos, angle, mesh, sex, attractiveness, strength, speed, inheritedNNWeights) {
        this.id = globalBallId // Id unique
        globalBallId++
        this.pos = pos; // Position
        this.angle = angle; // Angle
        this.mesh = mesh; // Modèle 3D
        this.sex = sex; // "M" ou "F"
        this.attractiveness = attractiveness // Attractivité
        this.strength = strength // Force
        this.speed = speed // Vitesse
        this.life = maxHP // Points de vie

        // RESEAU DE NEURONES
        if (inheritedNNWeights !== undefined) { // Si le personnage hérite du réseau de ses parents
            this.nn = new NN(
                [0, 0, 0], // Neurones d'entrée
                inheritedNNWeights.w, // Poids des neurones d'entrée hérités
                [0, 0, 0, 0, 0], // Neurones cachés
                inheritedNNWeights.wh, // Poids des neuroes cachés
                [0, 0] // Neurones de sortie
            )
        } else { // Si le personnage est créé au départ de la simulation
            this.nn = new NN(
                [0, 0, 0], // neurones d'entrée
                [
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NI_0_0, W_NI_0_1, W_NI_0_2, W_NI_0_3, W_NI_0_4 
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NI_1_0, W_NI_1_1, W_NI_1_2, W_NI_1_3, W_NI_1_4
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1] // W_NI_2_0, W_NI_2_1, W_NI_2_2, W_NI_2_3, W_NI_2_4
                ], // poids des neurones d'entrée aléatoires
                [0, 0, 0, 0, 0], // neurones cachés
                [
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_0_0, N_NH_0_1
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_1_0, N_NH_1_1
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_2_0, N_NH_2_1
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1], // W_NH_3_0, N_NH_3_1
                    [(Math.random() * 2) - 1, (Math.random() * 2) - 1] // W_NH_4_0, N_NH_4_1
                ], // poids des neurones cachés aléatoires
                [0, 0] // neurones de sortie
            )
        }
    }

    distance = (oBall) => { // Fonction pour calculer la distance entre un personnage et un autre
        return this.pos.distanceTo(oBall.pos)
    }

    relativeSpeed = (oBall) => { // Fonction pour calculer la vitesse relative entre deux personnage
        let thisVelocity = new THREE.Vector2(Math.cos(this.angle), Math.sin(this.angle)).multiplyScalar(this.speed)
        let oBallVelocity = new THREE.Vector2(Math.cos(oBall.angle), Math.sin(oBall.angle)).multiplyScalar(oBall.speed)
        let relativeVelocity = thisVelocity.clone().sub(oBallVelocity)
        let dotProduct = relativeVelocity.dot(this.pos.clone().sub(oBall.pos))
        if (dotProduct < 0) return -relativeVelocity.length()
        else return relativeVelocity.length()
    }

    sexualityOf = (oBall) => { // Fonction permettant à un personnage de savoir le sexe d'un autre
        if (oBall.sex == "F") return 1
        else if (oBall.sex == "M") return -1
    }
}

// FUNCTION DEF
const generateSphere = (sex, attractiveness, strength, speed, scene, NN) => { // Fonction permettant de générer un nouveau personnage
    const ball = new Ball( // Nouvelle instance de Ball
        new THREE.Vector3(Math.random() * area - (area / 2), .2, Math.random() * area - (area / 2)), // Position aléatoire
        Math.random() * (2 * Math.PI), // Angle aléatoire
        undefined, // Mesh non défini, on fait ça juste après
        sex, // Sexe passé en paramètre de la fonction
        attractiveness, // Attractivité passée en paramètre de la fonction
        strength, // Force passée en paramètre de la fonction
        speed, // Vitesse passée en paramètre de la fonction
        NN // Réseau de neurones passé en paramètre de la fonction
    )

    // Défiinition du mesh du personnage
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

    // ball.mesh.add(new THREE.AxesHelper(1))

    scene.add(ball.mesh) // On ajoute le personnage à la scene

    console.log("🎉", ball.id, "is born!") // On met un message dans la console

    return ball // On retourne le personnage
}

const crossover = (super1, super2, scene, spheres) => { // Fonction décrivant ce qu'il se passe lors du crossover (reproduction) - BIOEVOLUTION et NEUROEVOLUTION
    const kid1Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness, // Valeur d'attractivité choisie aléatoirement parmi celle d'un de ses deux parents pour le premier enfant
        strength: random3() < .5 ? super1.strength : super2.strength, // Valeur de force choisie aléatoirement parmi celle d'un de ses deux parents pour le premier enfant
        speed: random3() < .5 ? super1.speed : super2.speed, // Valeur de vitesse choisie aléatoirement parmi celle d'un de ses deux parents pour le premier enfant
    }

    const kid2Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness, // Valeur d'attractivité choisie aléatoirement parmi celle d'un de ses deux parents pour le deuxième enfant
        strength: random3() < .5 ? super1.strength : super2.strength, // Valeur de force choisie aléatoirement parmi celle d'un de ses deux parents pour le deuxième enfant
        speed: random3() < .5 ? super1.speed : super2.speed // Valeur de vitesse choisie aléatoirement parmi celle d'un de ses deux parents pour le deuxième enfant
    }

    kid1Stats.nn = { // Chacun des poids des neuroes du réseau de neurones du premier enfant est choisi aléatoirement parmi un de ses deux parents pour chaque poids
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

    kid2Stats.nn = { // Chacun des poids des neuroes du réseau de neurones du deucième enfant est choisi aléatoirement parmi un de ses deux parents pour chaque poids
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

    // On fait en sorte que les deux enfant aient des statistiques différentes
    // On va peut-être virer ça ?
    if (kid1Stats.attractiveness == super1.attractiveness) kid2Stats.attractiveness = super2.attractiveness
    else kid2Stats.attractiveness = super1.attractiveness

    if (kid1Stats.strength == super1.strength) kid2Stats.strength = super2.strength
    else kid2Stats.strength = super1.strength

    if (kid1Stats.speed == super1.speed) kid2Stats.speed = super2.speed
    else kid2Stats.speed = super1.speed

    // On génère les nouveaux personnages
    let kid1 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid1Stats.attractiveness, kid1Stats.strength, kid1Stats.speed, scene, kid1Stats.nn)
    let kid2 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid2Stats.attractiveness, kid2Stats.strength, kid2Stats.speed, scene, kid2Stats.nn)

    // On tire aléatoirement un des deux enfants pour être un mutant
    Math.floor(Math.random()) < .5 ? mutation(kid1) : mutation(kid2)

    // Chacun des deux enfants verra son réseau de neurones muté
    NNMutation(kid1)
    NNMutation(kid2)

    // On ajoute les deux enfants à la liste des personnages
    spheres.push(kid1)
    spheres.push(kid2)

    // Les deux parents regagnent chacun 1000 points de vie dans la limite de 1500 max
    super1.life < maxHP - 1000 ? super1.life += 1000 : super1.life = maxHP
    super2.life < maxHP - 1000 ? super2.life += 1000 : super2.life = maxHP
}

const fight = (ball1, ball2, index1, index2, scene, spheres) => { // Fonction dévriant ce qu'il se passe quand deux personnages mâles se recontrent (ils se combattent)
    if (ball1.strength > ball2.strength) { // On regarde lequel des deux à la plus de force, dans ce cas, ball1 est plus fort que ball2
        spheres.splice(index2, 1) // on retire ball2 de la liste des personnages
        scene.remove(ball2.mesh) // on retire ball2 de la scene
        console.log("🪓", ball2.id, "was slain by", ball1.id) // On affiche un message dans la console
        ball1.life < maxHP - 500 ? ball1.life += 500 : ball1.life = maxHP // ball1 regagne 500 points de vie dans la limite de 1500 max
    } else {
        spheres.splice(index1, 1)
        scene.remove(ball1.mesh)
        console.log("🪓", ball1.id, "was slain by", ball2.id)
        ball2.life < maxHP - 500 ? ball2.life += 500 : ball2.life = maxHP
    }
}

const death = (ball, index, scene, shperes) => { // Fonction décricant ce qu'il se passe lorsqu'un personnage n'a plus de points de vie
    shperes.splice(index, 1) // le personnage est retiré de la liste des personnages
    scene.remove(ball.mesh) // Le personnage est retiré de la scene
    console.log("💀", ball.id, "died of old age") // Un message est affiché dans la console
}

const enhanceAttractiveness = (ball1, ball2) => { // Fonction décrivant ce qu'il se passe quand deux personages femelles se rencontrent (ils augmentent chacun leur attractivité)
    if (ball1.attractiveness < ball2.attractiveness) { // On regarde lequel des deux à le plus d'attractivité, dans ce cas c'est ball2
        console.log("👏", ball2.id, "makes", ball1.id, "more attractive") // on affiche un message dans la console
        ball1.attractiveness += attractivenessBoost // ball1 voit son attractivité augmenter de 0.001
        ball2.life < maxHP - 20 ? ball2.life += 20 : ball2.life = maxHP // ball2 regagne 20 points de vie dans la limite de 1500 max
    } else {
        console.log("👏", ball1.id, "makes", ball2.id, "more attractive")
        ball2.attractiveness += attractivenessBoost
        ball1.life < maxHP - 20 ? ball1.life += 20 : ball1.life = maxHP
    }

    ball1.mesh.children[0].scale.set(1 + ball1.attractiveness / 4 + 0.2, 1 + ball1.attractiveness / 4 + 0.2, 1 + ball1.attractiveness / 4 + 0.2);
    ball2.mesh.children[0].scale.set(1 + ball2.attractiveness / 4 + 0.2, 1 + ball2.attractiveness / 4 + 0.2, 1 + ball2.attractiveness / 4 + 0.2);
}

const mutation = (kid) => { // Fonction permettant la mutation des stats d'un personnage - BIOEVOLUTION
    console.log("🕴", kid.id, "is a mutant") // On affiche un message dans la console
    const statIndex = Math.floor(Math.random() * 3) // on tire une statistique aléatoirement
    if (statIndex == 0) kid.attractiveness = random3() // la statistie tirée est randomizée
    else if (statIndex == 1) kid.strength = random3()
    else if (statIndex == 2) kid.speed = random3()
}

const NNMutation = (kid) => { // Fonction permettant la mutation d'un réseau de neurones - NEUROEVOLUTION
    const layerIndex = Math.floor(Math.random() * 2) // On tire aléatoirement une couche (couche d'entrée et couche cahcée)
    if (layerIndex == 0) {
        const weightIndex = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 5)] // [0~2, 0~4] // On tire aléatoireemnt un des poids de la couche selectionnée
        kid.nn.w[weightIndex[0]][weightIndex[1]] = random3() // Ce poids est randomizé
    } else if (layerIndex == 1) {
        const weightIndex = [Math.floor(Math.random() * 5), Math.floor(Math.random() * 1)] // [0~4, 0~1]
        kid.nn.wh[weightIndex[0]][weightIndex[1]] = random3()
    }
}

const meet = (ball1, ball2, index1, index2, scene, spheres) => { // Fonction décrivant ce qu'il se passe quand deux personnages se rencontrent - BIOEVOLUTION
    if (ball1.sex != ball2.sex) { // si les deux personnages sont de sexe différents
        if (Math.abs(ball1.attractiveness - ball2.attractiveness) <= minAttractivenessNecessary) { // on regarde si les deux personnages n'on pas une différence d'attractivité trop importante
            crossover(ball1, ball2, scene, spheres) // Si c'est bon, ils se reproduisent
            if (ball1.sex == "F") { // Le personnage femelle meurt
                scene.remove(ball1.mesh) // il est retiré de la scene
                spheres.splice(index1, 1) // il est retiré de la liste des personnages
            } else {
                scene.remove(ball2.mesh)
                spheres.splice(index2, 1)
            }
        } else { // Si la différence d'attractivité est trop importante, ils continuent leur chemin
            console.log("👨‍🦯", ball1.id, "&", ball2.id, "won't mate") // un message est affiché dans la console
        }
    } else if (ball1.sex == "M" && ball2.sex == "M") { // Si les deux personnages sont des mâles
        fight(ball1, ball2, index1, index2, scene, spheres) // Ils se battent
    } else if (ball1.sex == "F" && ball2.sex == "F") { // Si les deux personnages sont  des femelles
        enhanceAttractiveness(ball1, ball2) // Ils augmenentn leur attractivité
    }
}

function moveSpheres(spheres, hitMeshs) { // Fonction permettant aux personnages de se déplacer
    for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];
        const speed = ball.speed / 10 + 0.01;
        // On calcule leur position en fonction de leur position actuelle, de leur angle et de leur vitesse
        ball.pos.x += Math.cos(ball.angle) * speed;
        ball.pos.z += Math.sin(ball.angle) * speed;

        if (ball.pos.distanceTo(new THREE.Vector3(0, .2, 0)) > area) { // Ils changent de direction s'ils arrivent à la limite
            let angle = Math.atan2(ball.pos.z, ball.pos.x)
            ball.angle = angle + Math.PI + ((Math.random() - .5) / 2)
        }

        // On met à jour la position et la rotation du mesh du personnage
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

function NNchange(ball1, ball2) { // Fonction permettant aux réseau de neurones des personnages - RESEAU DE NEURONES
    // Ecriture des neurones d'entrée
    ball1.nn.ni[0] = ball1.distance(ball2) / 52 // Le premier neurone d'entrée regarde la distance avec un autre personnage (52 étant la distance max mesurable en théorie ça permet d'avoir une valeur entre 0 et 1)
    ball1.nn.ni[1] = ball1.relativeSpeed(ball2) / (maxSpeed * 2) // Le deuxième neurone d'entrée regarde la vitesse relative avec le même personnage (la vitesse relative maximale entre deux individus est de 2 * maxspeed cela permet des valeurs entre -1 et 1)
    ball1.nn.ni[2] = ball1.sexualityOf(ball2) // le troisième neurone d'entrée regarde le sexe du même personnage

    // On calcule la valeur des neurones cachés selon la formule suivante : 
    // https://latex.codecogs.com/svg.image?&space;nh_i=\frac{1}{1&plus;e^{\sum_{k=0}^{2}{ni_k*w_{i,k}}}}
    ball1.nn.nh[0] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][0] + ball1.nn.ni[1] * ball1.nn.w[1][0] + ball1.nn.ni[2] * ball1.nn.w[2][0]))   
    ball1.nn.nh[1] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][1] + ball1.nn.ni[1] * ball1.nn.w[1][1] + ball1.nn.ni[2] * ball1.nn.w[2][1]))
    ball1.nn.nh[2] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][2] + ball1.nn.ni[1] * ball1.nn.w[1][2] + ball1.nn.ni[2] * ball1.nn.w[2][2]))
    ball1.nn.nh[3] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][3] + ball1.nn.ni[1] * ball1.nn.w[1][3] + ball1.nn.ni[2] * ball1.nn.w[2][3]))
    ball1.nn.nh[4] = 1/(1+Math.exp(ball1.nn.ni[0] * ball1.nn.w[0][4] + ball1.nn.ni[1] * ball1.nn.w[1][4] + ball1.nn.ni[2] * ball1.nn.w[2][4]))

    // On calcule la valeur des neurones de sortie selon la formule suivante :
    // https://latex.codecogs.com/svg.image?&space;no_i=\frac{1}{1&plus;e^{\sum_{k=0}^{4}{nh_k*w_{i,k}}}}
    ball1.nn.no[0] = 1/(1+Math.exp(ball1.nn.nh[0] * ball1.nn.wh[0][0] + ball1.nn.nh[1] * ball1.nn.wh[1][0] * ball1.nn.nh[2] * ball1.nn.wh[2][0] + ball1.nn.nh[3] * ball1.nn.wh[3][0] + ball1.nn.nh[4] * ball1.nn.wh[4][0]))
    ball1.nn.no[1] = 1/(1+Math.exp(ball1.nn.nh[0] * ball1.nn.wh[0][1] + ball1.nn.nh[1] * ball1.nn.wh[1][1] * ball1.nn.nh[2] * ball1.nn.wh[2][1] + ball1.nn.nh[3] * ball1.nn.wh[3][1] + ball1.nn.nh[4] * ball1.nn.wh[4][1]))

    backPropagation(ball1) // Appel de la fonction de back propagration pour permettre aux personnages de s'entraîner
}

function backPropagation(ball) {

    // https://www.youtube.com/watch?v=tUoUdOdTkRw

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

    // valeur des deltas des neurones de sortie 
    // selon la formule suivnate : https://latex.codecogs.com/svg.image?\delta&space;no_i=oo_i(1-oo_i)(\textup{target}_i-oo_j)
    const dno6 = oo[0] * (1-oo[0]) * (target[0]-oo[0]) // no 0
    const dno7 = oo[1] * (1-oo[1]) * (target[1]-oo[1]) // no 1

    // valeur des deltas des neurones cahcés
    // selon la formule suivante : https://latex.codecogs.com/svg.image?\delta&space;nh_i=ho_i(1-oh_i)\sum_{k}{\delta_k&space;w_{k,j}}
    const dnh1 = ho[0] * (1-ho[0]) * ((dno6*hw[0][0]) + (dno7*hw[0][1])) // nh 0
    const dnh2 = ho[1] * (1-ho[1]) * ((dno6*hw[1][0]) + (dno7*hw[1][1])) // nh 1
    const dnh3 = ho[2] * (1-ho[2]) * ((dno6*hw[2][0]) + (dno7*hw[2][1])) // nh 2
    const dnh4 = ho[3] * (1-ho[3]) * ((dno6*hw[3][0]) + (dno7*hw[3][1])) // nh 3
    const dnh5 = ho[4] * (1-ho[4]) * ((dno6*hw[4][0]) + (dno7*hw[4][1])) // nh 4

    // calcul des deltas
    // selon la formule suivante : https://latex.codecogs.com/svg.image?\Delta&space;w\rm{no}_{i,j}=\eta\delta_j&space;ho_j
    // et aussi cette fomule : https://latex.codecogs.com/svg.image?\Delta&space;w\rm{nh}_{i,j}=\eta\delta_j&space;io_j
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


function checkCollisions(spheres, scene) { // Fonction qui vérifie que deux personnages se touchent ou pas // fonction lancée à chaque frame
    for (let i = 0; i < spheres.length; i++) {
        for (let j = 0; j < spheres.length; j++) {
            if (i != j) {
                let ball1 = spheres[i];
                let ball2 = spheres[j];

                const distance = ball1.pos.distanceTo(ball2.pos);
                const sumRadii = ball1.mesh.geometry.parameters.radius + ball2.mesh.geometry.parameters.radius;

                NNchange(ball1, ball2) // On met à jour le réseau de neurones des personnages

                if (ball1.speed > minSpeed && ball1.speed < maxSpeed) ball1.speed += ball1.nn.no[0] / 1000; // on met à jour la vitesse du personnage en fonction de la première valeur de sortie du réseau de neurones
                ball1.angle += ball1.nn.no[1] / 50 // on met à jour l'angle du personnage en fonction de la première valeur de sortie du réseau de neurones

                if (distance < sumRadii) {
                    meet(ball1, ball2, i, j, scene, spheres) // Si deux personnages se touchent on regarde ce que ça fait
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

export { moveSpheres, checkCollisions, generateSphere, death }
