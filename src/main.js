import { Engine } from "./engine.js";
import { config } from "./config.js";

const canvas = document.querySelector("canvas");
const engine = new Engine(canvas, config);
engine.start();

const palette = document.getElementById("palette");
if (palette) {
    palette.addEventListener("click", (e) => {
        if (!(e.target instanceof HTMLButtonElement)) return;
        const shape = e.target.dataset.shape;
        if (!shape) return;
        engine.selectedShape = shape;
        for (const btn of palette.querySelectorAll("button")) {
            btn.classList.toggle("active", btn.dataset.shape === shape);
        }
    })
}