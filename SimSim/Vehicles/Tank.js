// ===========================
//          TankType
// ===========================

class TankType{
    //constructor( turrets, sails, foils ){
    constructor( turretType ){
        this.lcog     = -0.5;
        this.length   =  6.0;
        this.width    =  2.0;
        this.turret   = turretType;
        //this.gunType2 = gunType2;
    }
}

// ===========================
//          Tank
// ===========================

class Tank extends DynamicBody2D{
    constructor( type ){
        super();
        //this.name = name;
        this.type   = type;
        this.turret = new Turret( type.turret ); 
    }

    draw(screen){
        let ctx=screen.ctx;
        var x,y;
        //let p = vec2.create();
        let x0=this.pos[0],y0=this.pos[1];
        let dx=this.rot[0],dy=this.rot[1];
        let lFw=this.type.length*0.5+this.type.lcog, lBk=this.type.length*0.5-this.type.lcog;
        let width = this.type.width;
        ctx.beginPath();
        //console.log( x0, y0, dx, dy, width, lFw, lBk );
        ctx.moveTo( screen.x2pix(x0 +dx*lFw +dy*width ), screen.y2pix(y0 +dy*lFw -dx*width ) );
        ctx.lineTo( screen.x2pix(x0 +dx*lFw -dy*width ), screen.y2pix(y0 +dy*lFw +dx*width ) );
        ctx.lineTo( screen.x2pix(x0 -dx*lBk -dy*width ), screen.y2pix(y0 -dy*lBk +dx*width ) );
        ctx.lineTo( screen.x2pix(x0 -dx*lBk +dy*width ), screen.y2pix(y0 -dy*lBk -dx*width ) );
        ctx.lineTo( screen.x2pix(x0 +dx*lFw +dy*width ), screen.y2pix(y0 +dy*lFw -dx*width ) );
        ctx.stroke();
        //ctx.bezierCurveTo(140, 10, 388, 10, 388, 170);s
        this.turret.draw(screen, this);
    }

}