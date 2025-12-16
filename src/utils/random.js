// Fonction utilitaire pour générer une couleur aléatoire

export const randomBetween = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

//méthode qui retourne la couleur random
export const randomColor = () => {
    return `rgb(${randomBetween(0,255)},${randomBetween(0,255)},${randomBetween(0,255)})`
}

//tirage proportionnel des entitées
export function pickShape(shapeMix){
    const r = Math.random();
    let acc = 0;
    for(const [shape, weight] of Object.entries(shapeMix)){
        acc += weight;
        if(r <= acc) return shape;
    }
    return "ball";
}