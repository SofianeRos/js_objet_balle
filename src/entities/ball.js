import { randomBetween, randomColor } from "../utils/random.js";

// [Étape 3] Classe de base : Ball gère état + dessin + physique simple
export class Ball {
    constructor({ x, y, vx, vy, size, color }) {
        this.x = x;
        this.y = y;
        this.vx = vx || 1;
        this.vy = vy || 1;
        this.size = size;
        this.color = color || randomColor();
    }

    // [Étape 3a] Fabrique statique : créer une balle avec des valeurs aléatoires
    static createRandom(bounds, config, positionOverride) {
        const { width, height } = bounds;
        const size = randomBetween(config.minSize, config.maxSize);
        const vx = randomBetween(-config.maxSpeed, config.maxSpeed) || 1;
        const vy = randomBetween(-config.maxSpeed, config.maxSpeed) || 1;
        const x = positionOverride?.x ?? randomBetween(size, width - size);
        const y = positionOverride?.y ?? randomBetween(size, height - size);
        return new this({
            x,
            y,
            vx,
            vy,
            size,
            color: randomColor()
        });
    }

    // [Étape 3b] Rendu
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    // [Étape 3c] Rebonds sur les bords
    bounce(bounds) {
        const { width, height } = bounds;
        if (this.x + this.size >= width || this.x - this.size <= 0) this.vx = -this.vx;
        if (this.y + this.size >= height || this.y - this.size <= 0) this.vy = -this.vy;
    }

    // [Étape 3d] Mouvement basique
    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    // [Étape 3e] Détection de collision
    collidesWith(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const radiusSum = this.size + other.size;
        return dx * dx + dy * dy < radiusSum * radiusSum;
    }

    // [Étape 3f] Résolution simple avec séparation + échange de vitesse normale
    resolveCollision(other) {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        const radiusSum = this.size + other.size;

        // si même centre, introduire une petite différence pour éviter NaN
        if (dist === 0) {
            dx = Math.random() * 0.02 - 0.01;
            dy = Math.random() * 0.02 - 0.01;
            dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        }

        // vecteur normal
        const nx = dx / dist;
        const ny = dy / dist;

        // séparer les centres (projection sur la normale)
        const overlap = radiusSum - dist;
        if (overlap > 0) {
            const correction = overlap / 2;
            this.x += nx * correction;
            this.y += ny * correction;
            other.x -= nx * correction;
            other.y -= ny * correction;
        }

        // vitesses projetées sur la normale (échange élastique simplifié)
        const pThis = this.vx * nx + this.vy * ny;
        const pOther = other.vx * nx + other.vy * ny;

        const pThisTan = this.vx * -ny + this.vy * nx;
        const pOtherTan = other.vx * -ny + other.vy * nx;

        // échange des composantes normales, conserver tangentielles
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