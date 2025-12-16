import { Ball } from "./ball";

export class Heart extends Ball{
    draw(ctx) {
        ctx.beginPath();
        const curveRadius = this.size * 0.25;
        ctx.fillStyle = this.color;

        for (let t=0; t<=2 ; t+= 0.05){
            const xPos = this.x + 16 * Math.pow(Math.sin(t), 3) * curveRadius;
            const yPos = 
                this.y - (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * curveRadius;      
                ctx.lineTo(xPos, yPos);
        }
        ctx.closePath();
        ctx.fill();
    }
}