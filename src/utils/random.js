//! fonction utilitaire pour générer une couleur aléatoire
export const randomBetween = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1) + min);
};

//! fonction utilitaire pour générer une couleur aléatoire
export const randomColor = () => {
   return `rgb(${randomBetween(0, 255)}, ${randomBetween(0, 255)}, ${randomBetween(0, 255)})`;
}