import { randomBetween, randomColor } from "../utils/random.js";

export class Ball {
    constructor({ x, y, vx, vy, color, size }) {
        this.x = x;
        this.y = y;
        this.vx = vx || 1;
        this.vy = vy || 1;
        this.color = color || randomColor();
        this.size = size;
    }

    //! fabrication statique cree une balle avec des parametres aleatoires
    static createRandom(bounds, config, positionOverride) {
        const { width, height } = bounds;
        const size = randomBetween(config.minSize, config.maxSize);
        const vx = randomBetween(-config.maxSpeed, config.maxSpeed) || 1;
        const vy = randomBetween(-config.maxSpeed, config.maxSpeed) || 1;
        const x = positionOverride?.x ?? randomBetween(size, width - size);
        const y = positionOverride?.y ?? randomBetween(size, height - size);
        return new this({ x, y, vx, vy, size, color: randomColor() });

    }

    //! dessin du rendu de la balle
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    //! gestion des colisions avec les bords
    bounce(bounds) {
        const { width, height } = bounds;
        if (this.x + this.size >= width || this.x - this.size <= 0) this.vx = -this.vx;
        if (this.y + this.size >= height || this.y - this.size <= 0) this.vy = -this.vy;


    }

    //! gestion des mouvements
    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    collideWith(other) {
        const dx = this .x - other.x;
        const dy = this.y - other.y;
        const radiusSum = this.size + other.size;
        return dx * dx + dy * dy < radiusSum * radiusSum;
    }

    resolveCollision(other) {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        const radiusSum = this.size + other.size;

        //! si 2 objet on le meme centre
        if (dist === 0) {
            //! on ajoute une petite difference pour evite NaN
            dx = Math.random() * 0.02 - 0.01;
            dy = Math.random() * 0.02 - 0.01;
            dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        }

        //! vecteur normal 
        const nx = dx / dist;
        const ny = dy / dist;

        //! separer les centres
        const overlap = radiusSum - dist;
        if (overlap > 0) {
            const correction = overlap / 2;
            this.x += nx * correction;
            this.y += ny * correction;
            other.x -= nx * correction;
            other.y -= ny * correction;
        }

        //! vitesse projetee sur la normale 
        const pThis = this.vx * nx + this.vy * ny;
        const pOther = other.vx * nx + other.vy * ny;

        const pThisTan = this.vx * - ny + this.vy * nx;
        const pOtherTan = other.vx * -ny + other.vy * nx;

        //! echange des composantes normales conserver la tangente
        const newThisVx = pOther * nx + pThisTan * -ny;
        const newThisVy = pOther * ny + pThisTan * nx;
        const newOtherVx = pThis * nx + pOtherTan * -ny;
        const newOtherVy = pThis * ny + pOtherTan * nx;

        this.vx = newThisVx || (Math.random() > 0.5 ? 1 : -1);
        this.vy = newThisVy || (Math.random() > 0.5 ? 1 : -1);
        other.vx = newOtherVx || (Math.random() > 0.5 ? 1 : -1);
        other.vy = newOtherVy || (Math.random() > 0.5 ? 1 : -1);

        const newColor = randomColor();
        this.color = newColor;
        other.color = newColor;
    }
}