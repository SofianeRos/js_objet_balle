import { Ball } from "./entities/ball.js";
import { Star } from "./entities/star.js";
import { Heart } from "./entities/heart.js";
import { pickShape } from "./utils/random.js";
import { config } from "./config.js";

// [Étape 5] Engine : orchestre boucle, événements, créations et collisions
export class Engine {
    constructor(canvas, userConfig = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.entities = [];
        this.running = true;
        this.config = { ...config, ...userConfig };
        this.selectedShape = "auto"; // ball | star | heart | auto
        this.resize();
        this.bindEvents();
        this.populate();
        this.updatePaletteUI();
    }

    // [Étape 5a] Accès simple aux bornes du canvas
    get bounds() {
        return { width: this.width, height: this.height };
    }

    // [Étape 5b] Gérer le ratio d’affichage (retina) et le redimensionnement
    resize() {
        const ratio = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * ratio;
        this.canvas.height = this.height * ratio;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(ratio, ratio);
    }

    // [Étape 5c] Événements clavier + souris
    bindEvents() {
        window.addEventListener("resize", () => {
            this.resize();
            this.reseed();
        });

        window.addEventListener("keydown", (e) => {
            const code = e.code; // indépendant du layout (Digit1, Digit2, ...)
            const key = e.key;   // dépendant du layout (utile sur certains claviers)
            if (key === "p" || key === "P") this.running = !this.running;
            if (key === "+") this.addEntity(undefined, this.selectedShape);
            if (key === "-") this.removeEntity();

            let newShape = null;
            if (code === "Digit1" || key === "1") newShape = "ball";
            if (code === "Digit2" || key === "2") newShape = "star";
            if (code === "Digit3" || key === "3") newShape = "heart";
            if (code === "Digit0" || key === "0") newShape = "auto";
            if (newShape) {
                this.selectedShape = newShape;
                this.updatePaletteUI();
            }
        });

        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addEntity({ x, y }, this.selectedShape);
        });
    }

    // [Étape 5d] Peupler selon la config initiale (ici 0 => scène vide)
    populate() {
        while (this.entities.length < this.config.ballCount) {
            this.entities.push(this.createRandomEntity());
        }
    }

    // [Étape 5e] Réinitialiser les entités (ex: lors d’un resize)
    reseed() {
        this.entities.length = 0;
        this.populate();
    }

    // [Étape 5f] Ajouter/supprimer une entité
    addEntity(position, shapeOverride = "auto") {
        this.entities.push(this.createRandomEntity(position, shapeOverride));
        this.updatePaletteUI();
    }

    removeEntity() {
        if (this.entities.length > 0) this.entities.pop();
    }

    // [Étape 5g] Fabrique d’entité polymorphe selon la forme choisie
    createRandomEntity(position, shapeOverride = "auto") {
        const shape = shapeOverride === "auto" ? pickShape(this.config.shapeMix) : shapeOverride;
        const bounds = this.bounds;
        const cfg = this.config;
        const pos = position ? { x: position.x, y: position.y } : undefined;
        let entity;
        switch (shape) {
            case "star":
                entity = Star.createRandom(bounds, cfg, pos);
                break;
            case "heart":
                entity = Heart.createRandom(bounds, cfg, pos);
                break;
            default:
                entity = Ball.createRandom(bounds, cfg, pos);
        }
        this.resolveSpawnOverlap(entity);
        return entity;
    }

    // [Étape 5h] Évite le spawn exactement sur un autre objet
    resolveSpawnOverlap(entity) {
        const maxAttempts = 12;
        const jitterBase = entity.size * 1.2;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let overlapping = false;
            for (const other of this.entities) {
                if (entity.collidesWith(other)) {
                    overlapping = true;
                    // petit décalage aléatoire pour sortir du chevauchement
                    entity.x += (Math.random() * 2 - 1) * jitterBase;
                    entity.y += (Math.random() * 2 - 1) * jitterBase;
                    break;
                }
            }
            if (!overlapping) return;
        }
    }

    // [Étape 5i] Mise à jour physique et collisions
    update() {
        for (const entity of this.entities) {
            entity.bounce(this.bounds);
            entity.move();
        }
        for (let i = 0; i < this.entities.length; i++) {
            for (let j = i + 1; j < this.entities.length; j++) {
                if (this.entities[i].collidesWith(this.entities[j])) {
                    this.entities[i].resolveCollision(this.entities[j]);
                }
            }
        }
    }

    // [Étape 5j] Rendu
    render() {
        this.ctx.fillStyle = this.config.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
        for (const entity of this.entities) {
            entity.draw(this.ctx);
        }
    }

    // [Étape 5k] Boucle principale
    loop() {
        if (this.running) {
            this.update();
            this.render();
        }
        requestAnimationFrame(() => this.loop());
    }

    // [Étape 5l] Démarrage
    start() {
        this.loop();
    }

    // [Étape 5m] Synchro UI palette
    updatePaletteUI() {
        const palette = document.getElementById("palette");
        if (!palette) return;
        for (const btn of palette.querySelectorAll("button")) {
            btn.classList.toggle("active", btn.dataset.shape === this.selectedShape);
        }
    }
}
