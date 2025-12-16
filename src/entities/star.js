import { Ball } from "./ball.js";

export class Star extends Ball {
    draw(ctx) {
        const spikes = 5;
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
       
        for(let i = 0; i < spikes; i++) {
            const outerAngle =((i * 2) /spikes) * Math.PI;
            ctx.lineTo(
                this.x + Math.cos(outerAngle) * outerRadius,
                this.y + Math.sin(outerAngle) * outerRadius
            )
            const innerAngle =((i * 2 + 1) / spikes) * Math.PI;
            ctx.lineTo(
                this.x + Math.cos(innerAngle) * innerRadius,
                this.y + Math.sin(innerAngle) * innerRadius
            )
        }
        ctx.closePath();
        ctx.fill();
    }
}