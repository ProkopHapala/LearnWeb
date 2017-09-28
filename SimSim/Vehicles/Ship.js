"use strict";

var Ship_temps = {
	vwater   : vec2.create()
};


class Environment2D{
    constructor( ){
        this.water_speed = vec2.create();
        this.wind_speed  = vec2.create();
    }
}

// ===========================
//          ShipType
// ===========================

class ShipType{
    //constructor( turrets, sails, foils ){
    constructor( ){
        this.lcog    = 1.0;
        this.length  = 20.0;
        this.width   = 2.0;
        this.foils   = [];
        this.sails   = [];
        this.turrets = [];
    }
}

// ===========================
//          Ship
// ===========================

class Ship extends DynamicBody2D{
    constructor( name, type ){
        super();
        this.name = name;
        //for( );
        this.type = type;
        this.foils   = [];
        this.sails   = [];
        this.turrets = [];
    }

    evalForces( environment ){
        this.cleanForces();
        vec2.scaleAndAdd( this.force, this.force, this.rot, 2.0 ); // motor
        let v = Ship_temps.vwater;
        vec2.sub( v, environment.water_speed, this.vel );
        for( let i=0; i<this.foils.length; i++ ){
            //this.foils[i].applyAeroForce( this, this.vel, 1.0 );
            this.foils[i].applyAeroForce( this, v, 1.0 );
        }
    }

    update( dt, environment ){
        this.evalForces( environment );
        //console.log( this.force );
        this.move(dt);
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
        ctx.moveTo( screen.x2pix(x0+dx*lFw  ), screen.y2pix(y0+dy*lFw  ) );
        ctx.lineTo( screen.x2pix(x0-dy*width), screen.y2pix(y0+dx*width) );
        ctx.lineTo( screen.x2pix(x0-dx*lBk  ), screen.y2pix(y0-dy*lBk  ) );
        ctx.lineTo( screen.x2pix(x0+dy*width), screen.y2pix(y0-dx*width) );
        ctx.lineTo( screen.x2pix(x0+dx*lFw  ), screen.y2pix(y0+dy*lFw  ) );
        ctx.stroke();
        //ctx.bezierCurveTo(140, 10, 388, 10, 388, 170);
        for(let i=0; i<this.foils  .length; i++ ){ this.foils  [i].draw(screen, this); }
        for(let i=0; i<this.sails  .length; i++ ){ this.sails  [i].draw(screen, this); }
        for(let i=0; i<this.turrets.length; i++ ){ this.turrets[i].draw(screen, this); }
    }

}

