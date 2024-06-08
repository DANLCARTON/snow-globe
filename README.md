# Snow Globe

Snow Globe est le projet réalisé dans le cadre du rendu final du cours d'Intelligence Artificielle en IMAC5. 

## Principe

Snow Globe est une simulation 3D sous Three.js représentant une Boule à Neige à l'intérieur de laquelle il se trouve diverses choses, notamment des bonhommes de neige autonomes, une météo qui varie et le tout dans un environnement urbain toujours différent. 

Le principe de ce projet était d'y incorporer un maximum des notions et des types d'intélligences artificielles vues pendant le cours.

## Types d'intelligence artificielles trouvables dans le projet

### 1. Automate cellulaire

Un automate cellulaire, basé sur une simulation du jeu la vie de John Conway est utilisé dans le projet. C'est une réinterprêtation en 3D dans laquelle chaque cellule est représentée par un cube et où chaque généation se place au dessus de la précédente. Elle est utilisée pour créer des immeubles de formes variées qui se placent dans le décor. 

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/78494b99-ed6d-46b9-98be-5a91b5fca4fa)

La simulation est visible de manière indépendante ici : https://ericthiberge.fr/conwayStructures/ Ce sont notamment les modèles "Pulsar", "Pentadecathlon" et "Die Hard" qui sont utilisés ici

### 2. Diagramme de Voronoï

Le tracé d'un diagramme de Voronoï, utilisant les côtés des polygones créés à partir de points placés aléatoirement sur la surface, est utilisé pour créer un réseau de routes. L'intérieur des routes est pavé et on y trouve des étangs. Les immeubles sont placés systématiquement au niveau des points. 

Il avait été envisagé d'utiliser un L-System ou éventuellement une fonction de réduction du paaquet d'ondes pour réaliser ces routes. 

Le modèle de routes utilisant le l-system est visible de manière indépendante ici : https://ericthiberge.fr/l-urban/

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/228c86e4-0ebd-49db-aa7a-ce0026073b4a)

### 3. Chaîne de Markov

Une chaîne de Markov a été utilisée pour déterminer quelle météo il devait faire dans la boule et pour pouvoir changer d'un temps a un autre. Il y a 7 temps possibles, et toutes les probabilités ont été estimées pour permettre un rendu réaliste. La texture du ciel de la boule change en fonction de la météo qu'il fait

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/d8e60fa7-ab50-4f4a-bf39-162e22e4e17c)

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/fe89814d-f0ad-48c1-9960-781290d1fb5b)

### 4. L-System

Pour la représentation des certains événements météorologiques, d'autres algorithmes ont été utilisés. Notamment, pendant l'état "Éclair", des éclairs apparaissent. Ces éclair sont générés grâce à un L-System. Le L-Sytem part avec des paramètres donnés et sera toujours le même à chaque fois. Il part du sommet de la boule et va vers le sol grace à son axiome de départ `FF[/F*F-F]F[*F/F+F]F` dans laquelle à chaque caractères correspond une action. 

- "F" → Avance
- "-" → Tourne vers la gauche de quelques degrés
- "+" → Tourne vers la droite de quelques degrés
- "*" → Tourne vers l'avant de quelques degrés
- "/" → Tourne vers l'arrière de quelques degrés
- "[" → Sauvegarde cette position
- "]" → Retourne à la dernière position sauvegardée

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/c89e6b17-4461-417b-9568-76bc7a672a22)

### 5. Fractales

Pour la réprésentation de l'événement "Neige". Des flocons de neige tombent. Ces flocons de neiges sont générés à partir d'un modèle de fractale. Ce sont en l'occurence des fractales en flocon de Koch à base tétraédrique où les itérations se font sur les sommets. 

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/01fac700-8379-4c8a-86ac-166dce1d05f3)


Le modèle de fracale utilisé est visible de manière indépendante ici : https://ericthiberge.fr/fancy-snowflakes/ avec le paramètre "Shape" sur "Tetrahedron"

Cet élément et tous ceux cités précedemment ce sont que des éléments de décors et, bien que cela ait été envisagé, n'ont aucune influence sur le comportement des bonhommes de neige.

### 6. Bio-evolution

Des bonhommes de neige se déplacent dans la boule à neige. Il y en a deux genres, des "mâles" et des "femelles". Tous les bonhommes de neige disposent de caractéristiques qui leur sont propes : une caractéritique de "force" et une caractéristique "d'attractivité". Ils ont aussi une espérence de vie. Lorsqu'ils se rencontrent, il peut se passer diverses choses en fonction de leur genre et de leur caractéristiques. Si se sont deux mâles, celui qui a le plus de force tue l'autre et il regagne beaucoup d'espérence de vie. Si ce sont deux femelles elles augmentent chacune l'attractivité de l'autre et elles regagnent un peu d'espérence de vie pour chaque frame passées ensembles. Mais le plus important : Si un mâle et une femelle se rencontrent, une statistique de "fitness" est calculée à partir de l'attractivité des deux bonhommes de neige, et si ce fitness ne dépasse pas un certain seuil, les bonhommes de neige se reproduisent. Deux enfants naissent et peuvent hériter des caractéristiques de force et d'attractivité d'un de leurs deux parents. Dans tous les cas, un des deux enfants verra une de ses caractéristiques muter et elle sera choisie aléatoirement et un des deux parents mourra. 

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/4db8f25c-63a9-4aca-9843-a1bb759a0ac4)


Cela permet d'observer une évolution de la population. Une version indépendante de cette simulation est visible ici : https://ericthiberge.fr/living-balls/ 

### 7. Réseau de neurones

Chaque bonhomme de neige a un réseau de neuronne qui lui est prope et qui régit ses déplacements. Tous les réseaux de neurones dispose d'une couche en entrée avec trois neurones, d'une couche cachée avec cinq neurones et d'un couche de sortie avec deux neurones. 

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/a6978fe5-455f-47df-a78c-e00b7e58385a)

- Le neurone d'entrée I1 mesure la distance du bonhomme de neige avec les autres
- Le neurone d'entrée I2 mesure la vitesse relative du bonhomme de neige avec les autres
- Le neurone d'entrée I3 regarde le genre des autres bonhommes de neige
- La valeur du neurone de sortie O1 est utilisée par le bonhomme de neige pour modifier sa vitesse
- La valeur du neurone de sortie O2 est utilisée par le bonhomme de neige pour modifier sa direction

Les valeurs des poids des liens entre les neurones sont au début de la simulation déterminés aléatoirement, mais tout au long de sa vie, les réseaux de neurones s'entraînent grâca à un algorithme de Back-Propagation vers un modèle optimisé déterminé à l'avance. 

### 8. Neuro-évolution

Enfin, lors de la reproduction des bonhommes de neige, Le principe de bio-évolution est aussi appliqué sur réseaux de neurones des enfants, qui héritent aléatoirement des poids des liens entre des neurones des parents. On peut voir ça comme une transmission du savoir des parents à leur enfants, en plus de leur génétique. Ici aussi, les enfants peuvent être soumis à une forme de mutation, ou un poids sera tiré aléatoirement. 

![image](https://github.com/DANLCARTON/snow-globe/assets/78015609/241e28cc-9860-4b31-bdc7-912f1962a921)

Ainsi entre l'entraînement du réseau de neurone et la transmission aux enfants, si les bonhommes de neige sont assez performants au début de la simulation, la population ne fera qu'augmenter de plus en plus rapidement. 
