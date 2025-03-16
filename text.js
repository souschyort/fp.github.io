
export class Text {
    constructor(ctx, text, x, y ){
        this.ctx = ctx;
        this.ctx.font = '50px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.lineWidth = 8;
        this.ctx.strokeStyle = '#533846';
        this.ctx.textBaseline = 'top';
        this.ctx.strokeText(text,x,y);
        this.ctx.fillText(text,x,y);
    }
}